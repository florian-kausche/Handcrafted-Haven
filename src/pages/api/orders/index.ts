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
          o.*,
          json_agg(
            json_build_object(
              'id', oi.id,
              'product_id', oi.product_id,
              'quantity', oi.quantity,
              'price', oi.price,
              'title', p.title,
              'image_url', p.image_url
            )
          ) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE o.user_id = $1
        GROUP BY o.id
        ORDER BY o.created_at DESC`,
        [user.id]
      )

      res.status(200).json({ orders: result.rows })
    } catch (error) {
      console.error('Orders fetch error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'POST') {
    try {
      const { shippingAddress, billingAddress, paymentMethod } = req.body

      // Get cart items
      const cartResult = await pool.query(
        `SELECT ci.product_id, ci.quantity, p.price
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.user_id = $1`,
        [user.id]
      )

      if (cartResult.rows.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' })
      }

      // Calculate total
      const totalAmount = cartResult.rows.reduce(
        (sum, item) => sum + parseFloat(item.price) * item.quantity,
        0
      )

      // Create order
      const orderResult = await pool.query(
        `INSERT INTO orders (user_id, total_amount, shipping_address, billing_address, payment_method, status)
        VALUES ($1, $2, $3, $4, $5, 'pending')
        RETURNING id`,
        [user.id, totalAmount, shippingAddress, billingAddress, paymentMethod || 'card']
      )

      const orderId = orderResult.rows[0].id

      // Create order items
      for (const item of cartResult.rows) {
        await pool.query(
          `INSERT INTO order_items (order_id, product_id, quantity, price)
          VALUES ($1, $2, $3, $4)`,
          [orderId, item.product_id, item.quantity, item.price]
        )

        // Update product stock
        await pool.query(
          'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2',
          [item.quantity, item.product_id]
        )
      }

      // Clear cart
      await pool.query('DELETE FROM cart_items WHERE user_id = $1', [user.id])

      res.status(201).json({ orderId, message: 'Order created successfully' })
    } catch (error) {
      console.error('Order creation error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

