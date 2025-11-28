import type { NextApiRequest, NextApiResponse } from 'next'
import pool from '../../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const result = await pool.query(
        `SELECT 
          p.*,
          a.business_name as artisan_name,
          a.id as artisan_id,
          a.bio as artisan_bio,
          a.location as artisan_location,
          a.rating as artisan_rating
        FROM products p
        LEFT JOIN artisans a ON p.artisan_id = a.id
        WHERE p.id = $1`,
        [id]
      )

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' })
      }

      // Get reviews
      const reviewsResult = await pool.query(
        `SELECT r.*, u.first_name, u.last_name
        FROM reviews r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.product_id = $1
        ORDER BY r.created_at DESC`,
        [id]
      )

      res.status(200).json({
        product: result.rows[0],
        reviews: reviewsResult.rows,
      })
    } catch (error) {
      console.error('Product fetch error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

