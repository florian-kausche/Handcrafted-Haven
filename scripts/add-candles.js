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

const candleProducts = [
  {
    sku: 'CANDLE-001',
    slug: 'scented-candle-lavender',
    title: 'Scented Candle - Lavender',
    shortDescription: 'Calming lavender-scented candle handcrafted with natural wax',
    description: 'Our beautiful handcrafted scented candle features a soothing lavender fragrance. Made from premium natural wax with a cotton wick, this candle provides a clean, long-lasting burn.',
    price: 24,
    currency: 'USD',
    category: 'Candles',
    tags: ['candles', 'scented', 'lavender', 'handmade', 'aromatherapy'],
    featured: true,
    images: [
      {
        url: '/assets/Candles/Lavender.jpeg',
        alt: 'Lavender Scented Candle',
        type: 'primary'
      }
    ],
    stock_quantity: 15,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'CANDLE-002',
    slug: 'scented-candle-rose',
    title: 'Scented Candle - Rose',
    shortDescription: 'Delicate rose-scented candle with natural ingredients',
    description: 'Handcrafted rose-scented candle made with pure natural wax. The warm floral scent creates an inviting atmosphere in any room.',
    price: 24,
    currency: 'USD',
    category: 'Candles',
    tags: ['candles', 'scented', 'rose', 'handmade', 'floral'],
    featured: false,
    images: [
      {
        url: '/assets/Candles/Rose.jpg',
        alt: 'Rose Scented Candle',
        type: 'primary'
      }
    ],
    stock_quantity: 18,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'CANDLE-003',
    slug: 'scented-candle-vanilla',
    title: 'Scented Candle - Vanilla',
    shortDescription: 'Warm vanilla-scented candle, perfect for any space',
    description: 'Experience the warmth of our handcrafted vanilla-scented candle. Made with sustainable natural wax, this candle fills your space with a comforting vanilla aroma.',
    price: 22,
    currency: 'USD',
    category: 'Candles',
    tags: ['candles', 'scented', 'vanilla', 'handmade', 'warm'],
    featured: false,
    images: [
      {
        url: '/assets/Candles/Vanilla.webp',
        alt: 'Vanilla Scented Candle',
        type: 'primary'
      }
    ],
    stock_quantity: 20,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'CANDLE-004',
    slug: 'scented-candle-citrus',
    title: 'Scented Candle - Citrus',
    shortDescription: 'Refreshing citrus-scented candle with energizing notes',
    description: 'Brighten your home with our handcrafted citrus-scented candle. Featuring a blend of lemon, orange, and bergamot, this candle energizes and uplifts any space.',
    price: 24,
    currency: 'USD',
    category: 'Candles',
    tags: ['candles', 'scented', 'citrus', 'handmade', 'energizing'],
    featured: true,
    images: [
      {
        url: '/assets/Candles/Citrus.jpg',
        alt: 'Citrus Scented Candle',
        type: 'primary'
      }
    ],
    stock_quantity: 16,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'CANDLE-005',
    slug: 'scented-candle-pine',
    title: 'Scented Candle - Pine Forest',
    shortDescription: 'Fresh pine forest-scented candle with woodsy notes',
    description: 'Bring the outdoors inside with our handcrafted pine forest-scented candle. The crisp woodsy aroma creates a natural, refreshing environment.',
    price: 26,
    currency: 'USD',
    category: 'Candles',
    tags: ['candles', 'scented', 'pine', 'handmade', 'woodsy'],
    featured: false,
    images: [
      {
        url: '/assets/Candles/PineForest.jpg',
        alt: 'Pine Forest Scented Candle',
        type: 'primary'
      }
    ],
    stock_quantity: 12,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'CANDLE-006',
    slug: 'scented-candle-jasmine',
    title: 'Scented Candle - Jasmine',
    shortDescription: 'Exotic jasmine-scented candle with floral elegance',
    description: 'Our handcrafted jasmine-scented candle captures the exotic beauty of jasmine flowers. Perfect for creating a luxurious, relaxing atmosphere.',
    price: 28,
    currency: 'USD',
    category: 'Candles',
    tags: ['candles', 'scented', 'jasmine', 'handmade', 'exotic'],
    featured: true,
    images: [
      {
        url: '/assets/Candles/Jasmine.jpg',
        alt: 'Jasmine Scented Candle',
        type: 'primary'
      }
    ],
    stock_quantity: 10,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'CANDLE-007',
    slug: 'scented-candle-sandalwood',
    title: 'Scented Candle - Sandalwood',
    shortDescription: 'Luxurious sandalwood-scented candle with warm undertones',
    description: 'Experience pure luxury with our handcrafted sandalwood-scented candle. The warm, creamy sandalwood aroma provides an elegant ambiance.',
    price: 30,
    currency: 'USD',
    category: 'Candles',
    tags: ['candles', 'scented', 'sandalwood', 'handmade', 'luxury'],
    featured: false,
    images: [
      {
        url: '/assets/Candles/Sandalwood.jpg',
        alt: 'Sandalwood Scented Candle',
        type: 'primary'
      }
    ],
    stock_quantity: 14,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'CANDLE-008',
    slug: 'scented-candle-chamomile',
    title: 'Scented Candle - Chamomile',
    shortDescription: 'Soothing chamomile-scented candle for relaxation',
    description: 'Handcrafted chamomile-scented candle designed for ultimate relaxation. The gentle herbal aroma promotes calm and tranquility.',
    price: 22,
    currency: 'USD',
    category: 'Candles',
    tags: ['candles', 'scented', 'chamomile', 'handmade', 'relaxing'],
    featured: false,
    images: [
      {
        url: '/assets/Candles/Chamomile.jpg',
        alt: 'Chamomile Scented Candle',
        type: 'primary'
      }
    ],
    stock_quantity: 18,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'CANDLE-009',
    slug: 'scented-candle-honey',
    title: 'Scented Candle - Honey Amber',
    shortDescription: 'Warm honey amber-scented candle with golden richness',
    description: 'Our handcrafted honey amber-scented candle combines the warmth of honey with rich amber notes. Creates a cozy, inviting atmosphere.',
    price: 26,
    currency: 'USD',
    category: 'Candles',
    tags: ['candles', 'scented', 'honey', 'handmade', 'warm'],
    featured: false,
    images: [
      {
        url: '/assets/Candles/HoneyAmber.jpg',
        alt: 'Honey Amber Scented Candle',
        type: 'primary'
      }
    ],
    stock_quantity: 13,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'CANDLE-010',
    slug: 'scented-candle-mint',
    title: 'Scented Candle - Peppermint',
    shortDescription: 'Invigorating peppermint-scented candle for clarity',
    description: 'Handcrafted peppermint-scented candle with an invigorating aroma. Perfect for boosting focus and creating a fresh, clean environment.',
    price: 23,
    currency: 'USD',
    category: 'Candles',
    tags: ['candles', 'scented', 'peppermint', 'handmade', 'invigorating'],
    featured: true,
    images: [
      {
        url: '/assets/Candles/Peppermint.jpg',
        alt: 'Peppermint Scented Candle',
        type: 'primary'
      }
    ],
    stock_quantity: 17,
    rating: 0,
    total_reviews: 0
  }
];

async function addCandleProducts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    console.log('Adding candle products...');

    for (const product of candleProducts) {
      const existingProduct = await Product.findOne({ slug: product.slug });

      if (existingProduct) {
        console.log(`Product "${product.title}" already exists. Skipping...`);
        continue;
      }

      const newProduct = new Product(product);
      await newProduct.save();
      console.log(`✓ Added: ${product.title}`);
    }

    console.log('\nAll candle products added successfully!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error adding candle products:', error);
    process.exit(1);
  }
}

addCandleProducts();
