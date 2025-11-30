import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongoose from '../../../lib/mongoose'
import User from '../../../models/User'
import { verifyPassword, generateToken, setAuthCookie } from '../../../lib/auth'

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

    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ error: 'Invalid email or password' })

    const isValid = await verifyPassword(password, user.passwordHash)
    if (!isValid) return res.status(401).json({ error: 'Invalid email or password' })

    const token = generateToken({ id: user._id.toString(), email: user.email, role: user.role })
    setAuthCookie(res, token)

    res.status(200).json({ user: { id: user._id.toString(), email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role }, token })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

