import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  firstName: String,
  lastName: String,
  role: { type: String, default: 'customer' },
}, { timestamps: true })

export default mongoose.models.User || mongoose.model('User', UserSchema)
