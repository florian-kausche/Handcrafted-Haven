import mongoose from 'mongoose'

/*
  Order model

  Stores placed orders. Each order references a `User` (unless guest orders are
  recorded differently) and contains `items` with product references, per-item
  price and quantity, and overall metadata like status and payment method.
*/
const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
  price: Number,
}, { _id: false })

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [OrderItemSchema],
  total_amount: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  shipping_address: String,
  billing_address: String,
  payment_method: String,
}, { timestamps: true })

export default mongoose.models.Order || mongoose.model('Order', OrderSchema)
