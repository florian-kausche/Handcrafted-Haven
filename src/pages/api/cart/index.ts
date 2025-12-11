import type { NextApiRequest, NextApiResponse } from 'next'
import { getCurrentUser } from '../../../lib/auth'
import connectMongoose from '../../../lib/mongoose'
import CartItem from '../../../models/CartItem'
import Product from '../../../models/Product'

/*
  Cart API (authenticated users only)

  - GET: returns the authenticated user's cart items. The response normalizes
    items into a convenient shape for the client such as:
      { items: [ { id, quantity, product: { id, title, price, image, stock_quantity } } ] }

  - POST: add (or increment) an item in the user's cart. Expects `{ productId, quantity }`.
  - PUT: update quantity for an item. Expects `{ productId, quantity }`.
  - DELETE: remove an item. Expects `{ productId }`.

  Note: Guest carts are stored in localStorage on the client and are not handled
  by this route. Client-side synchronization occurs on login.
*/
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getCurrentUser(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })

  await connectMongoose()
  // Ensure Product model is registered before populate (fixes serverless timing issues)
  if (!Product) throw new Error('Product model not loaded')

  const userId = user.id

  try {
    if (req.method === 'GET') {
      const items = await CartItem.find({ user: userId }).sort({ createdAt: -1 }).lean()
      // Manually fetch products to avoid populate timing issues in serverless
      const productIds = items.map((it: any) => it.product)
      const products = await Product.find({ _id: { $in: productIds } }).lean()
      const productMap = new Map(products.map((p: any) => [String(p._id), p]))
      
      const normalized = items.map((it: any) => {
        const product = productMap.get(String(it.product)) || {}
        return {
          id: it._id,
          quantity: it.quantity,
          product: {
            id: product._id || it.product,
            title: product.title || 'Product',
            price: product.price || 0,
            image: (product.images && product.images[0]?.url) || product.image_url || '/assets/product-1.jpeg',
            stock_quantity: product.stock_quantity || 0
          }
        }
      })
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
      // Support both cases where client sends the cart item's _id or the product id.
      // Try matching by the cart-item _id first, then fall back to the product field.
      if (quantity <= 0) {
        const byId = await CartItem.deleteOne({ user: userId, _id: productId })
        if (byId.deletedCount === 0) {
          await CartItem.deleteOne({ user: userId, product: productId })
        }
      } else {
        const byId = await CartItem.updateOne({ user: userId, _id: productId }, { $set: { quantity } })
        if (byId.matchedCount === 0) {
          await CartItem.updateOne({ user: userId, product: productId }, { $set: { quantity } }, { upsert: true })
        }
      }
      return res.status(200).json({ message: 'Cart updated' })
    }

    if (req.method === 'DELETE') {
      const { productId } = req.body
      if (!productId) return res.status(400).json({ error: 'Product ID is required' })
      // Allow deleting by cart item id (_id) or by product id
      const byId = await CartItem.deleteOne({ user: userId, _id: productId })
      if (byId.deletedCount === 0) {
        await CartItem.deleteOne({ user: userId, product: productId })
      }
      return res.status(200).json({ message: 'Item removed from cart' })
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Cart API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

