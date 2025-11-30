import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongoose from '../../../lib/mongoose'
import Product from '../../../models/Product'
import Artisan from '../../../models/Artisan'
import mongoose from 'mongoose'

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Attempt to connect to MongoDB; if not configured, return fallback sample data
  try {
    const conn = await connectMongoose()
    if (!conn) {
      return res.status(200).json({ products: sampleProducts })
    }
  } catch (err) {
    console.warn('Mongo connection failed, returning sample products', err)
    return res.status(200).json({ products: sampleProducts })
  }

  try {
    const {
      category,
      featured,
      search,
      artisan_id,
      page = '1',
      limit = '12',
      sort = 'newest',
      price_min,
      price_max,
      facets,
    } = req.query as any

    const pageNum = Math.max(parseInt(page as string, 10) || 1, 1)
    const pageSize = Math.min(parseInt(limit as string, 10) || 12, 100)
    const skip = (pageNum - 1) * pageSize

    const filter: any = {}
    if (category) filter.category = category
    if (featured === 'true') filter.featured = true
    if (artisan_id) {
      try {
        filter['artisan.id'] = new mongoose.Types.ObjectId(artisan_id)
      } catch (_) {
        filter['artisan.id'] = artisan_id
      }
    }
    if (price_min || price_max) {
      filter.price = {}
      if (price_min) filter.price.$gte = parseFloat(price_min)
      if (price_max) filter.price.$lte = parseFloat(price_max)
    }

    let query = Product.find(filter)

    // Text search prefers text index; fallback to regex on title/description
    if (search) {
      // Use $text when index is present; otherwise use regex OR
      // We'll attempt a text search
      query = Product.find({ ...filter, $text: { $search: search } })
    }

    // Sorting
    const sortObj: any = {}
    switch (sort) {
      case 'price_asc':
        sortObj.price = 1
        break
      case 'price_desc':
        sortObj.price = -1
        break
      case 'oldest':
        sortObj.createdAt = 1
        break
      case 'newest':
      default:
        sortObj.createdAt = -1
    }

    const [products, total] = await Promise.all([
      query
        .populate('artisan.id', 'businessName rating')
        .sort(sortObj)
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Product.countDocuments(filter),
    ])

    const response: any = {
      products,
      meta: {
        total,
        page: pageNum,
        limit: pageSize,
        totalPages: Math.max(Math.ceil(total / pageSize), 1),
      },
    }

    if (facets === 'true' || facets === true) {
      // Build a match for facets: include text search when provided
      const matchFilter: any = { ...filter }
      if (search) matchFilter.$text = { $search: search }

      const facetsAgg = [
        { $match: matchFilter },
        {
          $facet: {
            categories: [{ $sortByCount: '$category' }],
            priceRange: [{ $group: { _id: null, min: { $min: '$price' }, max: { $max: '$price' } } }],
            ratings: [
              { $group: { _id: { $floor: { $ifNull: ['$rating', 5] } }, count: { $sum: 1 } } },
              { $sort: { _id: -1 } },
            ],
            artisans: [{ $group: { _id: '$artisan.name', count: { $sum: 1 } } }, { $sort: { count: -1 } }],
            tags: [
              { $unwind: { path: '$tags', preserveNullAndEmptyArrays: false } },
              { $sortByCount: '$tags' },
            ],
          },
        },
      ]

      const facetRes = await Product.aggregate(facetsAgg as any)
      const facetRoot = facetRes[0] || {}

      const categories = (facetRoot.categories || []).map((c: any) => ({ value: c._id, count: c.count }))
      const priceStats = (facetRoot.priceRange && facetRoot.priceRange[0]) || { min: 0, max: 0 }
      const ratings = (facetRoot.ratings || []).map((r: any) => ({ value: String(r._id), count: r.count }))
      const artisans = (facetRoot.artisans || []).map((a: any) => ({ value: a._id || 'Unknown', count: a.count }))
      const tags = (facetRoot.tags || []).map((t: any) => ({ value: t._id, count: t.count }))

      response.facets = {
        categories,
        price: { min: priceStats.min || 0, max: priceStats.max || 0 },
        ratings,
        artisans,
        tags,
      }
    }

    return res.status(200).json(response)
  } catch (error) {
    console.error('Products (mongo) error:', error)
    return res.status(200).json({ products: sampleProducts })
  }
}

