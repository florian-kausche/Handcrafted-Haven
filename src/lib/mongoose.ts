import mongoose from 'mongoose'

/*
  Mongoose connection helper used across server-side code.

  This file implements a simple singleton/promise cache pattern recommended for
  serverless environments (like Next.js API routes and getServerSideProps).

  Usage:
    import connectMongoose from '../lib/mongoose'
    await connectMongoose()

  Behavior:
  - Reads `process.env.MONGODB_URI`. If not set, the function returns `null`
    and callers should handle the absence of a DB connection by falling back
    to sample data or returning an error.
  - Caches an in-flight connection promise and the resolved connection on the
    global scope so subsequent imports reuse the same connection instead of
    creating new ones.
*/

const MONGODB_URI = process.env.MONGODB_URI || ''

if (!MONGODB_URI) {
  // Warn at startup so developers know to set the env var locally
  console.warn('MONGODB_URI not set — mongoose will not connect')
}

type Cached = {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  // Attach the cached connection to the global object to survive module reloads
  // in development and avoid multiple connections when serverless functions
  // are invoked repeatedly.
  // eslint-disable-next-line no-var
  var _mongoose: Cached | undefined
}

const cached = global._mongoose || (global._mongoose = { conn: null, promise: null })

export async function connectMongoose() {
  // If no URI is configured, don't attempt to connect — callers can fallback.
  if (!MONGODB_URI) return null

  // Return existing connection if already established
  if (cached.conn) return cached.conn

  // If a connection is in progress, reuse its promise
  if (!cached.promise) {
    const opts = {
      // These options are safe defaults for modern mongoose versions
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions

    // Store the connecting promise so concurrent imports reuse it
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      return m
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}

export default connectMongoose
