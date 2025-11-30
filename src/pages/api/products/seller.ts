import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongoose from '../../../lib/mongoose'
import { getCurrentUser } from '../../../lib/auth'
import Artisan from '../../../models/Artisan'
import Product from '../../../models/Product'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getCurrentUser(req)
  if (!user || user.role !== 'artisan') return res.status(401).json({ error: 'Unauthorized' })

  await connectMongoose()

  const artisan = (await Artisan.findOne({ userId: user.id }).lean()) as any
  if (!artisan) return res.status(404).json({ error: 'Artisan profile not found' })
  const artisanId = artisan._id

  try {
    if (req.method === 'GET') {
      const products = (await Product.find({ 'artisan.id': artisanId }).sort({ createdAt: -1 }).lean()) as any
      return res.status(200).json({ products })
    }

    if (req.method === 'POST') {
      const { title, description, price, image_url, featured, category, stock_quantity } = req.body
      if (!title || !price) return res.status(400).json({ error: 'Title and price are required' })

      const created = await Product.create({ title, description, price, images: image_url ? [{ url: image_url }] : [], featured: !!featured, category, stock_quantity: stock_quantity || 0, artisan: { id: artisanId, name: artisan.businessName } })
      return res.status(201).json({ product: created })
    }

    if (req.method === 'PUT') {
      const { id, title, description, price, image_url, featured, category, stock_quantity } = req.body
      if (!id) return res.status(400).json({ error: 'Product ID is required' })

      const existing = (await Product.findById(id).lean()) as any
      if (!existing) return res.status(404).json({ error: 'Product not found' })
      if (existing.artisan?.id?.toString() !== artisanId.toString()) return res.status(403).json({ error: 'Unauthorized' })

      const updated = await Product.findByIdAndUpdate(id, { $set: { title: title ?? existing.title, description: description ?? existing.description, price: price ?? existing.price, images: image_url ? [{ url: image_url }] : existing.images, featured: featured ?? existing.featured, category: category ?? existing.category, stock_quantity: stock_quantity ?? existing.stock_quantity } }, { new: true })
      return res.status(200).json({ product: updated })
    }

    if (req.method === 'DELETE') {
      const { id } = req.body
      if (!id) return res.status(400).json({ error: 'Product ID is required' })

      const existing = (await Product.findById(id).lean()) as any
      if (!existing) return res.status(404).json({ error: 'Product not found' })
      if (existing.artisan?.id?.toString() !== artisanId.toString()) return res.status(403).json({ error: 'Unauthorized' })

      await Product.deleteOne({ _id: id })
      return res.status(200).json({ message: 'Product deleted successfully' })
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Seller products error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

