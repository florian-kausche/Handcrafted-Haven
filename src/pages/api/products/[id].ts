import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongoose from '../../../lib/mongoose'
import Product from '../../../models/Product'
import Review from '../../../models/Review'
import mongoose from 'mongoose'

/*
  GET /api/products/[id]

  Returns a single product along with its reviews. The handler validates the
  provided `id` and returns 400 for invalid ids, 404 when not found and 200
  with the normalized product when successful.

  The returned `product` is normalized to include an `id` string and an
  `image_url` property to make client rendering simpler.
*/
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

    // normalize the product shape for clients: include `id` and normalize known image typos
    const normalizedProduct = {
      ...product,
      id: product.id || (product._id && (typeof product._id === 'string' ? product._id : product._id.toString())),
      image_url: (product.image_url || (product.images && product.images[0] && product.images[0].url) || '').replace?.('soupkpots.jpg', 'soukpots.jpg') || (product.image_url || (product.images && product.images[0] && product.images[0].url) || ''),
    }

    const reviews = await Review.find({ product: product._id }).populate('user', 'firstName lastName').sort({ createdAt: -1 }).lean()

    res.status(200).json({ product: normalizedProduct, reviews })
  } catch (error) {
    console.error('Product fetch error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

