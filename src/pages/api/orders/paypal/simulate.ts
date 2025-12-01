import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongoose from '../../../../lib/mongoose'
import Order from '../../../../models/Order'
import Product from '../../../../models/Product'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectMongoose()

  try {
    const { order: orderId } = req.query as any
    if (!orderId) return res.status(400).send('Missing order id')

    const order = (await Order.findById(orderId).lean()) as any
    if (!order) return res.status(404).send('Order not found')

    // Mark order as paid and decrement stock
    await Order.updateOne({ _id: orderId }, { $set: { status: 'paid' } })

    if (order.items && Array.isArray(order.items)) {
      for (const it of order.items) {
        try {
          await Product.updateOne({ _id: it.product }, { $inc: { stock_quantity: -it.quantity } })
        } catch (e) {
          console.warn('Failed to decrement stock for', it.product, e)
        }
      }
    }

    // Redirect back to order success page with optional order id
    const host = req.headers.host || 'localhost:3000'
    const redirect = `https://${host}/order/success?order=${order._id}`
    res.setHeader('Content-Type', 'text/html')
    res.status(200).send(`<html><body><p>Payment simulated. <a href="${redirect}">View Order Success</a></p></body></html>`)
  } catch (error) {
    console.error('PayPal simulate error:', error)
    res.status(500).send('Internal server error')
  }
}
