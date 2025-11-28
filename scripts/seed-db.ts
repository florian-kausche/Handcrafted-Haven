// Database seeding script
// Run with: npx ts-node scripts/seed-db.ts

import pool from '../src/lib/db'
import { hashPassword } from '../src/lib/auth'

async function seedDatabase() {
  const client = await pool.connect()
  try {
    console.log('Seeding database...')

    // Create sample users
    const customerPassword = await hashPassword('customer123')
    const artisanPassword = await hashPassword('artisan123')

    const customerResult = await client.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      ['customer@example.com', customerPassword, 'John', 'Doe', 'customer']
    )

    const artisanResult = await client.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      ['artisan@example.com', artisanPassword, 'Sarah', 'Martinez', 'artisan']
    )

    // Create artisan profile
    if (artisanResult.rows.length > 0) {
      const artisanId = artisanResult.rows[0].id
      await client.query(
        `INSERT INTO artisans (user_id, business_name, bio, location, rating, total_reviews)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT DO NOTHING`,
        [
          artisanId,
          'Sarah\'s Pottery',
          'Creating functional art with clay for over 16 years. Each piece is hand-thrown and uniquely glazed.',
          'Portland, OR',
          4.9,
          25
        ]
      )

      // Create sample products
      const products = [
        {
          title: 'Handcrafted Ceramic Bowl Set',
          description: 'Hand-thrown ceramic bowl set with reactive glaze. Perfect for everyday use.',
          price: 89.99,
          image_url: 'https://images.unsplash.com/photo-1547477124-74a9b2b5a1b3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          featured: true,
          category: 'Pottery & Ceramics',
          stock_quantity: 10,
          rating: 5.0,
          total_reviews: 12
        },
        {
          title: 'Artisan Woven Basket',
          description: 'Handwoven storage basket using natural fibers. Beautiful and functional.',
          price: 65.00,
          image_url: 'https://images.unsplash.com/photo-1582299292524-e4062a7a40c9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          featured: true,
          category: 'Textiles & Weaving',
          stock_quantity: 8,
          rating: 5.0,
          total_reviews: 8
        },
        {
          title: 'Handmade Silver Necklace',
          description: 'Handcrafted silver necklace with unique stone setting. One-of-a-kind piece.',
          price: 120.00,
          image_url: 'https://images.unsplash.com/photo-1589139268612-4299b9a6b2c2?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          featured: false,
          category: 'Jewelry',
          stock_quantity: 5,
          rating: 4.5,
          total_reviews: 6
        },
        {
          title: 'Wooden Serving Bowls',
          description: 'Turned wooden serving bowls finished with food-safe oil. Sustainable and beautiful.',
          price: 75.00,
          image_url: 'https://images.unsplash.com/photo-1563820986161-5b7b7b7a1e0f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          featured: false,
          category: 'Woodwork',
          stock_quantity: 12,
          rating: 5.0,
          total_reviews: 10
        },
        {
          title: 'Natural Soy Candle Set',
          description: 'Hand-poured soy candles with natural fragrances. Perfect for gifting.',
          price: 45.00,
          image_url: 'https://images.unsplash.com/photo-1605389025253-8408f62f1c84?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          featured: false,
          category: 'Candles',
          stock_quantity: 20,
          rating: 4.5,
          total_reviews: 15
        },
        {
          title: 'Leather Journal Cover',
          description: 'Vegetable-tanned leather journal cover, stitched by hand. Timeless craftsmanship.',
          price: 55.00,
          image_url: 'https://images.unsplash.com/photo-1555029183-b26a5c10a18e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          featured: false,
          category: 'Leather',
          stock_quantity: 7,
          rating: 5.0,
          total_reviews: 9
        }
      ]

      for (const product of products) {
        await client.query(
          `INSERT INTO products (artisan_id, title, description, price, image_url, featured, category, stock_quantity, rating, total_reviews)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           ON CONFLICT DO NOTHING`,
          [
            artisanId,
            product.title,
            product.description,
            product.price,
            product.image_url,
            product.featured,
            product.category,
            product.stock_quantity,
            product.rating,
            product.total_reviews
          ]
        )
      }
    }

    console.log('Database seeded successfully!')
    console.log('\nTest Accounts:')
    console.log('Customer: customer@example.com / customer123')
    console.log('Artisan: artisan@example.com / artisan123')
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

seedDatabase()

