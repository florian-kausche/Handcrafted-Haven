import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongoose from '../../../../src/lib/mongoose'
import { getCurrentUser } from '../../../../src/lib/auth'
import CartItem from '../../../../src/models/CartItem'
import Order from '../../../../src/models/Order'
import Product from '../../../../src/models/Product'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectMongoose()
  const user = await getCurrentUser(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })

  const userId = user.id

  try {
    if (req.method === 'GET') {
      const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).lean()
      return res.status(200).json({ orders })
    }

    if (req.method === 'POST') {
      const { shippingAddress, billingAddress, paymentMethod, card, mobileNumber } = req.body

      const cartItems = await CartItem.find({ user: userId }).populate('product').lean()
      if (!cartItems || cartItems.length === 0) return res.status(400).json({ error: 'Cart is empty' })

      const totalAmount = cartItems.reduce((sum: number, it: any) => sum + (it.product.price || 0) * it.quantity, 0)
      const pm = (paymentMethod || '').toString().toLowerCase()

      if (pm === 'credit' || pm === 'card') {
        // immediate charge (mock) and mark paid
        const order = await Order.create({ user: userId, items: cartItems.map((it: any) => ({ product: it.product._id, quantity: it.quantity, price: it.product.price })), total_amount: totalAmount, status: 'paid', shipping_address: shippingAddress || '', billing_address: billingAddress || '', payment_method: 'credit' })

        // decrement stock
        for (const it of cartItems) {
          await Product.updateOne({ _id: it.product._id }, { $inc: { stock_quantity: -it.quantity } })
        }

        await CartItem.deleteMany({ user: userId })
        return res.status(200).json({ orderId: order._id, status: 'paid' })
      }

      if (pm === 'paypal') {
        const order = await Order.create({ user: userId, items: cartItems.map((it: any) => ({ product: it.product._id, quantity: it.quantity, price: it.product.price })), total_amount: totalAmount, status: 'pending', shipping_address: shippingAddress || '', billing_address: billingAddress || '', payment_method: 'paypal' })
        const host = req.headers.host || 'localhost:3000'
        const redirectUrl = `https://${host}/api/orders/paypal/simulate?order=${order._id}`
        return res.status(200).json({ orderId: order._id, status: 'pending', redirectUrl })
      }

      if (pm === 'bank') {
        const order = await Order.create({ user: userId, items: cartItems.map((it: any) => ({ product: it.product._id, quantity: it.quantity, price: it.product.price })), total_amount: totalAmount, status: 'pending', shipping_address: shippingAddress || '', billing_address: billingAddress || '', payment_method: 'bank' })
        const bankDetails = { accountName: 'Handcrafted Haven Ltd', accountNumber: '12345678', sortCode: '00-00-00', reference: `ORDER-${order._id}`, instructions: 'Please include the order reference in your transfer. Order will be processed once funds clear.' }
        return res.status(200).json({ orderId: order._id, status: 'pending', bankDetails })
      }

      if (pm === 'mobile') {
        const order = await Order.create({ user: userId, items: cartItems.map((it: any) => ({ product: it.product._id, quantity: it.quantity, price: it.product.price })), total_amount: totalAmount, status: 'pending', shipping_address: shippingAddress || '', billing_address: billingAddress || '', payment_method: 'mobile' })
        const mobileInstructions = `Please complete the mobile money payment from ${mobileNumber || '[your number]'} to +1234567890 using reference ORDER-${order._id}. Once payment is received we'll process your order.`
        return res.status(200).json({ orderId: order._id, status: 'pending', mobileInstructions })
      }

      if (pm === 'cod') {
        const order = await Order.create({ user: userId, items: cartItems.map((it: any) => ({ product: it.product._id, quantity: it.quantity, price: it.product.price })), total_amount: totalAmount, status: 'pending', shipping_address: shippingAddress || '', billing_address: billingAddress || '', payment_method: 'cod' })
        const codInstructions = `Payment on delivery selected. Please have the exact amount ready for the courier. Order reference: ORDER-${order._id}`
        return res.status(200).json({ orderId: order._id, status: 'pending', codInstructions })
      }

      return res.status(400).json({ error: 'Unsupported payment method' })
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Order API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

