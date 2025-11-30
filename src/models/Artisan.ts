import mongoose from 'mongoose'

const ArtisanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  businessName: { type: String, required: true },
  bio: String,
  location: String,
  rating: { type: Number, default: 0 },
  total_reviews: { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.models.Artisan || mongoose.model('Artisan', ArtisanSchema)
