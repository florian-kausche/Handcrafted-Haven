import mongoose from 'mongoose'

/*
  User model schema

  Fields:
  - email: unique identifier for login
  - passwordHash: bcrypt hash of the user's password
  - firstName, lastName: profile fields
  - role: enum-like string (e.g. 'customer', 'artisan', 'admin')
  The schema includes timestamps for `createdAt` and `updatedAt`.
*/
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  firstName: String,
  lastName: String,
  role: { type: String, default: 'customer' },
}, { timestamps: true })

// Export a cached model to avoid recompilation errors in server reloads
export default mongoose.models.User || mongoose.model('User', UserSchema)
