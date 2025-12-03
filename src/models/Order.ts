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
  // `user` is optional to support guest orders
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  // For guest checkout we store the email and a short-lived token so a public
  // receipt link can be validated without exposing other orders.
  guest_email: { type: String },
  guest_token: { type: String },
  guest_token_expires: { type: Date },
  // persisted email send status
  email_sent: { type: Boolean },
  items: [OrderItemSchema],
  total_amount: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  shipping_address: String,
  billing_address: String,
  payment_method: String,
}, { timestamps: true })

export default mongoose.models.Order || mongoose.model('Order', OrderSchema)
