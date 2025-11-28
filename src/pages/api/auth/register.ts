import type { NextApiRequest, NextApiResponse } from 'next'
import pool from '../../../lib/db'
import { hashPassword, generateToken, setAuthCookie } from '../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, password, firstName, lastName, role = 'customer' } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email])
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' })
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, first_name, last_name, role',
      [email, passwordHash, firstName || null, lastName || null, role]
    )

    const user = result.rows[0]

    // If user is an artisan, create artisan record
    if (role === 'artisan') {
      await pool.query(
        'INSERT INTO artisans (user_id, business_name) VALUES ($1, $2)',
        [user.id, `${firstName || ''} ${lastName || ''}`.trim() || 'My Business']
      )
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
    })

    // Set cookie
    setAuthCookie(res, token)

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
      token,
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

