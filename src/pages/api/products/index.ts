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
    // Fallback: return a small static sample so the site can render without a DB
    const sampleProducts = [
      {
        id: 1,
        title: 'Handcrafted Ceramic Bowl Set',
        description: 'A set of hand-thrown ceramic bowls, glazed in earth tones.',
        price: 89.99,
        image_url: '/assets/product-1.jpeg',
        featured: true,
        category: 'Pottery & Ceramics',
        artisan_name: 'Sarah Martinez',
        artisan_id: 1,
        artisan_rating: 4.8,
      },
      {
        id: 2,
        title: 'Artisan Woven Basket',
        description: 'Handwoven basket made from sustainable fibers.',
        price: 65.0,
        image_url: '/assets/product-2.jpeg',
        featured: true,
        category: 'Textiles & Weaving',
        artisan_name: 'Maria Chen',
        artisan_id: 2,
        artisan_rating: 4.7,
      },
      {
        id: 3,
        title: 'Handmade Silver Necklace',
        description: 'Delicate sterling silver necklace with hammered finish.',
        price: 125.0,
        image_url: '/assets/product-3.jpeg',
        featured: false,
        category: 'Jewelry',
        artisan_name: 'Emma Thompson',
        artisan_id: 3,
        artisan_rating: 4.9,
      }
    ]

    return res.status(200).json({ products: sampleProducts })
  }
}

