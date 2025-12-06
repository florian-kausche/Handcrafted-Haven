import { NextApiRequest, NextApiResponse } from 'next'
import { connectMongoose } from '../../lib/mongoose'

// Simple in-memory storage for subscriptions (in production, use database)
const subscriptions = new Set<string>()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' })
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' })
  }

  try {
    // Try to connect to MongoDB for persistent storage
    try {
      await connectMongoose()
      // In a real app, you'd store this in a subscribers collection
      // For now, we'll just use in-memory storage
      subscriptions.add(email.toLowerCase())
    } catch (err) {
      // If MongoDB is not available, just use in-memory storage
      subscriptions.add(email.toLowerCase())
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Successfully subscribed to our newsletter',
      email: email 
    })
  } catch (error) {
    console.error('Subscription error:', error)
    return res.status(500).json({ error: 'Failed to subscribe. Please try again.' })
  }
}
