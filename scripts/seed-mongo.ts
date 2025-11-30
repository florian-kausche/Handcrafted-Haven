/**
 * Seed MongoDB with sample artisans and products.
 * Run with: npx ts-node scripts/seed-mongo.ts
 */
import connectMongoose from '../src/lib/mongoose'
import Artisan from '../src/models/Artisan'
import Product from '../src/models/Product'
import User from '../src/models/User'

async function main() {
  await connectMongoose()
  console.log('Connected to MongoDB')

  // Create or reuse an artisan user
  let user = await User.findOne({ email: 'artisan@example.com' })
  if (!user) {
    user = await User.create({ email: 'artisan@example.com', passwordHash: 'seed-placeholder', firstName: 'Sarah', lastName: 'Martinez', role: 'artisan' })
  }

  let artisan = await Artisan.findOne({ userId: user._id })
  if (!artisan) {
    artisan = await Artisan.create({ userId: user._id, businessName: "Sarah's Pottery", bio: 'Creating functional art with clay for over 16 years.', location: 'Portland, OR', rating: 4.9 })
  }

  const products = [
    { title: 'Ornate Ceramic Vase', description: 'Decorative hand-painted ceramic vase with intricate patterns.', price: 74.0, images: [{ url: '/assets/pottery/Ornateceramic.jpg' }], featured: false, category: 'Pottery & Ceramics', stock_quantity: 12, rating: 4.9 },
    { title: 'Traditional Souk Pots', description: 'Set of small decorative pots inspired by North African souk wares.', price: 48.0, images: [{ url: '/assets/pottery/soukpots.jpg' }], featured: false, category: 'Pottery & Ceramics', stock_quantity: 8, rating: 4.8 },
    { title: 'Essaouira Clay Pot', description: 'Robust clay pot crafted in traditional Essaouira style.', price: 62.5, images: [{ url: '/assets/pottery/essaouirapot.jpg' }], featured: false, category: 'Pottery & Ceramics', stock_quantity: 6, rating: 4.9 },
    { title: 'Decorated Tajines', description: 'Hand-decorated tajines perfect for cooking and display.', price: 95.0, images: [{ url: '/assets/pottery/DecoratedTajines.jpg' }], featured: false, category: 'Pottery & Ceramics', stock_quantity: 4, rating: 5.0 },
    { title: 'Beaded Maasai Necklace', description: 'Colorful handcrafted beaded necklace inspired by Maasai designs.', price: 55.0, images: [{ url: '/assets/product-11.jpeg' }], featured: false, category: 'Jewelry', stock_quantity: 10, rating: 4.7 },
    { title: 'Kente Cloth Wrap', description: 'Handwoven Kente cloth from Ghana, bright geometric patterns.', price: 150.0, images: [{ url: '/assets/product-12.jpeg' }], featured: false, category: 'Textiles & Weaving', stock_quantity: 5, rating: 4.9 },
    { title: 'Carved Wooden Stool', description: 'Solid carved wooden stool with traditional motifs.', price: 120.0, images: [{ url: '/assets/product-13.jpeg' }], featured: false, category: 'Woodwork', stock_quantity: 3, rating: 4.8 },
    { title: 'Soapstone Elephant', description: 'Small soapstone carving of an elephant, polished finish.', price: 40.0, images: [{ url: '/assets/product-15.jpeg' }], featured: false, category: 'Woodwork', stock_quantity: 15, rating: 4.5 },
    { title: 'Handwoven Raffia Mat', description: 'Durable handwoven raffia mat for home display or use.', price: 38.0, images: [{ url: '/assets/product-16.jpeg' }], featured: false, category: 'Textiles & Weaving', stock_quantity: 20, rating: 4.4 },
    { title: 'Beaded Leather Sandals', description: 'Comfortable leather sandals decorated with beadwork.', price: 65.0, images: [{ url: '/assets/product-17.jpeg' }], featured: false, category: 'Leather', stock_quantity: 7, rating: 4.6 },
  ]

  for (const p of products) {
    const existing = await Product.findOne({ title: p.title })
    if (existing) {
      console.log('Skipping existing product:', p.title)
      continue
    }

    await Product.create({
      title: p.title,
      description: p.description,
      price: p.price,
      images: p.images,
      featured: p.featured || false,
      category: p.category,
      stock_quantity: p.stock_quantity || 0,
      rating: p.rating || 0,
      artisan: { id: artisan._id, name: artisan.businessName },
    })
    console.log('Inserted:', p.title)
  }

  console.log('Seeding complete')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
