const mongoose = require('mongoose');
const fs = require('fs');

// Load env vars (safe fallback if dotenv isn't installed)
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

const { Schema } = mongoose;

const ProductSchema = new Schema({ slug: String, rating: Number, total_reviews: Number }, { strict: false });
const ReviewSchema = new Schema({ product: { type: Schema.Types.ObjectId, ref: 'Product' }, rating: Number, comment: String }, { timestamps: true });
const Product = mongoose.model('Product', ProductSchema, 'products');
const Review = mongoose.model('Review', ReviewSchema, 'reviews');

// Reviews to seed (by product slug)
const reviewsByProduct = [
  {
    slug: 'minimalist-wood-desk',
    reviews: [
      { rating: 5, comment: 'Sturdy build and beautiful grain. Looks perfect in my studio.' },
      { rating: 4, comment: 'Clean lines, minor scuff on arrival but still great.' },
    ],
  },
  {
    slug: 'rustic-wooden-bench',
    reviews: [
      { rating: 5, comment: 'Solid bench, love the live edge character.' },
    ],
  },
  {
    slug: 'colorblock-woven-tote',
    reviews: [
      { rating: 5, comment: 'Vibrant colors and strong straps. Great market bag.' },
      { rating: 4, comment: 'Bigger than expected, in a good way.' },
    ],
  },
  {
    slug: 'ornate-ceramic-vase',
    reviews: [
      { rating: 5, comment: 'Glaze is gorgeous. Using it as a centerpiece.' },
    ],
  },
  {
    slug: 'scented-candle-mint',
    reviews: [
      { rating: 4, comment: 'Fresh scent, burns evenly.' },
      { rating: 5, comment: 'Peppermint fills the whole room—love it.' },
    ],
  },
];

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const entry of reviewsByProduct) {
      const product = await Product.findOne({ slug: entry.slug });
      if (!product) {
        console.warn(`Product with slug ${entry.slug} not found; skipping.`);
        continue;
      }

      const newDocs = entry.reviews.map(r => ({ ...r, product: product._id }));
      await Review.insertMany(newDocs);

      const all = await Review.find({ product: product._id }, { rating: 1 });
      const totalReviews = all.length;
      const avgRating = totalReviews ? all.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews : 0;
      await Product.updateOne(
        { _id: product._id },
        { $set: { rating: avgRating, total_reviews: totalReviews } }
      );

      console.log(`Added ${newDocs.length} reviews for ${entry.slug}; total now ${totalReviews} (avg ${avgRating.toFixed(2)})`);
    }

    console.log('Done seeding reviews.');
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
  }
}

run();
