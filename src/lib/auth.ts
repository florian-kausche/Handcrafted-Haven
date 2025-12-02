import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import connectMongoose from './mongoose'
import User from '../models/User'

/*
  Authentication helpers for the application.

  Responsibilities:
  - Hash and verify passwords (bcrypt)
  - Generate and verify JWT tokens for stateless auth
  - Read the current user from an incoming request by checking the
    HttpOnly `token` cookie (or `Authorization` header) and resolving the
    corresponding user from MongoDB.
  - Set and clear the `token` cookie on responses.

  Notes:
  - In production, ensure `JWT_SECRET` is set to a secure value.
  - Cookies set here use `HttpOnly` and `SameSite=Lax`. In production the
    cookie is also marked `Secure` so it will only be sent over HTTPS.
*/

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export interface UserPayload {
  id: string
  email: string
  role: string
}

// Password helpers using bcrypt
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// JWT helpers
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

// Read the currently authenticated user from the request.
// Checks the HttpOnly cookie `token` first, then falls back to the
// `Authorization: Bearer <token>` header. If a valid token is found, the
// user is loaded from the DB and a `UserPayload` with `id`, `email`, `role`
// is returned.
export async function getCurrentUser(req: NextApiRequest): Promise<UserPayload | null> {
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '')
  if (!token) return null

  const payload = verifyToken(token)
  if (!payload) return null

  try {
    await connectMongoose()
    // `.lean()` returns a plain object; cast to `any` to avoid strict TS issues
    const user = (await User.findById(payload.id).lean()) as any
    if (!user) return null
    return { id: user._id.toString(), email: user.email, role: user.role }
  } catch (err) {
    console.warn('Failed to verify user from DB', err)
    return null
  }
}

// Cookie helpers: set and clear the HttpOnly token cookie.
export function setAuthCookie(res: NextApiResponse, token: string) {
  res.setHeader(
    'Set-Cookie',
    `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
  )
}

export function clearAuthCookie(res: NextApiResponse) {
  res.setHeader('Set-Cookie', 'token=; HttpOnly; Path=/; Max-Age=0')
}

