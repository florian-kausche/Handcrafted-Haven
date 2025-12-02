import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongoose from '../../../lib/mongoose'
import User from '../../../models/User'
import Artisan from '../../../models/Artisan'
import { hashPassword, generateToken, setAuthCookie } from '../../../lib/auth'

/*
  POST /api/auth/register

  Request body: { email, password, firstName, lastName, role }
  Response: { user, token }

  Creates a new user, optionally creates a related Artisan profile when
  `role === 'artisan'`, issues a JWT token and sets it as an HttpOnly cookie.
*/
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, password, firstName, lastName, role = 'customer' } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    await connectMongoose()

    // Check if user already exists
    const existing = await User.findOne({ email }).lean()
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists' })
    }

    const passwordHash = await hashPassword(password)
    const created = await User.create({ email, passwordHash, firstName, lastName, role })

    if (role === 'artisan') {
      // Create an artisan profile linked to the created user
      await Artisan.create({ userId: created._id, businessName: `${firstName || ''} ${lastName || ''}`.trim() || 'My Business' })
    }

    // Generate token and set cookie
    const token = generateToken({ id: created._id.toString(), email: created.email, role: created.role })
    setAuthCookie(res, token)

    res.status(201).json({ user: { id: created._id.toString(), email: created.email, firstName: created.firstName, lastName: created.lastName, role: created.role }, token })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

