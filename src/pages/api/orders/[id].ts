import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongoose from '../../../../src/lib/mongoose'
import { getCurrentUser } from '../../../../src/lib/auth'
import Order from '../../../../src/models/Order'
import sendOrderReceipt from '../../../../src/lib/mailer'

/**
 * GET /api/orders/[id]
 * - Authenticated: owner may fetch their order
 * - Guest: may fetch if `guestEmail` query param matches `order.guest_email`
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectMongoose()
  const user = await getCurrentUser(req)

  try {
    // GET: fetch order (owner or guest)
    if (req.method === 'GET') {
      const { id } = req.query as any
      if (!id) return res.status(400).json({ error: 'Missing order id' })

      // Load as a Mongoose document so we can modify and save (for one-time tokens)
      const orderDoc = await Order.findById(id)
      if (!orderDoc) return res.status(404).json({ error: 'Order not found' })

      const ord: any = orderDoc.toObject()

      // If order is owned by a user, require the same authenticated user
      if (ord.user) {
        if (!user) return res.status(401).json({ error: 'Not authenticated' })
        if (String(ord.user) !== String(user.id)) return res.status(403).json({ error: 'Forbidden' })
        return res.status(200).json({ order: ord })
      }

      // Guest order: require guestToken match (preferred) or guestEmail as fallback
      const guestToken = (req.query.guestToken as string) || ''
      const guestEmail = (req.query.guestEmail as string) || ''
      if (guestToken) {
        if (!ord.guest_token || String(ord.guest_token) !== String(guestToken)) return res.status(403).json({ error: 'Forbidden' })
        // Check expiration
        if (ord.guest_token_expires && new Date(ord.guest_token_expires).getTime() < Date.now()) return res.status(403).json({ error: 'Token expired' })

        // One-time token: invalidate token after successful use
        try {
          orderDoc.guest_token = undefined
          orderDoc.guest_token_expires = undefined
          // persist change
          await orderDoc.save()
        } catch (saveErr) {
          console.error('Failed to clear guest token on first use:', saveErr)
          // Don't block returning the order if save failed; still return the order object
        }

        // Return the fresh object representation (token cleared)
        return res.status(200).json({ order: orderDoc.toObject() })
      }

      if (!guestEmail || String(ord.guest_email || '').toLowerCase() !== String(guestEmail).toLowerCase()) {
        return res.status(403).json({ error: 'Forbidden: provide guestEmail matching the order' })
      }

      // GuestEmail matched. Invalidate any existing guest token so email-based
      // lookups are effectively single-use as well.
      try {
        if (orderDoc.guest_token) {
          orderDoc.guest_token = undefined
          orderDoc.guest_token_expires = undefined
          await orderDoc.save()
        }
      } catch (saveErr) {
        console.error('Failed to clear guest token after guestEmail lookup:', saveErr)
        // Do not block the response if saving fails; still return the order
      }

      return res.status(200).json({ order: orderDoc.toObject() })
    }

    // POST: resend receipt (owner or guest)
    if (req.method === 'POST') {
      const { id } = req.query as any
      if (!id) return res.status(400).json({ error: 'Missing order id' })

      const orderDoc = await Order.findById(id)
      if (!orderDoc) return res.status(404).json({ error: 'Order not found' })

      const ord: any = orderDoc.toObject()

      // If owned, require owner
      if (ord.user) {
        if (!user) return res.status(401).json({ error: 'Not authenticated' })
        if (String(ord.user) !== String(user.id)) return res.status(403).json({ error: 'Forbidden' })
        // populate items for nicer email
        const populated = await Order.findById(id).populate('items.product').lean()
        try {
          const resMail = await sendOrderReceipt(populated, user.email)
          await Order.updateOne({ _id: id }, { $set: { email_sent: !!(resMail && resMail.ok) } })
          return res.status(200).json({ ok: true, emailSent: !!(resMail && resMail.ok) })
        } catch (err) {
          console.error('Resend receipt error:', err)
          return res.status(500).json({ ok: false, error: 'send-failed' })
        }
      }

      // Guest: accept guestToken or guestEmail in body
      const { guestToken: bodyToken, guestEmail: bodyEmail } = req.body || {}
      if (bodyToken) {
        if (!ord.guest_token || String(ord.guest_token) !== String(bodyToken)) return res.status(403).json({ error: 'Forbidden' })
        if (ord.guest_token_expires && new Date(ord.guest_token_expires).getTime() < Date.now()) return res.status(403).json({ error: 'Token expired' })
        const populated = await Order.findById(id).populate('items.product').lean()
        try {
          const resMail = await sendOrderReceipt(populated, ord.guest_email)
          await Order.updateOne({ _id: id }, { $set: { email_sent: !!(resMail && resMail.ok) } })
          return res.status(200).json({ ok: true, emailSent: !!(resMail && resMail.ok) })
        } catch (err) {
          console.error('Resend receipt error (guest token):', err)
          return res.status(500).json({ ok: false, error: 'send-failed' })
        }
      }

      if (bodyEmail && String(ord.guest_email || '').toLowerCase() === String(bodyEmail).toLowerCase()) {
        const populated = await Order.findById(id).populate('items.product').lean()
        try {
          const resMail = await sendOrderReceipt(populated, bodyEmail)
          await Order.updateOne({ _id: id }, { $set: { email_sent: !!(resMail && resMail.ok) } })
          return res.status(200).json({ ok: true, emailSent: !!(resMail && resMail.ok) })
        } catch (err) {
          console.error('Resend receipt error (guest email):', err)
          return res.status(500).json({ ok: false, error: 'send-failed' })
        }
      }

      return res.status(403).json({ error: 'Forbidden: provide valid guestToken or guestEmail' })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('Order lookup error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
