import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongoose from '../../lib/mongoose'
import Product from '../../models/Product'

/*
  GET /api/test-products

  Simple test endpoint to verify products API is working on Vercel.
  Returns first 5 products and total count.
*/
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const conn = await connectMongoose()
    if (!conn) {
      return res.status(503).json({ error: 'MongoDB not connected', connection_status: 'failed' })
    }

    // Get first 5 products
    const products = await Product.find({})
      .limit(5)
      .lean()

    // Get total count
    const total = await Product.countDocuments({})

    // Get categories
    const categories = await Product.distinct('category')

    return res.status(200).json({
      status: 'ok',
      test_products_count: products.length,
      total_products: total,
      categories: categories,
      first_product: products[0] || null,
      sample_products: products.map((p: any) => ({
        id: p._id?.toString() || 'N/A',
        title: p.title,
        price: p.price,
        category: p.category,
        image_url: p.image_url || (p.images?.[0]?.url) || 'N/A',
      })),
    })
  } catch (err: any) {
    console.error('Test products error:', err)
    return res.status(500).json({
      error: 'Failed to fetch products',
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    })
  }
}
