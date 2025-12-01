const mongoose = require('mongoose');
// Try to load .env if dotenv is available, but don't fail if it's not installed
try { require('dotenv').config(); } catch (e) { /* dotenv not installed; skip */ }

// If dotenv wasn't available, try a tiny .env loader so scripts can still run.
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
  } catch (e) {
    // ignore missing file
  }
}

loadDotEnvFile('.env.local');
loadDotEnvFile('.env');

const MONGODB_URI = process.env.MONGODB_URI || process.env.NEXT_PUBLIC_MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI not set in environment or .env files');
  process.exit(1);
}

async function run() {
  await mongoose.connect(MONGODB_URI, {
    dbName: process.env.MONGODB_DB || undefined,
  });
  console.log('Connected to MongoDB');

  const db = mongoose.connection.db;

  const artisan = {
    name: 'Pottery Collective',
    bio: 'Handmade pottery from local artisans',
    email: 'pottery@handcrafted.example',
    createdAt: new Date(),
  };

  const artisanRes = await db.collection('artisans').insertOne(artisan);
  const artisanId = artisanRes.insertedId;

  const products = [
    {
      title: 'Ornate Ceramic Vase',
      price: 48.0,
      image_url: '/assets/pottery/Ornateceramic.jpg',
      description: 'A hand-glazed ornate ceramic vase, perfect for flowers or as a decorative piece.',
      featured: true,
      rating: 4.7,
      artisan_id: artisanId,
      artisan_name: 'Pottery Collective',
      category: 'Pottery & Ceramics',
      stock: 12,
      tags: ['pottery','ceramics','vase'],
      createdAt: new Date(),
    },
    {
      title: 'Market Clay Pots',
      price: 26.0,
      image_url: '/assets/pottery/soukpots.jpg',
      description: 'Simple, sturdy clay pots traditionally used for cooking and storage.',
      featured: false,
      rating: 4.4,
      artisan_id: artisanId,
      artisan_name: 'Pottery Collective',
      category: 'Pottery & Ceramics',
      stock: 24,
      tags: ['clay','pots','kitchen'],
      createdAt: new Date(),
    },
    {
      title: 'Essaouira Decorative Pot',
      price: 55.0,
      image_url: '/assets/pottery/essaouirapot.jpg',
      description: 'Decorative pot hand-painted with coastal motifs from Essaouira.',
      featured: false,
      rating: 4.8,
      artisan_id: artisanId,
      artisan_name: 'Pottery Collective',
      category: 'Pottery & Ceramics',
      stock: 6,
      tags: ['decor','essaouira','handpainted'],
      createdAt: new Date(),
    },
    {
      title: 'Decorated Tajine',
      price: 39.0,
      image_url: '/assets/pottery/DecoratedTajines.jpg',
      description: 'Beautifully decorated tajine pot suitable for serving and cooking.',
      featured: false,
      rating: 4.6,
      artisan_id: artisanId,
      artisan_name: 'Pottery Collective',
      category: 'Pottery & Ceramics',
      stock: 10,
      tags: ['tajine','morocco','cooking'],
      createdAt: new Date(),
    }
  ];

  const insertRes = await db.collection('products').insertMany(products);
  console.log(`Inserted ${insertRes.insertedCount} products`);

  await mongoose.disconnect();
  console.log('Disconnected and done');
}

run().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
