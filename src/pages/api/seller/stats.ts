import type { NextApiRequest, NextApiResponse } from 'next'
import { getCurrentUser } from '../../../lib/auth'
import connectMongoose from '../../../lib/mongoose'
import Artisan from '../../../models/Artisan'
import Product from '../../../models/Product'
import Order from '../../../models/Order'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getCurrentUser(req)
  if (!user || user.role !== 'artisan') return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    await connectMongoose()
    const artisan = (await Artisan.findOne({ userId: user.id }).lean()) as any
    if (!artisan) return res.status(404).json({ error: 'Artisan profile not found' })

    const productCount = await Product.countDocuments({ 'artisan.id': artisan._id })

    // Sum sales by finding orders containing products belonging to this artisan
    const orders = await Order.aggregate([
      { $unwind: '$items' },
      { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      { $match: { 'product.artisan.id': artisan._id } },
      { $group: { _id: null, total: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
    ])
    const totalSales = orders[0]?.total || 0

    const rating = artisan.rating || 0

    res.status(200).json({ productCount, totalSales, rating })
  } catch (error) {
    console.error('Stats fetch error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

