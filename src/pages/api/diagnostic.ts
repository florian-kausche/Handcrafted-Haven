import { NextApiRequest, NextApiResponse } from 'next'
import { connectMongoose } from '../../lib/mongoose'
import ProductModel from '../../models/Product'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check environment variables
    const hasMongoUri = !!process.env.MONGODB_URI
    const mongoUri = process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 50) + '...' : 'NOT SET'

    // Try to connect
    const connection = await connectMongoose()
    const isConnected = !!connection

    // Try to count products
    let productCount = 0
    let categories = []
    let error = null

    if (isConnected) {
      try {
        productCount = await ProductModel.countDocuments()
        const catData = await ProductModel.aggregate([
          { $group: { _id: '$category', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ])
        categories = catData
      } catch (err: any) {
        error = err.message
      }
    }

    res.status(200).json({
      status: 'diagnostic',
      mongodb_uri_set: hasMongoUri,
      mongodb_uri_preview: mongoUri,
      connection_status: isConnected ? 'connected' : 'failed',
      product_count: productCount,
      categories,
      error,
      timestamp: new Date().toISOString()
    })
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    })
  }
}
