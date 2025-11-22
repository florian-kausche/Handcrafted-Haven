import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import pool from './db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export interface User {
  id: number
  email: string
  firstName: string | null
  lastName: string | null
  role: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(user: User): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as User
    return decoded
  } catch (error) {
    return null
  }
}

export async function getCurrentUser(req: NextApiRequest): Promise<User | null> {
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '')
  if (!token) return null

  const user = verifyToken(token)
  if (!user) return null

  // Verify user still exists in database
  const result = await pool.query('SELECT id, email, first_name, last_name, role FROM users WHERE id = $1', [user.id])
  if (result.rows.length === 0) return null

  return {
    id: result.rows[0].id,
    email: result.rows[0].email,
    firstName: result.rows[0].first_name,
    lastName: result.rows[0].last_name,
    role: result.rows[0].role,
  }
}

export function setAuthCookie(res: NextApiResponse, token: string) {
  res.setHeader(
    'Set-Cookie',
    `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
  )
}

export function clearAuthCookie(res: NextApiResponse) {
  res.setHeader('Set-Cookie', 'token=; HttpOnly; Path=/; Max-Age=0')
}

