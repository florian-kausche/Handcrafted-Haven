import mongoose from 'mongoose'

/*
  CartItem model

  Represents an item in a user's persistent cart (for authenticated users).
  Cart items are unique per `(user, product)` pair via an index.
*/
const CartItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1 },
}, { timestamps: true })

CartItemSchema.index({ user: 1, product: 1 }, { unique: true })

export default mongoose.models.CartItem || mongoose.model('CartItem', CartItemSchema)
