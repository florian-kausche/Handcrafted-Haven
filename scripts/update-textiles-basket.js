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
const ProductSchema = new mongoose.Schema({ slug: String, images: [ImageSchema] });
const Product = mongoose.model('Product', ProductSchema, 'products');

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    const update = await Product.updateOne(
      { slug: 'woven-storage-basket' },
      { $set: { images: [{ url: '/assets/Textiles&Weaving/product-6.png', alt: 'Woven Storage Basket', type: 'primary' }] } }
    );
    console.log('Matched:', update.matchedCount, 'Modified:', update.modifiedCount);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
  }
}

run();
