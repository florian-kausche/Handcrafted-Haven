import type { NextApiRequest, NextApiResponse } from 'next'
import pool from '../../../lib/db'
import { getCurrentUser } from '../../../lib/auth'
import { initDatabase } from '../../../lib/db'

let dbInitialized = false

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Initialize database on first request
  if (!dbInitialized) {
    try {
      await initDatabase()
      dbInitialized = true
    } catch (error) {
      console.error('Database initialization error:', error)
    }
  }

  const user = await getCurrentUser(req)
  if (!user || user.role !== 'artisan') {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get artisan ID
    const artisanResult = await pool.query('SELECT id FROM artisans WHERE user_id = $1', [user.id])
    if (artisanResult.rows.length === 0) {
      return res.status(404).json({ error: 'Artisan profile not found' })
    }
    const artisanId = artisanResult.rows[0].id

    // Get product count
    const productCountResult = await pool.query(
      'SELECT COUNT(*) as count FROM products WHERE artisan_id = $1',
      [artisanId]
    )

    // Get total sales
    const salesResult = await pool.query(
      `SELECT COALESCE(SUM(oi.price * oi.quantity), 0) as total
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE p.artisan_id = $1`,
      [artisanId]
    )

    // Get artisan rating
    const ratingResult = await pool.query(
      'SELECT rating FROM artisans WHERE id = $1',
      [artisanId]
    )

    res.status(200).json({
      productCount: parseInt(productCountResult.rows[0].count),
      totalSales: parseFloat(salesResult.rows[0].total || 0),
      rating: parseFloat(ratingResult.rows[0].rating || 0),
    })
  } catch (error) {
    console.error('Stats fetch error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

