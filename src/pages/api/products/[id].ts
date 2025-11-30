import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongoose from '../../../lib/mongoose'
import Product from '../../../models/Product'
import Review from '../../../models/Review'
import mongoose from 'mongoose'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    await connectMongoose()
    const idStr = Array.isArray(id) ? id[0] : id

    // Validate id to avoid CastError when an invalid id (eg. "NaN") is passed
    if (!idStr || (typeof idStr === 'string' && !mongoose.Types.ObjectId.isValid(idStr))) {
      return res.status(400).json({ error: 'Invalid product id' })
    }

    const product = (await Product.findById(idStr).populate('artisan.id').lean()) as any
    if (!product) return res.status(404).json({ error: 'Product not found' })

    const reviews = await Review.find({ product: product._id }).populate('user', 'firstName lastName').sort({ createdAt: -1 }).lean()

    res.status(200).json({ product, reviews })
  } catch (error) {
    console.error('Product fetch error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

