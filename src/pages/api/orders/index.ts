import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongoose from '../../../../src/lib/mongoose'
import { getCurrentUser } from '../../../../src/lib/auth'
import CartItem from '../../../../src/models/CartItem'
import Order from '../../../../src/models/Order'
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

			if (pm === 'credit' || pm === 'card') {
				// immediate charge (mock) and mark paid
				const order = await Order.create({ user: userId, guest_email: user ? undefined : guestEmail, items: cartItems.map((it: any) => ({ product: (it.product && it.product._id) || it.product, quantity: it.quantity, price: (it.product && it.product.price) || (it.productData && it.productData.price) })), total_amount: totalAmount, status: 'paid', shipping_address: shippingAddress || '', billing_address: billingAddress || '', payment_method: 'credit' })

				// decrement stock
				for (const it of cartItems) {
					const pid = (it.product && it.product._id) || it.product
					await Product.updateOne({ _id: pid }, { $inc: { stock_quantity: -it.quantity } })
				}

				if (user) await CartItem.deleteMany({ user: userId })
				return res.status(200).json({ orderId: order._id, status: 'paid' })
			}

			if (pm === 'paypal') {
				const order = await Order.create({ user: userId, guest_email: user ? undefined : guestEmail, items: cartItems.map((it: any) => ({ product: (it.product && it.product._id) || it.product, quantity: it.quantity, price: (it.product && it.product.price) || (it.productData && it.productData.price) })), total_amount: totalAmount, status: 'pending', shipping_address: shippingAddress || '', billing_address: billingAddress || '', payment_method: 'paypal' })
				const host = req.headers.host || 'localhost:3000'
				const redirectUrl = `https://${host}/api/orders/paypal/simulate?order=${order._id}`
				return res.status(200).json({ orderId: order._id, status: 'pending', redirectUrl })
			}

			if (pm === 'bank') {
				const order = await Order.create({ user: userId, guest_email: user ? undefined : guestEmail, items: cartItems.map((it: any) => ({ product: (it.product && it.product._id) || it.product, quantity: it.quantity, price: (it.product && it.product.price) || (it.productData && it.productData.price) })), total_amount: totalAmount, status: 'pending', shipping_address: shippingAddress || '', billing_address: billingAddress || '', payment_method: 'bank' })
				const bankDetails = { accountName: 'Handcrafted Haven Ltd', accountNumber: '12345678', sortCode: '00-00-00', reference: `ORDER-${order._id}`, instructions: 'Please include the order reference in your transfer. Order will be processed once funds clear.' }
				return res.status(200).json({ orderId: order._id, status: 'pending', bankDetails })
			}

			if (pm === 'mobile') {
				const order = await Order.create({ user: userId, guest_email: user ? undefined : guestEmail, items: cartItems.map((it: any) => ({ product: (it.product && it.product._id) || it.product, quantity: it.quantity, price: (it.product && it.product.price) || (it.productData && it.productData.price) })), total_amount: totalAmount, status: 'pending', shipping_address: shippingAddress || '', billing_address: billingAddress || '', payment_method: 'mobile' })
				const mobileInstructions = `Please complete the mobile money payment from ${mobileNumber || '[your number]'} to +1234567890 using reference ORDER-${order._id}. Once payment is received we'll process your order.`
				return res.status(200).json({ orderId: order._id, status: 'pending', mobileInstructions })
			}

			if (pm === 'cod') {
				const order = await Order.create({ user: userId, guest_email: user ? undefined : guestEmail, items: cartItems.map((it: any) => ({ product: (it.product && it.product._id) || it.product, quantity: it.quantity, price: (it.product && it.product.price) || (it.productData && it.productData.price) })), total_amount: totalAmount, status: 'pending', shipping_address: shippingAddress || '', billing_address: billingAddress || '', payment_method: 'cod' })
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

