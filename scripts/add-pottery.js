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

const potteryProducts = [
  {
    sku: 'POTTERY-001',
    slug: 'ornate-ceramic-vase',
    title: 'Ornate Ceramic Vase',
    shortDescription: 'Hand-glazed ornate ceramic vase perfect for flowers',
    description: 'A stunning hand-glazed ornate ceramic vase with intricate detailing. Perfect for displaying flowers or as a decorative centerpiece.',
    price: 48,
    currency: 'USD',
    category: 'Pottery & Ceramics',
    tags: ['pottery', 'ceramics', 'vase', 'handmade', 'decorative'],
    featured: true,
    images: [
      {
        url: '/assets/Pottery&Ceramics/Ornateceramic.jpg',
        alt: 'Ornate Ceramic Vase',
        type: 'primary'
      }
    ],
    stock_quantity: 12,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'POTTERY-002',
    slug: 'market-clay-pots',
    title: 'Market Clay Pots',
    shortDescription: 'Simple sturdy clay pots for cooking and storage',
    description: 'Traditional clay pots handcrafted for cooking and storage. Sturdy and durable, perfect for authentic culinary experiences.',
    price: 26,
    currency: 'USD',
    category: 'Pottery & Ceramics',
    tags: ['pottery', 'clay', 'pots', 'handmade', 'kitchen'],
    featured: false,
    images: [
      {
        url: '/assets/Pottery&Ceramics/soukpots.jpg',
        alt: 'Market Clay Pots',
        type: 'primary'
      }
    ],
    stock_quantity: 24,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'POTTERY-003',
    slug: 'essaouira-decorative-pot',
    title: 'Essaouira Decorative Pot',
    shortDescription: 'Hand-painted coastal motif decorative pot',
    description: 'A beautiful decorative pot hand-painted with coastal motifs from the artisan community of Essaouira. A true artistic piece.',
    price: 55,
    currency: 'USD',
    category: 'Pottery & Ceramics',
    tags: ['pottery', 'decorative', 'handpainted', 'handmade', 'coastal'],
    featured: true,
    images: [
      {
        url: '/assets/Pottery&Ceramics/essaouirapot.jpg',
        alt: 'Essaouira Decorative Pot',
        type: 'primary'
      }
    ],
    stock_quantity: 6,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'POTTERY-004',
    slug: 'decorated-tajine',
    title: 'Decorated Tajine',
    shortDescription: 'Beautifully decorated tajine for serving and cooking',
    description: 'A traditional Moroccan tajine pot beautifully decorated with authentic patterns. Perfect for serving and slow cooking.',
    price: 39,
    currency: 'USD',
    category: 'Pottery & Ceramics',
    tags: ['pottery', 'tajine', 'handmade', 'moroccan', 'cooking'],
    featured: false,
    images: [
      {
        url: '/assets/Pottery&Ceramics/DecoratedTajines.jpg',
        alt: 'Decorated Tajine',
        type: 'primary'
      }
    ],
    stock_quantity: 10,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'POTTERY-005',
    slug: 'ceramic-bowl-set',
    title: 'Ceramic Bowl Set',
    shortDescription: 'Set of handcrafted ceramic bowls with glazed finish',
    description: 'A beautiful set of handcrafted ceramic bowls with smooth glazed finish. Perfect for serving or display.',
    price: 42,
    currency: 'USD',
    category: 'Pottery & Ceramics',
    tags: ['pottery', 'bowls', 'ceramics', 'handmade', 'dinnerware'],
    featured: false,
    images: [
      {
        url: '/assets/Pottery&Ceramics/ati-nabaut-YOCYRVRcivg-unsplash.jpg',
        alt: 'Ceramic Bowl Set',
        type: 'primary'
      }
    ],
    stock_quantity: 18,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'POTTERY-006',
    slug: 'artisan-ceramic-planter',
    title: 'Artisan Ceramic Planter',
    shortDescription: 'Handcrafted ceramic planter with drainage hole',
    description: 'A charming handcrafted ceramic planter perfect for houseplants. Features proper drainage and beautiful artisan details.',
    price: 34,
    currency: 'USD',
    category: 'Pottery & Ceramics',
    tags: ['pottery', 'planter', 'ceramics', 'handmade', 'plants'],
    featured: true,
    images: [
      {
        url: '/assets/Pottery&Ceramics/jinhan-moon-M-dPeXCdQq8-unsplash.jpg',
        alt: 'Artisan Ceramic Planter',
        type: 'primary'
      }
    ],
    stock_quantity: 14,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'POTTERY-007',
    slug: 'textured-ceramic-vase',
    title: 'Textured Ceramic Vase',
    shortDescription: 'Modern textured ceramic vase with unique patterns',
    description: 'A contemporary handcrafted ceramic vase featuring unique textured patterns. A modern artistic piece for any home.',
    price: 52,
    currency: 'USD',
    category: 'Pottery & Ceramics',
    tags: ['pottery', 'vase', 'ceramics', 'handmade', 'modern'],
    featured: false,
    images: [
      {
        url: '/assets/Pottery&Ceramics/jinhan-moon-nQNBAWvUNp8-unsplash.jpg',
        alt: 'Textured Ceramic Vase',
        type: 'primary'
      }
    ],
    stock_quantity: 9,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'POTTERY-008',
    slug: 'ceramic-dinnerware-set',
    title: 'Ceramic Dinnerware Set',
    shortDescription: 'Complete handcrafted ceramic dinnerware set',
    description: 'A complete handcrafted ceramic dinnerware set perfect for elegant dining. Includes plates, bowls, and cups.',
    price: 78,
    currency: 'USD',
    category: 'Pottery & Ceramics',
    tags: ['pottery', 'dinnerware', 'ceramics', 'handmade', 'tableware'],
    featured: true,
    images: [
      {
        url: '/assets/Pottery&Ceramics/madeline-liu-3wuKMKBdqyU-unsplash.jpg',
        alt: 'Ceramic Dinnerware Set',
        type: 'primary'
      }
    ],
    stock_quantity: 8,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'POTTERY-009',
    slug: 'hand-thrown-ceramic-bowl',
    title: 'Hand-Thrown Ceramic Bowl',
    shortDescription: 'Artist-made hand-thrown ceramic bowl',
    description: 'A unique hand-thrown ceramic bowl crafted by skilled artisans. Each piece is one-of-a-kind with natural variations.',
    price: 65,
    currency: 'USD',
    category: 'Pottery & Ceramics',
    tags: ['pottery', 'bowl', 'ceramics', 'handmade', 'artist-made'],
    featured: false,
    images: [
      {
        url: '/assets/Pottery&Ceramics/nasim-keshmiri-glmSFSehUhw-unsplash.jpg',
        alt: 'Hand-Thrown Ceramic Bowl',
        type: 'primary'
      }
    ],
    stock_quantity: 11,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'POTTERY-010',
    slug: 'ceramic-tea-set',
    title: 'Ceramic Tea Set',
    shortDescription: 'Traditional handcrafted ceramic tea set',
    description: 'A beautiful traditional handcrafted ceramic tea set perfect for tea ceremonies. Includes teapot, cups, and saucers.',
    price: 85,
    currency: 'USD',
    category: 'Pottery & Ceramics',
    tags: ['pottery', 'tea set', 'ceramics', 'handmade', 'traditional'],
    featured: true,
    images: [
      {
        url: '/assets/Pottery&Ceramics/nasim-keshmiri-H7BufzBbMrk-unsplash.jpg',
        alt: 'Ceramic Tea Set',
        type: 'primary'
      }
    ],
    stock_quantity: 7,
    rating: 0,
    total_reviews: 0
  }
];

async function addPotteryProducts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    console.log('Adding pottery and ceramics products...');

    for (const product of potteryProducts) {
      const existingProduct = await Product.findOne({ slug: product.slug });

      if (existingProduct) {
        console.log(`Product "${product.title}" already exists. Skipping...`);
        continue;
      }

      const newProduct = new Product(product);
      await newProduct.save();
      console.log(`✓ Added: ${product.title}`);
    }

    console.log('\nAll pottery and ceramics products added successfully!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error adding pottery products:', error);
    process.exit(1);
  }
}

addPotteryProducts();
