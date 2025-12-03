import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongoose from '../../../../src/lib/mongoose'
import { getCurrentUser } from '../../../../src/lib/auth'
import CartItem from '../../../../src/models/CartItem'
import Order from '../../../../src/models/Order'
import sendOrderReceipt from '../../../../src/lib/mailer'
import Product from '../../../../src/models/Product'

/*
	Orders API

	- GET: returns orders for the authenticated user
	- POST: creates an order. Supports multiple mocked payment methods:
			- credit/card: immediate (mock) capture and mark order as 'paid'
			- paypal: create order and return a redirectUrl to simulate PayPal flow
			- bank/mobile/cod: create order in 'pending' state and return instructions

	Request body for POST includes `shippingAddress`, `billingAddress`,
	`paymentMethod`, `items` (for guest checkout), and optional `guestEmail`.

	Notes:
	- Authenticated users' cart items are read from `CartItem` entries.
	- Guest users must supply `items` in the POST body; the server accepts
		these and stores them on the order as provided.
*/
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	await connectMongoose()
	const user = await getCurrentUser(req)
	const userId = user ? user.id : null

	try {
		if (req.method === 'GET') {
			if (!user) return res.status(401).json({ error: 'Not authenticated' })
			const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).lean()
			return res.status(200).json({ orders })
		}

		if (req.method === 'POST') {
			const { shippingAddress, billingAddress, paymentMethod, card, mobileNumber, items: payloadItems, guestEmail } = req.body

						let cartItems: any[] = []
			if (user) {
				cartItems = await CartItem.find({ user: userId }).populate('product').lean()
			} else {
				// guest checkout: accept items in payload
							cartItems = (payloadItems || []).map((it: any) => ({ product: it.id, quantity: it.quantity, productData: it }))
			}

			if (!cartItems || cartItems.length === 0) return res.status(400).json({ error: 'Cart is empty' })

			const totalAmount = cartItems.reduce((sum: number, it: any) => {
				const price = (it.product && it.product.price) || (it.productData && it.productData.price) || 0
				return sum + price * it.quantity
			}, 0)
			const pm = (paymentMethod || '').toString().toLowerCase()

						// helper to create guest token when needed
						const createGuestTokenIfNeeded = () => {
							if (user) return { guest_token: undefined, guest_token_expires: undefined }
							const crypto = require('crypto')
							const token = crypto.randomBytes(16).toString('hex')
							const expires = new Date(Date.now() + 1000 * 60 * 60 * 24) // 24h
							return { guest_token: token, guest_token_expires: expires }
						}

						if (pm === 'credit' || pm === 'card') {
				// immediate charge (mock) and mark paid
								const guestToken = createGuestTokenIfNeeded()
								const order = await Order.create({ user: userId, guest_email: user ? undefined : guestEmail, guest_token: guestToken.guest_token, guest_token_expires: guestToken.guest_token_expires, items: cartItems.map((it: any) => ({ product: (it.product && it.product._id) || it.product, quantity: it.quantity, price: (it.product && it.product.price) || (it.productData && it.productData.price) })), total_amount: totalAmount, status: 'paid', shipping_address: shippingAddress || '', billing_address: billingAddress || '', payment_method: 'credit' })

				// decrement stock
				for (const it of cartItems) {
					const pid = (it.product && it.product._id) || it.product
					await Product.updateOne({ _id: pid }, { $inc: { stock_quantity: -it.quantity } })
				}

				if (user) await CartItem.deleteMany({ user: userId })
								// attempt to send receipt (best effort) and include result
								let emailSent = false
								try {
									// populate product titles for nicer receipts
									const populated = await Order.findById(order._id).populate('items.product').lean()
									const emailRes = await sendOrderReceipt(populated, user ? user.email : guestEmail)
									emailSent = !!(emailRes && emailRes.ok)
								} catch (e) {
									console.warn('Receipt send error', e)
								}
								try {
									await Order.updateOne({ _id: order._id }, { $set: { email_sent: !!emailSent } })
								} catch (e) {
									console.warn('Failed to persist email_sent on order', e)
								}
								return res.status(200).json({ orderId: order._id, status: 'paid', order, guestToken: order.guest_token, emailSent })
			}

			if (pm === 'paypal') {
				const guestToken = createGuestTokenIfNeeded()
				const order = await Order.create({ user: userId, guest_email: user ? undefined : guestEmail, guest_token: guestToken.guest_token, guest_token_expires: guestToken.guest_token_expires, items: cartItems.map((it: any) => ({ product: (it.product && it.product._id) || it.product, quantity: it.quantity, price: (it.product && it.product.price) || (it.productData && it.productData.price) })), total_amount: totalAmount, status: 'pending', shipping_address: shippingAddress || '', billing_address: billingAddress || '', payment_method: 'paypal' })
				// If the user is authenticated, clear their server-side cart now that an order/invoice is created
				if (user) await CartItem.deleteMany({ user: userId })
								// send receipt (best effort) — guests will get emails to provided guestEmail
								let emailSent = false
								try {
									const populated = await Order.findById(order._id).populate('items.product').lean()
									const emailRes = await sendOrderReceipt(populated, user ? user.email : guestEmail)
									emailSent = !!(emailRes && emailRes.ok)
								} catch (e) { console.warn('Receipt send error', e) }
								try {
									await Order.updateOne({ _id: order._id }, { $set: { email_sent: !!emailSent } })
								} catch (e) { console.warn('Failed to persist email_sent on order', e) }
								const host = req.headers.host || 'localhost:3000'
								const redirectUrl = `https://${host}/api/orders/paypal/simulate?order=${order._id}`
								return res.status(200).json({ orderId: order._id, status: 'pending', redirectUrl, order, guestToken: order.guest_token, emailSent })
			}

			if (pm === 'bank') {
				const guestToken = createGuestTokenIfNeeded()
				const order = await Order.create({ user: userId, guest_email: user ? undefined : guestEmail, guest_token: guestToken.guest_token, guest_token_expires: guestToken.guest_token_expires, items: cartItems.map((it: any) => ({ product: (it.product && it.product._id) || it.product, quantity: it.quantity, price: (it.product && it.product.price) || (it.productData && it.productData.price) })), total_amount: totalAmount, status: 'pending', shipping_address: shippingAddress || '', billing_address: billingAddress || '', payment_method: 'bank' })
								if (user) await CartItem.deleteMany({ user: userId })
								let emailSent = false
								try {
									const populated = await Order.findById(order._id).populate('items.product').lean()
									const emailRes = await sendOrderReceipt(populated, user ? user.email : guestEmail)
									emailSent = !!(emailRes && emailRes.ok)
								} catch (e) { console.warn('Receipt send error', e) }
								try {
									await Order.updateOne({ _id: order._id }, { $set: { email_sent: !!emailSent } })
								} catch (e) { console.warn('Failed to persist email_sent on order', e) }
								const bankDetails = { accountName: 'Handcrafted Haven Ltd', accountNumber: '12345678', sortCode: '00-00-00', reference: `ORDER-${order._id}`, instructions: 'Please include the order reference in your transfer. Order will be processed once funds clear.' }
								return res.status(200).json({ orderId: order._id, status: 'pending', bankDetails, order, guestToken: order.guest_token, emailSent })
			}

			if (pm === 'mobile') {
				const guestToken = createGuestTokenIfNeeded()
				const order = await Order.create({ user: userId, guest_email: user ? undefined : guestEmail, guest_token: guestToken.guest_token, guest_token_expires: guestToken.guest_token_expires, items: cartItems.map((it: any) => ({ product: (it.product && it.product._id) || it.product, quantity: it.quantity, price: (it.product && it.product.price) || (it.productData && it.productData.price) })), total_amount: totalAmount, status: 'pending', shipping_address: shippingAddress || '', billing_address: billingAddress || '', payment_method: 'mobile' })
								if (user) await CartItem.deleteMany({ user: userId })
								let emailSent = false
								try {
									const populated = await Order.findById(order._id).populate('items.product').lean()
									const emailRes = await sendOrderReceipt(populated, user ? user.email : guestEmail)
									emailSent = !!(emailRes && emailRes.ok)
								} catch (e) { console.warn('Receipt send error', e) }
								try {
									await Order.updateOne({ _id: order._id }, { $set: { email_sent: !!emailSent } })
								} catch (e) { console.warn('Failed to persist email_sent on order', e) }
								const mobileInstructions = `Please complete the mobile money payment from ${mobileNumber || '[your number]'} to +1234567890 using reference ORDER-${order._id}. Once payment is received we'll process your order.`
								return res.status(200).json({ orderId: order._id, status: 'pending', mobileInstructions, order, guestToken: order.guest_token, emailSent })
			}

			if (pm === 'cod') {
				const guestToken = createGuestTokenIfNeeded()
				const order = await Order.create({ user: userId, guest_email: user ? undefined : guestEmail, guest_token: guestToken.guest_token, guest_token_expires: guestToken.guest_token_expires, items: cartItems.map((it: any) => ({ product: (it.product && it.product._id) || it.product, quantity: it.quantity, price: (it.product && it.product.price) || (it.productData && it.productData.price) })), total_amount: totalAmount, status: 'pending', shipping_address: shippingAddress || '', billing_address: billingAddress || '', payment_method: 'cod' })
								if (user) await CartItem.deleteMany({ user: userId })
								let emailSent = false
								try {
									const populated = await Order.findById(order._id).populate('items.product').lean()
									const emailRes = await sendOrderReceipt(populated, user ? user.email : guestEmail)
									emailSent = !!(emailRes && emailRes.ok)
								} catch (e) { console.warn('Receipt send error', e) }
								try {
									await Order.updateOne({ _id: order._id }, { $set: { email_sent: !!emailSent } })
								} catch (e) { console.warn('Failed to persist email_sent on order', e) }
								const codInstructions = `Payment on delivery selected. Please have the exact amount ready for the courier. Order reference: ORDER-${order._id}`
								return res.status(200).json({ orderId: order._id, status: 'pending', codInstructions, order, guestToken: order.guest_token, emailSent })
			}

			return res.status(400).json({ error: 'Unsupported payment method' })
		}

		res.status(405).json({ error: 'Method not allowed' })
	} catch (error) {
		console.error('Order API error:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}

