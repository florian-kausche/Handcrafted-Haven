const mongoose = require('mongoose');
const fs = require('fs');

// Load environment variables
function loadDotEnvFile(path) {
  try {
    const text = fs.readFileSync(path, 'utf8');
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch (e) {
    // ignore missing file
  }
}

loadDotEnvFile('.env.local');
loadDotEnvFile('.env');

const MONGODB_URI = process.env.MONGODB_URI || process.env.NEXT_PUBLIC_MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not set');
  process.exit(1);
}

// Define Product schema inline
const ImageSchema = new mongoose.Schema({
  url: String,
  alt: String,
  type: String,
}, { _id: false });

const VariantSchema = new mongoose.Schema({
  sku: String,
  title: String,
  price: Number,
  stock_quantity: Number,
  attributes: Object,
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  sku: { type: String, index: true, sparse: true },
  slug: { type: String, index: true, unique: true, sparse: true },
  title: { type: String, required: true },
  shortDescription: String,
  description: String,
  price: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  salePrice: Number,
  category: { type: String, index: true },
  tags: [String],
  featured: { type: Boolean, default: false },
  images: [ImageSchema],
  variants: [VariantSchema],
  stock_quantity: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  total_reviews: { type: Number, default: 0 },
  artisan: { id: { type: mongoose.Schema.Types.ObjectId, ref: 'Artisan' }, name: String },
  attributes: Object,
}, { timestamps: true });

ProductSchema.index({ title: 'text', description: 'text', tags: 'text' });
const Product = mongoose.model('Product', ProductSchema);

