const mongoose = require('mongoose');
const fs = require('fs');

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
  } catch (_) {}
}

loadDotEnvFile('.env.local');
loadDotEnvFile('.env');

const MONGODB_URI = process.env.MONGODB_URI || process.env.NEXT_PUBLIC_MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not set');
  process.exit(1);
}

const ImageSchema = new mongoose.Schema({ url: String, alt: String, type: String }, { _id: false });
const VariantSchema = new mongoose.Schema({ sku: String, title: String, price: Number, stock_quantity: Number, attributes: Object }, { _id: false });

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

const woodworkProducts = [
  {
    sku: 'WOOD-001',
    slug: 'rustic-wooden-bench',
    title: 'Rustic Wooden Bench',
    shortDescription: 'Handcrafted rustic bench with natural grain',
    description: 'A sturdy handcrafted wooden bench showcasing natural grain and live-edge character. Perfect for entryways or dining.',
    price: 165,
    currency: 'USD',
    category: 'Woodwork',
    tags: ['woodwork', 'bench', 'handmade', 'rustic', 'furniture'],
    featured: true,
    images: [{ url: '/assets/Woodwork/amr-taha-Sf8PqUbWqJo-unsplash.jpg', alt: 'Rustic Wooden Bench', type: 'primary' }],
    stock_quantity: 6,
    rating: 0,
    total_reviews: 0,
  },
  {
    sku: 'WOOD-002',
    slug: 'geometric-wood-sculpture',
    title: 'Geometric Wood Sculpture',
    shortDescription: 'Modern geometric sculpture carved from hardwood',
    description: 'A modern geometric wood sculpture carved from hardwood, adding artistic flair to shelves or desks.',
    price: 95,
    currency: 'USD',
    category: 'Woodwork',
    tags: ['woodwork', 'sculpture', 'decor', 'handmade', 'modern'],
    featured: false,
    images: [{ url: '/assets/Woodwork/anthony-lim-EZGPy_HOZWQ-unsplash.jpg', alt: 'Geometric Wood Sculpture', type: 'primary' }],
    stock_quantity: 12,
    rating: 0,
    total_reviews: 0,
  },
  {
    sku: 'WOOD-003',
    slug: 'carved-wooden-mask',
    title: 'Carved Wooden Mask',
    shortDescription: 'Hand-carved mask with intricate details',
    description: 'An artisan-carved wooden mask featuring intricate details and a rich natural finish. Great for wall display.',
    price: 120,
    currency: 'USD',
    category: 'Woodwork',
    tags: ['woodwork', 'mask', 'carved', 'handmade', 'decor'],
    featured: true,
    images: [{ url: '/assets/Woodwork/eduardo-rodriguez-uRCrdEiiVPU-unsplash.jpg', alt: 'Carved Wooden Mask', type: 'primary' }],
    stock_quantity: 8,
    rating: 0,
    total_reviews: 0,
  },
  {
    sku: 'WOOD-004',
    slug: 'minimalist-wood-desk',
    title: 'Minimalist Wood Desk',
    shortDescription: 'Clean-line handcrafted wood desk',
    description: 'A minimalist handcrafted wood desk with clean lines and a smooth finish. Ideal for home offices and studios.',
    price: 240,
    currency: 'USD',
    category: 'Woodwork',
    tags: ['woodwork', 'desk', 'handmade', 'minimalist', 'furniture'],
    featured: true,
    images: [{ url: '/assets/Woodwork/rosemary-media-byqk70WJWrY-unsplash.jpg', alt: 'Minimalist Wood Desk', type: 'primary' }],
    stock_quantity: 5,
    rating: 0,
    total_reviews: 0,
  },
  {
    sku: 'WOOD-005',
    slug: 'handturned-wood-bowl',
    title: 'Handturned Wood Bowl',
    shortDescription: 'Smooth handturned bowl from solid wood',
    description: 'A smooth handturned wood bowl crafted from a single piece of timber. Perfect for serving or display.',
    price: 78,
    currency: 'USD',
    category: 'Woodwork',
    tags: ['woodwork', 'bowl', 'handturned', 'handmade', 'kitchen'],
    featured: false,
    images: [{ url: '/assets/Woodwork/sies-kranen-4aZ60YsmQ10-unsplash.jpg', alt: 'Handturned Wood Bowl', type: 'primary' }],
    stock_quantity: 14,
    rating: 0,
    total_reviews: 0,
  },
  {
    sku: 'WOOD-006',
    slug: 'wooden-serving-tray',
    title: 'Wooden Serving Tray',
    shortDescription: 'Versatile serving tray with raised edges',
    description: 'A versatile handcrafted wooden serving tray with raised edges and rich grain. Great for breakfast in bed or coffee service.',
    price: 68,
    currency: 'USD',
    category: 'Woodwork',
    tags: ['woodwork', 'tray', 'handmade', 'serving', 'kitchen'],
    featured: false,
    images: [{ url: '/assets/Woodwork/sunny-wang-brIOGFWOjok-unsplash.jpg', alt: 'Wooden Serving Tray', type: 'primary' }],
    stock_quantity: 16,
    rating: 0,
    total_reviews: 0,
  },
  {
    sku: 'WOOD-007',
    slug: 'walnut-cutting-board',
    title: 'Walnut Cutting Board',
    shortDescription: 'End-grain walnut cutting board',
    description: 'An end-grain walnut cutting board built for durability and knife-friendly performance. Finished with food-safe oil.',
    price: 72,
    currency: 'USD',
    category: 'Woodwork',
    tags: ['woodwork', 'cutting board', 'walnut', 'handmade', 'kitchen'],
    featured: false,
    images: [{ url: '/assets/Woodwork/valkyrie-pierce-jh0Su-dEmUI-unsplash.jpg', alt: 'Walnut Cutting Board', type: 'primary' }],
    stock_quantity: 18,
    rating: 0,
    total_reviews: 0,
  },
  {
    sku: 'WOOD-008',
    slug: 'wooden-plant-stand',
    title: 'Wooden Plant Stand',
    shortDescription: 'Mid-height stand for potted plants',
    description: 'A mid-height wooden plant stand designed to elevate indoor plants and add warmth to living spaces.',
    price: 84,
    currency: 'USD',
    category: 'Woodwork',
    tags: ['woodwork', 'plant stand', 'handmade', 'decor', 'home'],
    featured: true,
    images: [{ url: '/assets/Woodwork/wen-zhu-AtLrTAuFXqs-unsplash.jpg', alt: 'Wooden Plant Stand', type: 'primary' }],
    stock_quantity: 10,
    rating: 0,
    total_reviews: 0,
  },
  {
    sku: 'WOOD-009',
    slug: 'wooden-pendant-light',
    title: 'Wooden Pendant Light',
    shortDescription: 'Sculpted wooden pendant light shade',
    description: 'A sculpted wooden pendant light that casts warm tones and patterned shadows. Adds ambiance to dining or living areas.',
    price: 150,
    currency: 'USD',
    category: 'Woodwork',
    tags: ['woodwork', 'lighting', 'pendant', 'handmade', 'decor'],
    featured: false,
    images: [{ url: '/assets/Woodwork/yoel-winkler-4qz8JE35Go0-unsplash.jpg', alt: 'Wooden Pendant Light', type: 'primary' }],
    stock_quantity: 7,
    rating: 0,
    total_reviews: 0,
  },
  {
    sku: 'WOOD-010',
    slug: 'classic-wood-chair',
    title: 'Classic Wood Chair',
    shortDescription: 'Timeless handcrafted wooden chair',
    description: 'A timeless handcrafted wood chair with supportive backrest and smooth finish. Great as a dining or accent chair.',
    price: 130,
    currency: 'USD',
    category: 'Woodwork',
    tags: ['woodwork', 'chair', 'handmade', 'furniture', 'classic'],
    featured: false,
    images: [{ url: '/assets/Woodwork/product-5.png', alt: 'Classic Wood Chair', type: 'primary' }],
    stock_quantity: 9,
    rating: 0,
    total_reviews: 0,
  },
];

async function addWoodworkProducts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    console.log('Adding woodwork products...');

    for (const product of woodworkProducts) {
      const existingProduct = await Product.findOne({ slug: product.slug });
      if (existingProduct) {
        console.log(`Product "${product.title}" already exists. Skipping...`);
        continue;
      }
      const newProduct = new Product(product);
      await newProduct.save();
      console.log(`✓ Added: ${product.title}`);
    }

    console.log('\nAll woodwork products added successfully!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error adding woodwork products:', error);
    process.exit(1);
  }
}

addWoodworkProducts();
