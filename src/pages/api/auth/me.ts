import type { NextApiRequest, NextApiResponse } from 'next'
import { getCurrentUser } from '../../../lib/auth'

/*
  GET /api/auth/me

  Returns the currently authenticated user based on the HttpOnly `token`
  cookie (or `Authorization` header). Returns 401 when no valid token is
  present.
*/
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
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

