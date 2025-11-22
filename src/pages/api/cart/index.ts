import type { NextApiRequest, NextApiResponse } from 'next'
import pool from '../../../lib/db'
import { getCurrentUser } from '../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getCurrentUser(req)
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  if (req.method === 'GET') {
    try {
      const result = await pool.query(
        `SELECT 
          ci.*,
          p.title,
          p.price,
          p.image_url,
          p.stock_quantity
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.user_id = $1
        ORDER BY ci.created_at DESC`,
        [user.id]
      )

      res.status(200).json({ items: result.rows })
    } catch (error) {
      console.error('Cart fetch error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'POST') {
    try {
      const { productId, quantity } = req.body

      if (!productId || !quantity) {
        return res.status(400).json({ error: 'Product ID and quantity are required' })
      }

      // Check if item already in cart
      const existing = await pool.query(
        'SELECT id, quantity FROM cart_items WHERE user_id = $1 AND product_id = $2',
        [user.id, productId]
      )

      if (existing.rows.length > 0) {
        // Update quantity
        await pool.query(
          'UPDATE cart_items SET quantity = quantity + $1 WHERE id = $2',
          [quantity, existing.rows[0].id]
        )
      } else {
        // Add new item
        await pool.query(
          'INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3)',
          [user.id, productId, quantity]
        )
      }

      res.status(200).json({ message: 'Item added to cart' })
    } catch (error) {
      console.error('Cart add error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { productId, quantity } = req.body

      if (!productId || quantity === undefined) {
        return res.status(400).json({ error: 'Product ID and quantity are required' })
      }

      if (quantity <= 0) {
        await pool.query(
          'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2',
          [user.id, productId]
        )
      } else {
        await pool.query(
          'UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND product_id = $3',
          [quantity, user.id, productId]
        )
      }

      res.status(200).json({ message: 'Cart updated' })
    } catch (error) {
      console.error('Cart update error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { productId } = req.body

      if (!productId) {
        return res.status(400).json({ error: 'Product ID is required' })
      }

      await pool.query(
        'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2',
        [user.id, productId]
      )

      res.status(200).json({ message: 'Item removed from cart' })
    } catch (error) {
      console.error('Cart remove error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

