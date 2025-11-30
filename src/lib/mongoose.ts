import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || ''

if (!MONGODB_URI) {
  console.warn('MONGODB_URI not set — mongoose will not connect')
}

type Cached = {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: Cached | undefined
}

const cached = global._mongoose || (global._mongoose = { conn: null, promise: null })

export async function connectMongoose() {
  if (!MONGODB_URI) return null

  if (cached.conn) return cached.conn

  if (!cached.promise) {
    const opts = {
      // Use defaults suitable for Next.js serverless/dev
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      return m
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}

export default connectMongoose
