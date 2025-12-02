import mongoose from 'mongoose'

/*
  Product model

  This schema captures the product catalog items displayed in the shop. It
  includes support for images, simple variants, stock tracking, and a link
  back to an `Artisan` for seller information.
*/
const ImageSchema = new mongoose.Schema({
  url: String,
  alt: String,
  type: String,
}, { _id: false })

const VariantSchema = new mongoose.Schema({
  sku: String,
  title: String,
  price: Number,
  stock_quantity: Number,
  attributes: Object,
}, { _id: false })

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
}, { timestamps: true })

// Text index for search (title, description, tags)
ProductSchema.index({ title: 'text', description: 'text', tags: 'text' })

// Export the model. `mongoose.models.Product` guards against model recompilation
// errors during hot reload in development.
export default mongoose.models.Product || mongoose.model('Product', ProductSchema)
