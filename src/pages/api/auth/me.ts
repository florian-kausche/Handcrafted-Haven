import type { NextApiRequest, NextApiResponse } from 'next'
import { getCurrentUser } from '../../../lib/auth'
import { initDatabase } from '../../../lib/db'

let dbInitialized = false

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Initialize database on first request
  if (!dbInitialized) {
    try {
      await initDatabase()
      dbInitialized = true
    } catch (error) {
      console.error('Database initialization error:', error)
    }
  }

  try {
    const user = await getCurrentUser(req)
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    res.status(200).json({ user })
  } catch (error) {
    console.error('Auth check error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

