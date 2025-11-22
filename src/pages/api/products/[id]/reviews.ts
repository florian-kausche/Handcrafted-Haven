import type { NextApiRequest, NextApiResponse } from 'next'
import pool from '../../../../lib/db'
import { getCurrentUser } from '../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const user = await getCurrentUser(req)

  if (req.method === 'POST') {
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    try {
      const { rating, comment } = req.body

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' })
      }

      // Check if user already reviewed this product
      const existing = await pool.query(
        'SELECT id FROM reviews WHERE user_id = $1 AND product_id = $2',
        [user.id, id]
      )

      if (existing.rows.length > 0) {
        // Update existing review
        await pool.query(
          'UPDATE reviews SET rating = $1, comment = $2 WHERE id = $3',
          [rating, comment || null, existing.rows[0].id]
        )
      } else {
        // Create new review
        await pool.query(
          'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES ($1, $2, $3, $4)',
          [user.id, id, rating, comment || null]
        )
      }

      // Update product rating
      const avgRatingResult = await pool.query(
        `SELECT AVG(rating) as avg_rating, COUNT(*) as count
         FROM reviews
         WHERE product_id = $1`,
        [id]
      )

      await pool.query(
        'UPDATE products SET rating = $1, total_reviews = $2 WHERE id = $3',
        [
          parseFloat(avgRatingResult.rows[0].avg_rating || 0),
          parseInt(avgRatingResult.rows[0].count || 0),
          id
        ]
      )

      res.status(200).json({ message: 'Review submitted successfully' })
    } catch (error) {
      console.error('Review submission error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