const leatherProducts = [
  {
    sku: 'LEATHER-001',
    slug: 'premium-leather-bag',
    title: 'Premium Leather Tote Bag',
    shortDescription: 'Spacious and elegant leather tote bag',
    description: 'Handcrafted from premium leather, this spacious tote bag is perfect for daily use. Features quality stitching and comfortable handles.',
    price: 129,
    currency: 'USD',
    category: 'Leather',
    tags: ['leather', 'bag', 'tote', 'handmade', 'premium'],
    featured: true,
    images: [
      {
        url: '/assets/Leather/leatherBag1.jpg',
        alt: 'Premium Leather Tote Bag',
        type: 'primary'
      }
    ],
    stock_quantity: 7,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'LEATHER-002',
    slug: 'crossbody-leather-bag',
    title: 'Crossbody Leather Bag',
    shortDescription: 'Stylish crossbody bag for on-the-go convenience',
    description: 'A versatile handcrafted leather crossbody bag perfect for travel and everyday use. Adjustable strap and secure closure.',
    price: 95,
    currency: 'USD',
    category: 'Leather',
    tags: ['leather', 'bag', 'crossbody', 'handmade', 'travel'],
    featured: false,
    images: [
      {
        url: '/assets/Leather/leatherBag2.jpg',
        alt: 'Crossbody Leather Bag',
        type: 'primary'
      }
    ],
    stock_quantity: 10,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'LEATHER-003',
    slug: 'vintage-leather-satchel',
    title: 'Vintage Leather Satchel',
    shortDescription: 'Classic vintage-style leather satchel bag',
    description: 'A timeless handcrafted leather satchel with vintage charm. Perfect for professionals and students alike.',
    price: 115,
    currency: 'USD',
    category: 'Leather',
    tags: ['leather', 'bag', 'satchel', 'handmade', 'vintage'],
    featured: true,
    images: [
      {
        url: '/assets/Leather/leatherBag3.jpg',
        alt: 'Vintage Leather Satchel',
        type: 'primary'
      }
    ],
    stock_quantity: 8,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'LEATHER-004',
    slug: 'handcrafted-leather-belt',
    title: 'Handcrafted Leather Belt',
    shortDescription: 'Premium leather belt with quality buckle',
    description: 'Durable handcrafted leather belt with a quality buckle. Adjustable sizing and timeless style for any occasion.',
    price: 58,
    currency: 'USD',
    category: 'Leather',
    tags: ['leather', 'belt', 'handmade', 'durable', 'accessory'],
    featured: false,
    images: [
      {
        url: '/assets/Leather/leatherbelts.jpg',
        alt: 'Handcrafted Leather Belt',
        type: 'primary'
      }
    ],
    stock_quantity: 15,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'LEATHER-005',
    slug: 'leather-drum-set',
    title: 'Leather Drum Set',
    shortDescription: 'Traditional handcrafted leather drums',
    description: 'Beautifully handcrafted traditional leather drums with authentic sound. Perfect for music enthusiasts and drummers.',
    price: 185,
    currency: 'USD',
    category: 'Leather',
    tags: ['leather', 'drum', 'musical', 'handmade', 'traditional'],
    featured: true,
    images: [
      {
        url: '/assets/Leather/leatherdrums.jpg',
        alt: 'Leather Drum Set',
        type: 'primary'
      }
    ],
    stock_quantity: 5,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'LEATHER-006',
    slug: 'classic-leather-jacket',
    title: 'Classic Leather Jacket',
    shortDescription: 'Timeless leather jacket with expert craftsmanship',
    description: 'A classic handcrafted leather jacket that never goes out of style. Premium quality leather with careful stitching details.',
    price: 275,
    currency: 'USD',
    category: 'Leather',
    tags: ['leather', 'jacket', 'handmade', 'classic', 'fashion'],
    featured: true,
    images: [
      {
        url: '/assets/Leather/leatherjacket.jpg',
        alt: 'Classic Leather Jacket',
        type: 'primary'
      }
    ],
    stock_quantity: 6,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'LEATHER-007',
    slug: 'modern-leather-jacket',
    title: 'Modern Leather Jacket',
    shortDescription: 'Contemporary leather jacket with sleek design',
    description: 'A modern handcrafted leather jacket featuring contemporary design elements. Stylish and comfortable for any season.',
    price: 265,
    currency: 'USD',
    category: 'Leather',
    tags: ['leather', 'jacket', 'handmade', 'modern', 'fashion'],
    featured: false,
    images: [
      {
        url: '/assets/Leather/leatherjacket2.jpg',
        alt: 'Modern Leather Jacket',
        type: 'primary'
      }
    ],
    stock_quantity: 7,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'LEATHER-008',
    slug: 'handmade-leather-shoes',
    title: 'Handmade Leather Shoes',
    shortDescription: 'Comfortable handcrafted leather shoes',
    description: 'Premium handcrafted leather shoes with superior comfort and durability. Perfect for everyday wear.',
    price: 128,
    currency: 'USD',
    category: 'Leather',
    tags: ['leather', 'shoes', 'handmade', 'comfortable', 'footwear'],
    featured: false,
    images: [
      {
        url: '/assets/Leather/leathershoes.jpg',
        alt: 'Handmade Leather Shoes',
        type: 'primary'
      }
    ],
    stock_quantity: 12,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'LEATHER-009',
    slug: 'designer-leather-shoes',
    title: 'Designer Leather Shoes',
    shortDescription: 'Stylish designer leather shoes with flair',
    description: 'Handcrafted designer leather shoes with elegant details. Made for those who appreciate quality and style.',
    price: 145,
    currency: 'USD',
    category: 'Leather',
    tags: ['leather', 'shoes', 'handmade', 'designer', 'footwear'],
    featured: false,
    images: [
      {
        url: '/assets/Leather/leathershoes2.jpg',
        alt: 'Designer Leather Shoes',
        type: 'primary'
      }
    ],
    stock_quantity: 9,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'LEATHER-010',
    slug: 'classic-leather-shoes',
    title: 'Classic Leather Shoes',
    shortDescription: 'Timeless classic leather shoes',
    description: 'Elegant handcrafted leather shoes with a classic design. A wardrobe essential that complements any outfit.',
    price: 135,
    currency: 'USD',
    category: 'Leather',
    tags: ['leather', 'shoes', 'handmade', 'classic', 'footwear'],
    featured: false,
    images: [
      {
        url: '/assets/Leather/leathershoes3.jpg',
        alt: 'Classic Leather Shoes',
        type: 'primary'
      }
    ],
    stock_quantity: 11,
    rating: 0,
    total_reviews: 0
  }
];

async function addLeatherProducts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    console.log('Adding leather products...');

    for (const product of leatherProducts) {
      const existingProduct = await Product.findOne({ slug: product.slug });

      if (existingProduct) {
        console.log(`Product "${product.title}" already exists. Skipping...`);
        continue;
      }

      const newProduct = new Product(product);
      await newProduct.save();
      console.log(`✓ Added: ${product.title}`);
    }

    console.log('\nAll leather products added successfully!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error adding leather products:', error);
    process.exit(1);
  }
}

addLeatherProducts();
