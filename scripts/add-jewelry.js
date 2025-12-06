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

const jewelryProducts = [
  {
    sku: 'JEWELRY-001',
    slug: 'handcrafted-gold-necklace',
    title: 'Handcrafted Gold Necklace',
    shortDescription: 'Elegant gold necklace with intricate design',
    description: 'A stunning handcrafted gold necklace featuring intricate metalwork. Perfect for special occasions or everyday elegance.',
    price: 89,
    currency: 'USD',
    category: 'Jewelry',
    tags: ['jewelry', 'necklace', 'gold', 'handmade', 'elegant'],
    featured: true,
    images: [
      {
        url: '/assets/Jewelry/Jewelry1.jpg',
        alt: 'Handcrafted Gold Necklace',
        type: 'primary'
      }
    ],
    stock_quantity: 8,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'JEWELRY-002',
    slug: 'beaded-silver-bracelet',
    title: 'Beaded Silver Bracelet',
    shortDescription: 'Beautiful beaded bracelet with silver accents',
    description: 'Handcrafted beaded bracelet featuring quality beads and silver accents. A timeless piece that complements any style.',
    price: 45,
    currency: 'USD',
    category: 'Jewelry',
    tags: ['jewelry', 'bracelet', 'beaded', 'handmade', 'silver'],
    featured: false,
    images: [
      {
        url: '/assets/Jewelry/Jewery2.jpg',
        alt: 'Beaded Silver Bracelet',
        type: 'primary'
      }
    ],
    stock_quantity: 12,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'JEWELRY-003',
    slug: 'gemstone-earrings',
    title: 'Gemstone Earrings',
    shortDescription: 'Stunning gemstone earrings with precious stones',
    description: 'Handcrafted earrings featuring beautiful gemstones. Each pair is unique and carefully selected for quality and beauty.',
    price: 65,
    currency: 'USD',
    category: 'Jewelry',
    tags: ['jewelry', 'earrings', 'gemstone', 'handmade', 'precious'],
    featured: true,
    images: [
      {
        url: '/assets/Jewelry/Jewery3.jpg',
        alt: 'Gemstone Earrings',
        type: 'primary'
      }
    ],
    stock_quantity: 10,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'JEWELRY-004',
    slug: 'vintage-pendant',
    title: 'Vintage Pendant',
    shortDescription: 'Elegant vintage-style pendant with charm',
    description: 'A beautiful vintage-inspired pendant handcrafted with attention to detail. Perfect as a gift or personal treasure.',
    price: 55,
    currency: 'USD',
    category: 'Jewelry',
    tags: ['jewelry', 'pendant', 'vintage', 'handmade', 'charm'],
    featured: false,
    images: [
      {
        url: '/assets/Jewelry/Jewery4.jpg',
        alt: 'Vintage Pendant',
        type: 'primary'
      }
    ],
    stock_quantity: 9,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'JEWELRY-005',
    slug: 'turquoise-ring',
    title: 'Turquoise Ring',
    shortDescription: 'Statement ring with turquoise stone',
    description: 'Handcrafted statement ring featuring a striking turquoise stone. A bold, beautiful piece that makes an impression.',
    price: 52,
    currency: 'USD',
    category: 'Jewelry',
    tags: ['jewelry', 'ring', 'turquoise', 'handmade', 'statement'],
    featured: false,
    images: [
      {
        url: '/assets/Jewelry/Jewery5.jpg',
        alt: 'Turquoise Ring',
        type: 'primary'
      }
    ],
    stock_quantity: 14,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'JEWELRY-006',
    slug: 'pearl-string-necklace',
    title: 'Pearl String Necklace',
    shortDescription: 'Classic pearl necklace with timeless appeal',
    description: 'An exquisite handcrafted pearl necklace featuring quality pearls. A classic piece that transcends trends.',
    price: 98,
    currency: 'USD',
    category: 'Jewelry',
    tags: ['jewelry', 'necklace', 'pearl', 'handmade', 'classic'],
    featured: true,
    images: [
      {
        url: '/assets/Jewelry/Jewery6.jpg',
        alt: 'Pearl String Necklace',
        type: 'primary'
      }
    ],
    stock_quantity: 7,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'JEWELRY-007',
    slug: 'copper-cuff-bracelet',
    title: 'Copper Cuff Bracelet',
    shortDescription: 'Distinctive copper cuff with traditional design',
    description: 'A handcrafted copper cuff bracelet with traditional designs. Perfect for adding character to any outfit.',
    price: 48,
    currency: 'USD',
    category: 'Jewelry',
    tags: ['jewelry', 'bracelet', 'copper', 'handmade', 'traditional'],
    featured: false,
    images: [
      {
        url: '/assets/Jewelry/Jewery7.jpg',
        alt: 'Copper Cuff Bracelet',
        type: 'primary'
      }
    ],
    stock_quantity: 11,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'JEWELRY-008',
    slug: 'jade-charm-bracelet',
    title: 'Jade Charm Bracelet',
    shortDescription: 'Delicate jade charm bracelet with Asian-inspired design',
    description: 'Handcrafted jade charm bracelet featuring beautiful jade stones with Asian-inspired designs. A symbol of good fortune.',
    price: 58,
    currency: 'USD',
    category: 'Jewelry',
    tags: ['jewelry', 'bracelet', 'jade', 'handmade', 'charm'],
    featured: false,
    images: [
      {
        url: '/assets/Jewelry/Jewery8.jpg',
        alt: 'Jade Charm Bracelet',
        type: 'primary'
      }
    ],
    stock_quantity: 13,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'JEWELRY-009',
    slug: 'amethyst-cluster-ring',
    title: 'Amethyst Cluster Ring',
    shortDescription: 'Bold amethyst cluster ring for statement style',
    description: 'A striking handcrafted ring featuring an amethyst cluster. Perfect for those who love bold, unique pieces.',
    price: 72,
    currency: 'USD',
    category: 'Jewelry',
    tags: ['jewelry', 'ring', 'amethyst', 'handmade', 'statement'],
    featured: true,
    images: [
      {
        url: '/assets/Jewelry/Jewery9.jpg',
        alt: 'Amethyst Cluster Ring',
        type: 'primary'
      }
    ],
    stock_quantity: 6,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'JEWELRY-010',
    slug: 'rose-gold-locket',
    title: 'Rose Gold Locket',
    shortDescription: 'Romantic rose gold locket with keepsake function',
    description: 'A beautiful handcrafted rose gold locket perfect for keeping precious memories close. Ideal for sentimental gift-giving.',
    price: 76,
    currency: 'USD',
    category: 'Jewelry',
    tags: ['jewelry', 'locket', 'rose gold', 'handmade', 'romantic'],
    featured: false,
    images: [
      {
        url: '/assets/Jewelry/Jewery10.jpg',
        alt: 'Rose Gold Locket',
        type: 'primary'
      }
    ],
    stock_quantity: 9,
    rating: 0,
    total_reviews: 0
  }
];

async function addJewelryProducts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    console.log('Adding jewelry products...');

    for (const product of jewelryProducts) {
      const existingProduct = await Product.findOne({ slug: product.slug });

      if (existingProduct) {
        console.log(`Product "${product.title}" already exists. Skipping...`);
        continue;
      }

      const newProduct = new Product(product);
      await newProduct.save();
      console.log(`✓ Added: ${product.title}`);
    }

    console.log('\nAll jewelry products added successfully!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error adding jewelry products:', error);
    process.exit(1);
  }
}

addJewelryProducts();
