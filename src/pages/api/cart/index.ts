import type { NextApiRequest, NextApiResponse } from 'next'
import { getCurrentUser } from '../../../lib/auth'
import connectMongoose from '../../../lib/mongoose'
import CartItem from '../../../models/CartItem'
import Product from '../../../models/Product'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getCurrentUser(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })

  await connectMongoose()

  const userId = user.id

  try {
    if (req.method === 'GET') {
      const items = await CartItem.find({ user: userId }).populate('product').sort({ createdAt: -1 }).lean()
      const normalized = items.map((it: any) => ({ id: it._id, quantity: it.quantity, product: { id: it.product._id, title: it.product.title, price: it.product.price, image: (it.product.images && it.product.images[0]?.url) || it.product.image_url || '/assets/product-1.jpeg', stock_quantity: it.product.stock_quantity } }))
      return res.status(200).json({ items: normalized })
    }

    if (req.method === 'POST') {
      const { productId, quantity } = req.body
      if (!productId || !quantity) return res.status(400).json({ error: 'Product ID and quantity are required' })

      // Upsert cart item
      await CartItem.findOneAndUpdate({ user: userId, product: productId }, { $inc: { quantity: quantity } }, { upsert: true })
      return res.status(200).json({ message: 'Item added to cart' })
    }

    if (req.method === 'PUT') {
      const { productId, quantity } = req.body
      if (!productId || quantity === undefined) return res.status(400).json({ error: 'Product ID and quantity are required' })

      if (quantity <= 0) {
        await CartItem.deleteOne({ user: userId, product: productId })
      } else {
        await CartItem.updateOne({ user: userId, product: productId }, { $set: { quantity } }, { upsert: true })
      }
      return res.status(200).json({ message: 'Cart updated' })
    }

    if (req.method === 'DELETE') {
      const { productId } = req.body
      if (!productId) return res.status(400).json({ error: 'Product ID is required' })
      await CartItem.deleteOne({ user: userId, product: productId })
      return res.status(200).json({ message: 'Item removed from cart' })
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Cart API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

