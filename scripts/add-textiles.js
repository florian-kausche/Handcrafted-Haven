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

const textilesProducts = [
  {
    sku: 'TEXTILE-001',
    slug: 'woven-kente-scarf',
    title: 'Woven Kente Scarf',
    shortDescription: 'Handwoven Kente scarf with vibrant patterns',
    description: 'A vibrant handwoven Kente scarf crafted by skilled artisans. Perfect as a statement accessory or wall hanging.',
    price: 68,
    currency: 'USD',
    category: 'Textiles & Weaving',
    tags: ['textiles', 'weaving', 'scarf', 'handmade', 'kente'],
    featured: true,
    images: [
      { url: '/assets/Textiles&Weaving/delight-dzansi-6CDhpQgGFgY-unsplash.jpg', alt: 'Woven Kente Scarf', type: 'primary' }
    ],
    stock_quantity: 14,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'TEXTILE-002',
    slug: 'indigo-dyed-shawl',
    title: 'Indigo Dyed Shawl',
    shortDescription: 'Hand-dyed indigo shawl with subtle gradients',
    description: 'A soft hand-dyed shawl featuring indigo gradients. Lightweight and elegant for year-round styling.',
    price: 58,
    currency: 'USD',
    category: 'Textiles & Weaving',
    tags: ['textiles', 'indigo', 'shawl', 'handmade', 'dyed'],
    featured: false,
    images: [
      { url: '/assets/Textiles&Weaving/delight-dzansi-_DmkY-1JqKY-unsplash.jpg', alt: 'Indigo Dyed Shawl', type: 'primary' }
    ],
    stock_quantity: 16,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'TEXTILE-003',
    slug: 'loom-woven-blanket',
    title: 'Loom Woven Blanket',
    shortDescription: 'Cozy loom-woven blanket with earthy tones',
    description: 'A cozy loom-woven blanket in earthy tones, perfect for layering on sofas or beds. Made with natural fibers.',
    price: 120,
    currency: 'USD',
    category: 'Textiles & Weaving',
    tags: ['textiles', 'blanket', 'loom', 'handmade', 'cozy'],
    featured: true,
    images: [
      { url: '/assets/Textiles&Weaving/eddie-pipocas-b_bbjRgid2k-unsplash.jpg', alt: 'Loom Woven Blanket', type: 'primary' }
    ],
    stock_quantity: 9,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'TEXTILE-004',
    slug: 'handwoven-wall-hanging',
    title: 'Handwoven Wall Hanging',
    shortDescription: 'Textile wall art with geometric patterns',
    description: 'An artisan-made wall hanging featuring geometric woven patterns. Adds texture and warmth to any room.',
    price: 88,
    currency: 'USD',
    category: 'Textiles & Weaving',
    tags: ['textiles', 'wall hanging', 'weaving', 'handmade', 'decor'],
    featured: false,
    images: [
      { url: '/assets/Textiles&Weaving/faustina-okeke-xZpVJsIcaiM-unsplash.jpg', alt: 'Handwoven Wall Hanging', type: 'primary' }
    ],
    stock_quantity: 11,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'TEXTILE-005',
    slug: 'woven-market-bag',
    title: 'Woven Market Bag',
    shortDescription: 'Durable woven bag for daily essentials',
    description: 'A durable handwoven market bag with sturdy straps. Great for groceries, beach days, and everyday carry.',
    price: 54,
    currency: 'USD',
    category: 'Textiles & Weaving',
    tags: ['textiles', 'bag', 'woven', 'handmade', 'market'],
    featured: false,
    images: [
      { url: '/assets/Textiles&Weaving/james-enokela-CRqMVPIvnVA-unsplash.jpg', alt: 'Woven Market Bag', type: 'primary' }
    ],
    stock_quantity: 18,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'TEXTILE-006',
    slug: 'handloom-throw',
    title: 'Handloom Throw',
    shortDescription: 'Soft handloom throw with fringe detail',
    description: 'A soft handloom throw featuring gentle color blocking and fringe detail. Perfect for couches and reading nooks.',
    price: 72,
    currency: 'USD',
    category: 'Textiles & Weaving',
    tags: ['textiles', 'throw', 'handloom', 'handmade', 'decor'],
    featured: true,
    images: [
      { url: '/assets/Textiles&Weaving/carrie-beth-williams-D4KHC30VxBA-unsplash.jpg', alt: 'Handloom Throw', type: 'primary' }
    ],
    stock_quantity: 12,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'TEXTILE-007',
    slug: 'striped-woven-rug',
    title: 'Striped Woven Rug',
    shortDescription: 'Handwoven striped rug with natural fibers',
    description: 'A handwoven rug featuring bold stripes and natural fibers. Adds warmth and texture to living spaces.',
    price: 140,
    currency: 'USD',
    category: 'Textiles & Weaving',
    tags: ['textiles', 'rug', 'woven', 'handmade', 'home'],
    featured: false,
    images: [
      { url: '/assets/Textiles&Weaving/vije-vijendranath-9o5zeS6QbgM-unsplash.jpg', alt: 'Striped Woven Rug', type: 'primary' }
    ],
    stock_quantity: 7,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'TEXTILE-008',
    slug: 'loomed-table-runner',
    title: 'Loomed Table Runner',
    shortDescription: 'Elegant loomed table runner for dining',
    description: 'An elegant loomed table runner that elevates dining tables. Crafted with care and finished with soft edges.',
    price: 46,
    currency: 'USD',
    category: 'Textiles & Weaving',
    tags: ['textiles', 'table runner', 'loom', 'handmade', 'dining'],
    featured: false,
    images: [
      { url: '/assets/Textiles&Weaving/vije-vijendranath-edLKcfYK-gk-unsplash.jpg', alt: 'Loomed Table Runner', type: 'primary' }
    ],
    stock_quantity: 17,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'TEXTILE-009',
    slug: 'colorblock-woven-tote',
    title: 'Colorblock Woven Tote',
    shortDescription: 'Colorful woven tote with sturdy handles',
    description: 'A colorful woven tote bag with sturdy handles. Ideal for daily errands and style-forward outings.',
    price: 62,
    currency: 'USD',
    category: 'Textiles & Weaving',
    tags: ['textiles', 'tote', 'woven', 'handmade', 'colorful'],
    featured: true,
    images: [
      { url: '/assets/Textiles&Weaving/vije-vijendranath-lcPbyRE-xzY-unsplash.jpg', alt: 'Colorblock Woven Tote', type: 'primary' }
    ],
    stock_quantity: 13,
    rating: 0,
    total_reviews: 0
  },
  {
    sku: 'TEXTILE-010',
    slug: 'woven-storage-basket',
    title: 'Woven Storage Basket',
    shortDescription: 'Handwoven storage basket for home organization',
    description: 'A practical handwoven storage basket perfect for blankets, toys, or magazines. Brings natural texture to interiors.',
    price: 50,
    currency: 'USD',
    category: 'Textiles & Weaving',
    tags: ['textiles', 'basket', 'woven', 'handmade', 'storage'],
    featured: false,
    images: [
      { url: '/assets/Textiles&Weaving/product-6.png', alt: 'Woven Storage Basket', type: 'primary' }
    ],
    stock_quantity: 15,
    rating: 0,
    total_reviews: 0
  }
];

async function addTextilesProducts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    console.log('Adding textiles and weaving products...');

    for (const product of textilesProducts) {
      const existingProduct = await Product.findOne({ slug: product.slug });

      if (existingProduct) {
        console.log(`Product "${product.title}" already exists. Skipping...`);
        continue;
      }

      const newProduct = new Product(product);
      await newProduct.save();
      console.log(`✓ Added: ${product.title}`);
    }

    console.log('\nAll textiles and weaving products added successfully!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error adding textiles products:', error);
    process.exit(1);
  }
}

addTextilesProducts();
