import type { NextApiRequest, NextApiResponse } from 'next'
import pool from '../../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { category, featured, search, artisan_id } = req.query
    let query = `
      SELECT 
        p.*,
        a.business_name as artisan_name,
        a.id as artisan_id,
        a.rating as artisan_rating
      FROM products p
      LEFT JOIN artisans a ON p.artisan_id = a.id
      WHERE 1=1
    `
    const params: any[] = []
    let paramCount = 1

    if (category) {
      query += ` AND p.category = $${paramCount}`
      params.push(category)
      paramCount++
    }

    if (featured === 'true') {
      query += ` AND p.featured = true`
    }

    if (search) {
      query += ` AND (p.title ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`
      params.push(`%${search}%`)
      paramCount++
    }

    if (artisan_id) {
      query += ` AND p.artisan_id = $${paramCount}`
      params.push(artisan_id)
      paramCount++
    }

    query += ` ORDER BY p.created_at DESC`

    const result = await pool.query(query, params)

    res.status(200).json({ products: result.rows })
  } catch (error) {
    console.error('Products fetch error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

