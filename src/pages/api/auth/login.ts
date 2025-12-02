import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongoose from '../../../lib/mongoose'
import User from '../../../models/User'
import { verifyPassword, generateToken, setAuthCookie } from '../../../lib/auth'

/*
  POST /api/auth/login

  Request body: { email, password }
  Response: { user, token }

  This handler verifies the provided credentials, issues a JWT token and
  sets it as an HttpOnly cookie using `setAuthCookie`. The user object is
  returned in the response body for client-side convenience. The token is
  also returned in the JSON body (useful for non-browser clients).
*/
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    await connectMongoose()

    // Find user by email and verify password
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ error: 'Invalid email or password' })

    const isValid = await verifyPassword(password, user.passwordHash)
    if (!isValid) return res.status(401).json({ error: 'Invalid email or password' })

    // Generate JWT and set HttpOnly cookie
    const token = generateToken({ id: user._id.toString(), email: user.email, role: user.role })
    setAuthCookie(res, token)

    // Return basic user profile (omit sensitive fields)
    res.status(200).json({ user: { id: user._id.toString(), email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role }, token })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

