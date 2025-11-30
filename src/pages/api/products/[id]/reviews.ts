import type { NextApiRequest, NextApiResponse } from 'next'
import { getCurrentUser } from '../../../../lib/auth'
import connectMongoose from '../../../../lib/mongoose'
import Review from '../../../../models/Review'
import Product from '../../../../models/Product'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const user = await getCurrentUser(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    await connectMongoose()
    const { rating, comment } = req.body
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be between 1 and 5' })

    const existing = await Review.findOne({ user: user.id, product: id })
    if (existing) {
      existing.rating = rating
      existing.comment = comment || existing.comment
      await existing.save()
    } else {
      await Review.create({ user: user.id, product: id, rating, comment: comment || '' })
    }

    // Recompute product rating
    const agg = await Review.aggregate([
      { $match: { product: new (require('mongoose').Types.ObjectId)(id) } },
      { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ])
    const stats = agg[0] || { avgRating: 0, count: 0 }
    await Product.updateOne({ _id: id }, { $set: { rating: stats.avgRating || 0, total_reviews: stats.count || 0 } })

    res.status(200).json({ message: 'Review submitted successfully' })
  } catch (error) {
    console.error('Review submission error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

