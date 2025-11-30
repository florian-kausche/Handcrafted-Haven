// Mongoose-based seeding script
// Run with: npx ts-node scripts/seed-db.ts

import connectMongoose from '../src/lib/mongoose'
import User from '../src/models/User'
import Artisan from '../src/models/Artisan'
import Product from '../src/models/Product'
import { hashPassword } from '../src/lib/auth'

async function seedDatabase() {
  try {
    await connectMongoose()
    console.log('Seeding MongoDB...')

    const customerEmail = 'customer@example.com'
    const artisanEmail = 'artisan@example.com'

    const customerPassword = await hashPassword('customer123')
    const artisanPassword = await hashPassword('artisan123')

    let customer = await User.findOne({ email: customerEmail })
    if (!customer) customer = await User.create({ email: customerEmail, passwordHash: customerPassword, firstName: 'John', lastName: 'Doe', role: 'customer' })

    let artisanUser = await User.findOne({ email: artisanEmail })
    if (!artisanUser) artisanUser = await User.create({ email: artisanEmail, passwordHash: artisanPassword, firstName: 'Sarah', lastName: 'Martinez', role: 'artisan' })

    let artisan = await Artisan.findOne({ userId: artisanUser._id })
    if (!artisan) artisan = await Artisan.create({ userId: artisanUser._id, businessName: "Sarah's Pottery", bio: 'Creating functional art with clay for over 16 years. Each piece is hand-thrown and uniquely glazed.', location: 'Portland, OR', rating: 4.9, total_reviews: 25 })

    // Sample products
    const products = [
      { title: 'Handcrafted Ceramic Bowl Set', description: 'Hand-thrown ceramic bowl set with reactive glaze. Perfect for everyday use.', price: 89.99, images: [{ url: '/assets/pottery/Ornateceramic.jpg' }], featured: true, category: 'Pottery & Ceramics', stock_quantity: 10, rating: 5.0, total_reviews: 12 },
      { title: 'Traditional Souk Pots', description: 'Set of small decorative pots inspired by North African souk wares.', price: 48.0, images: [{ url: '/assets/pottery/soukpots.jpg' }], featured: false, category: 'Pottery & Ceramics', stock_quantity: 6, rating: 4.8, total_reviews: 4 },
      { title: 'Essaouira Clay Pot', description: 'Robust clay pot crafted in traditional Essaouira style.', price: 62.5, images: [{ url: '/assets/pottery/essaouirapot.jpg' }], featured: false, category: 'Pottery & Ceramics', stock_quantity: 5, rating: 4.9, total_reviews: 7 },
      { title: 'Decorated Tajines', description: 'Hand-decorated tajines perfect for cooking and display.', price: 95.0, images: [{ url: '/assets/pottery/DecoratedTajines.jpg' }], featured: false, category: 'Pottery & Ceramics', stock_quantity: 3, rating: 5.0, total_reviews: 2 },
    ]

    for (const p of products) {
      const exists = await Product.findOne({ title: p.title, 'artisan.id': artisan._id })
      if (!exists) {
        await Product.create({ ...p, artisan: { id: artisan._id, name: artisan.businessName } })
      }
    }

    console.log('Seeding complete')
    console.log('\nTest Accounts:')
    console.log('Customer: customer@example.com / customer123')
    console.log('Artisan: artisan@example.com / artisan123')
    process.exit(0)
  } catch (err) {
    console.error('Seeding failed', err)
    process.exit(1)
  }
}

seedDatabase()

