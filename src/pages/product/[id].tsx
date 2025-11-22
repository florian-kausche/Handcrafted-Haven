import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { productsAPI } from '../../lib/api'
import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'

export default function ProductDetail() {
  const router = useRouter()
  const { id } = router.query
  const { user } = useAuth()
  const [product, setProduct] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' })
  const { addItem } = useCart()

  useEffect(() => {
    if (id) {
      loadProduct()
    }
  }, [id])

  const loadProduct = async () => {
    setLoading(true)
    try {
      const data = await productsAPI.getById(Number(id))
      setProduct(data.product)
      setReviews(data.reviews || [])
    } catch (error) {
      console.error('Failed to load product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return
    try {
      await addItem(product.id, quantity)
      alert('Added to cart!')
    } catch (error) {
      console.error('Failed to add to cart:', error)
      alert('Failed to add to cart. Please try again.')
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      alert('Please login to submit a review')
      return
    }

    try {
      const response = await fetch(`/api/products/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(reviewData),
      })

      if (!response.ok) {
        throw new Error('Failed to submit review')
      }

      setReviewData({ rating: 5, comment: '' })
      setShowReviewForm(false)
      loadProduct() // Reload to show new review
      alert('Review submitted successfully!')
    } catch (error) {
      console.error('Failed to submit review:', error)
      alert('Failed to submit review')
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main style={{ padding: '80px 0', textAlign: 'center' }}>
          <p>Loading...</p>
        </main>
        <Footer onSubscribe={() => {}} subscribed={false} />
      </>
    )
  }

  if (!product) {
    return (
      <>
        <Header />
        <main style={{ padding: '80px 0', textAlign: 'center' }}>
          <p>Product not found</p>
        </main>
        <Footer onSubscribe={() => {}} subscribed={false} />
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{product.title} - Handcrafted Haven</title>
      </Head>

      <Header />

      <main style={{ padding: '40px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', marginBottom: '60px' }}>
            <div>
              <img
                src={product.image_url || '/assets/product-1.svg'}
                alt={product.title}
                style={{ width: '100%', borderRadius: '16px', objectFit: 'cover' }}
              />
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', marginBottom: '16px' }}>
                {product.title}
              </h1>
              <p style={{ color: 'var(--muted)', marginBottom: '16px' }}>by {product.artisan_name}</p>
              <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--accent)', marginBottom: '24px' }}>
                ${parseFloat(product.price).toFixed(2)}
              </div>
              <p style={{ marginBottom: '32px', lineHeight: '1.7' }}>{product.description}</p>

              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Quantity</label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="btn outline"
                    style={{ padding: '8px 16px' }}
                  >
                    -
                  </button>
                  <span style={{ fontSize: '18px', fontWeight: '600', minWidth: '40px', textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="btn outline"
                    style={{ padding: '8px 16px' }}
                  >
                    +
                  </button>
                </div>
              </div>

              <button onClick={handleAddToCart} className="btn primary" style={{ width: '100%', marginBottom: '16px' }}>
                Add to Cart
              </button>

              <div style={{ padding: '20px', background: 'var(--bg)', borderRadius: '12px' }}>
                <h3 style={{ marginBottom: '12px' }}>About the Artisan</h3>
                <p style={{ color: 'var(--muted)', marginBottom: '8px' }}>{product.artisan_name}</p>
                {product.artisan_location && (
                  <p style={{ color: 'var(--muted)', fontSize: '14px' }}>{product.artisan_location}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px' }}>Reviews</h2>
              {user && (
                <button className="btn outline" onClick={() => setShowReviewForm(!showReviewForm)}>
                  {showReviewForm ? 'Cancel' : 'Write a Review'}
                </button>
              )}
            </div>

            {showReviewForm && user && (
              <form onSubmit={handleSubmitReview} style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', marginBottom: '24px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Rating</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewData({ ...reviewData, rating: star })}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          fontSize: '24px',
                          cursor: 'pointer',
                          color: star <= reviewData.rating ? '#fbbf24' : '#ddd',
                        }}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Comment</label>
                  <textarea
                    value={reviewData.comment}
                    onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                    rows={4}
                    style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px' }}
                  />
                </div>
                <button type="submit" className="btn primary">Submit Review</button>
              </form>
            )}

            {reviews.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {reviews.map((review) => (
                  <div key={review.id} style={{ padding: '20px', background: 'white', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <strong>{review.first_name} {review.last_name}</strong>
                      <div>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} style={{ color: i < review.rating ? '#fbbf24' : '#ddd' }}>★</span>
                        ))}
                      </div>
                    </div>
                    {review.comment && <p style={{ color: 'var(--muted)' }}>{review.comment}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '40px 0' }}>No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>
      </main>

      <Footer onSubscribe={() => {}} subscribed={false} />
    </>
  )
}

