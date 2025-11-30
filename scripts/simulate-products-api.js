const fs = require('fs');
const mongoose = require('mongoose');

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
  } catch (e) {}
}

loadDotEnvFile('.env.local');
loadDotEnvFile('.env');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI not set');
  process.exit(1);
}

async function run() {
  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || undefined });
  const db = mongoose.connection.db;

  // parse simple CLI args like category="Pottery & Ceramics"
  const args = process.argv.slice(2);
  const params = {};
  for (const a of args) {
    const [k, v] = a.split('=');
    if (k && v) params[k] = decodeURIComponent(v);
  }

  const filter = {};
  if (params.category) filter.category = params.category;
  if (params.search) filter.$text = { $search: params.search };

  const page = parseInt(params.page || '1', 10) || 1;
  const pageSize = parseInt(params.pageSize || '100', 10) || 100;

  const total = await db.collection('products').countDocuments(filter);
  const products = await db.collection('products')
    .find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .toArray();

  const serialized = products.map(p => ({
    id: p._id.toString(),
    title: p.title,
    price: p.price,
    image_url: p.image_url || (p.images && p.images[0] && p.images[0].url) || '/assets/product-1.jpeg',
    featured: !!p.featured,
    description: p.description || '',
    rating: p.rating || 5,
    artisan_name: (p.artisan && p.artisan.name) || p.artisan_name || 'Artisan',
    category: p.category || 'Uncategorized',
  }));

  // Build simple facets: category counts and price range
  const facetsAgg = [
    { $match: filter },
    {
      $facet: {
        categories: [ { $sortByCount: '$category' } ],
        priceRange: [ { $group: { _id: null, min: { $min: '$price' }, max: { $max: '$price' } } } ],
        // Ratings bucketed by floored integer (0-5)
        ratings: [ { $group: { _id: { $floor: { $ifNull: ['$rating', 5] } }, count: { $sum: 1 } } }, { $sort: { _id: -1 } } ],
        // Artisan counts by artisan name
        artisans: [ { $group: { _id: '$artisan.name', count: { $sum: 1 } } }, { $sort: { count: -1 } } ],
        // Tags: unwind and count
        tags: [ { $unwind: { path: '$tags', preserveNullAndEmptyArrays: false } }, { $sortByCount: '$tags' } ]
      }
    }
  ];

  const facetRes = await db.collection('products').aggregate(facetsAgg).toArray();
  const categories = (facetRes[0] && facetRes[0].categories) || [];
  const priceStats = (facetRes[0] && facetRes[0].priceRange && facetRes[0].priceRange[0]) || { min: 0, max: 0 };
  const ratings = (facetRes[0] && facetRes[0].ratings) || [];
  const artisans = (facetRes[0] && facetRes[0].artisans) || [];
  const tags = (facetRes[0] && facetRes[0].tags) || [];

  const facets = {
    categories: categories.map(c => ({ value: c._id, count: c.count })),
    price: { min: priceStats.min || 0, max: priceStats.max || 0 },
    ratings: ratings.map(r => ({ value: r._id != null ? String(r._id) : 'unknown', count: r.count })),
    artisans: artisans.map(a => ({ value: a._id || 'Unknown', count: a.count })),
    tags: tags.map(t => ({ value: t._id || t._id === 0 ? String(t._id) : t._id, count: t.count }))
  };

  const out = { products: serialized, total, page, pageSize, facets };
  console.log(JSON.stringify(out, null, 2));
  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
