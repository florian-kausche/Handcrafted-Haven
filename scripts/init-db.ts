// Mongoose initialization script
// Run with: npx ts-node scripts/init-db.ts

import connectMongoose from '../src/lib/mongoose'

async function main() {
  try {
    console.log('Connecting to MongoDB...')
    await connectMongoose()
    console.log('Connected. Ensure indexes are built by the models.')
    process.exit(0)
  } catch (error) {
    console.error('Failed to initialize MongoDB connection:', error)
    process.exit(1)
  }
}

main()

