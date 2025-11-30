import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import connectMongoose from './mongoose'
import User from '../models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export interface UserPayload {
  id: string
  email: string
  role: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(user: UserPayload): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token: string): UserPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload
    return decoded
  } catch (error) {
    return null
  }
}

export async function getCurrentUser(req: NextApiRequest): Promise<UserPayload | null> {
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '')
  if (!token) return null

  const payload = verifyToken(token)
  if (!payload) return null

  try {
    await connectMongoose()
    // `.lean()` may have varying inferred types; cast to `any` to satisfy TS here
    const user = (await User.findById(payload.id).lean()) as any
    if (!user) return null
    return { id: user._id.toString(), email: user.email, role: user.role }
  } catch (err) {
    console.warn('Failed to verify user from DB', err)
    return null
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

