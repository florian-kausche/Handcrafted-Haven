import type { NextApiRequest, NextApiResponse } from 'next'
import pool from '../../../lib/db'
import { getCurrentUser } from '../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getCurrentUser(req)
  if (!user || user.role !== 'artisan') {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // Get artisan ID
  const artisanResult = await pool.query('SELECT id FROM artisans WHERE user_id = $1', [user.id])
  if (artisanResult.rows.length === 0) {
    return res.status(404).json({ error: 'Artisan profile not found' })
  }
  const artisanId = artisanResult.rows[0].id

  if (req.method === 'GET') {
    try {
      const result = await pool.query(
        'SELECT * FROM products WHERE artisan_id = $1 ORDER BY created_at DESC',
        [artisanId]
      )
      res.status(200).json({ products: result.rows })
    } catch (error) {
      console.error('Products fetch error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'POST') {
    try {
      const { title, description, price, image_url, featured, category, stock_quantity } = req.body

      if (!title || !price) {
        return res.status(400).json({ error: 'Title and price are required' })
      }

      const result = await pool.query(
        `INSERT INTO products (artisan_id, title, description, price, image_url, featured, category, stock_quantity)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [artisanId, title, description || null, price, image_url || null, featured || false, category || null, stock_quantity || 0]
      )

      res.status(201).json({ product: result.rows[0] })
    } catch (error) {
      console.error('Product creation error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, title, description, price, image_url, featured, category, stock_quantity } = req.body

      if (!id) {
        return res.status(400).json({ error: 'Product ID is required' })
      }

      // Verify product belongs to this artisan
      const verifyResult = await pool.query(
        'SELECT artisan_id FROM products WHERE id = $1',
        [id]
      )

      if (verifyResult.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' })
      }

      if (verifyResult.rows[0].artisan_id !== artisanId) {
        return res.status(403).json({ error: 'Unauthorized' })
      }

      const result = await pool.query(
        `UPDATE products 
         SET title = COALESCE($1, title),
             description = COALESCE($2, description),
             price = COALESCE($3, price),
             image_url = COALESCE($4, image_url),
             featured = COALESCE($5, featured),
             category = COALESCE($6, category),
             stock_quantity = COALESCE($7, stock_quantity),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $8
         RETURNING *`,
        [title, description, price, image_url, featured, category, stock_quantity, id]
      )

      res.status(200).json({ product: result.rows[0] })
    } catch (error) {
      console.error('Product update error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.body

      if (!id) {
        return res.status(400).json({ error: 'Product ID is required' })
      }

      // Verify product belongs to this artisan
      const verifyResult = await pool.query(
        'SELECT artisan_id FROM products WHERE id = $1',
        [id]
      )

      if (verifyResult.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' })
      }

      if (verifyResult.rows[0].artisan_id !== artisanId) {
        return res.status(403).json({ error: 'Unauthorized' })
      }

      await pool.query('DELETE FROM products WHERE id = $1', [id])

      res.status(200).json({ message: 'Product deleted successfully' })
    } catch (error) {
      console.error('Product delete error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

