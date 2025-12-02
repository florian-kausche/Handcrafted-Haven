import mongoose from 'mongoose'

/*
  Product reviews

  Simple schema to store user reviews for products. Each review links to a
  `User` and a `Product` and stores a numeric rating and optional comment.
*/
const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  rating: { type: Number, required: true },
  comment: String,
}, { timestamps: true })

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema)
