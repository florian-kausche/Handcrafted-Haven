import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import Modal from '../components/Modal'
import SubscriptionModal from '../components/SubscriptionModal'
import { useCart } from '../contexts/CartContext'
import { productsAPI } from '../lib/api'
import type { Product, CartItem } from '../types'

const SAMPLE_PRODUCTS: Product[] = [
  { id: 1, title: 'Handcrafted Ceramic Bowl Set', price: 89.99, image: '/assets/pottery/soukpots.jpg', featured: true, description: 'Hand-thrown ceramic bowl set with reactive glaze.', rating: 5, artisanName: 'Sarah Martinez' },
  { id: 2, title: 'Artisan Woven Basket', price: 65.00, image: '/assets/product-2.jpeg', featured: true, description: 'Handwoven storage basket using natural fibers.', rating: 5, artisanName: 'Maria Chen' },
  { id: 3, title: 'Handmade Silver Necklace', price: 120.00, image: '/assets/product-3.jpeg', featured: false, description: 'Handcrafted silver necklace with unique stone setting.', rating: 4.5, artisanName: 'Emma Thompson' },
  { id: 4, title: 'Wooden Serving Bowls', price: 75.00, image: '/assets/product-4.png', featured: false, description: 'Turned wooden serving bowls finished with food-safe oil.', rating: 5, artisanName: 'James Walker' },
  { id: 5, title: 'Natural Soy Candle Set', price: 45.00, image: '/assets/candle1.jpeg', featured: false, description: 'Hand-poured soy candles with natural fragrances.', rating: 4.5, artisanName: 'Lisa Anderson' },
  { id: 6, title: 'Leather Journal Cover', price: 55.00, image: '/assets/product-6.png', featured: false, description: 'Vegetable-tanned leather journal cover, stitched by hand.', rating: 5, artisanName: 'Michael Brown' },
  { id: 7, title: 'Ornate Ceramic Vase', price: 48.00, image: '/assets/pottery/Ornateceramic.jpg', featured: true, description: 'A hand-glazed ornate ceramic vase, perfect for flowers or as a decorative piece.', rating: 4.7, artisanName: 'Pottery Collective' },
  { id: 8, title: 'Essaouira Decorative Pot', price: 55.00, image: '/assets/pottery/essaouirapot.jpg', featured: true, description: 'Decorative pot hand-painted with coastal motifs from Essaouira.', rating: 4.8, artisanName: 'Pottery Collective' },
  { id: 9, title: 'Decorated Tajine', price: 39.00, image: '/assets/pottery/DecoratedTajines.jpg', featured: false, description: 'Beautifully decorated tajine pot suitable for serving and cooking.', rating: 4.6, artisanName: 'Pottery Collective' },
  { id: 10, title: 'Market Clay Pots', price: 26.00, image: '/assets/pottery/soukpots.jpg', featured: false, description: 'Simple, sturdy clay pots traditionally used for cooking and storage.', rating: 4.4, artisanName: 'Pottery Collective' },
  { id: 11, title: 'Hand-Thrown Planter', price: 34.00, image: '/assets/product-4.png', featured: true, description: 'A modern planter finished with a matte glaze, ideal for indoor greenery.', rating: 4.6, artisanName: 'Green Studio' },
  { id: 12, title: 'Set of Stoneware Mugs', price: 58.00, image: '/assets/product-5.png', featured: true, description: 'Durable stoneware mugs, each with a unique speckled glaze.', rating: 4.9, artisanName: 'Clay & Co.' },
  { id: 13, title: 'Engraved Wooden Spoon', price: 18.00, image: '/assets/product-6.png', featured: false, description: 'Hand-carved wooden spoon with decorative engraving.', rating: 5, artisanName: 'James Walker' },
  { id: 14, title: 'Scented Candle Trio', price: 29.00, image: '/assets/candle1.jpeg', featured: false, description: 'Three small soy candles in seasonal fragrances.', rating: 4.7, artisanName: 'Lisa Anderson' }
  ,{ id: 15, title: 'Blue Glaze Serving Plate', price: 42.00, image: '/assets/pottery/Ornateceramic.jpg', featured: true, description: 'Wheel-thrown serving plate with a glossy blue glaze.', rating: 4.8, artisanName: 'Azure Pottery' },
  { id: 16, title: 'Handloom Table Runner', price: 72.00, image: '/assets/product-2.jpeg', featured: false, description: 'Handloomed table runner using natural dyes and fibers.', rating: 4.6, artisanName: 'Weave House' },
  { id: 17, title: 'Ceramic Oil Bottle', price: 22.00, image: '/assets/pottery/essaouirapot.jpg', featured: false, description: 'Small ceramic oil bottle with an elegant spout.', rating: 4.5, artisanName: 'Pottery Collective' },
  { id: 18, title: 'Mini Succulent Planters (Set of 3)', price: 36.00, image: '/assets/product-4.png', featured: true, description: 'Small planters perfect for succulents and small herbs.', rating: 4.9, artisanName: 'Green Studio' },
  { id: 19, title: 'Rustic Cutting Board', price: 32.00, image: '/assets/product-6.png', featured: false, description: 'Hand-sanded cutting board finished with food-safe oil.', rating: 4.7, artisanName: 'James Walker' },
  { id: 20, title: 'Lavender Candle', price: 14.00, image: '/assets/candle1.jpeg', featured: true, description: 'Single lavender-scented soy candle for a calming atmosphere.', rating: 4.8, artisanName: 'Lisa Anderson' }
]

export default function Home() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  // Seed with sample data so the home grid renders instantly while API loads
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showCart, setShowCart] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [subscribedEmail, setSubscribedEmail] = useState('')
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const { addItem, items: cartItems, showToast } = useCart()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const data = await productsAPI.getAll({ featured: true })
      if (data.products && data.products.length > 0) {
        // Map API results and ensure each product has a unique id and image
        const mappedRaw = (data.products || []).map((p: any) => ({
          id: p.id || (p._id && (typeof p._id === 'string' ? p._id : p._id.toString())),
          title: p.title,
          price: parseFloat(p.price),
          image: p.image_url || (p.images && p.images[0] && p.images[0].url) || '/assets/product-1.jpeg',
          featured: !!p.featured,
          description: p.description || '',
          rating: p.rating || 5,
          artisanName: p.artisan_name || 'Artisan',
        }))

        // Deduplicate by id (or title) while preserving order
        const seen = new Set<string>()
        const mapped: Product[] = []
        for (const p of mappedRaw) {
          const key = String(p.id || p.title)
          if (!seen.has(key)) {
            seen.add(key)
            mapped.push(p)
          }
        }

        // If we got API results, use all of them, otherwise supplement with sample featured products
        if (mapped.length > 0) {
          setProducts(mapped)
        } else {
          // Only supplement if API returned nothing
          const existingTitles = new Set(mapped.map((m: any) => m.title))
          const fallback = SAMPLE_PRODUCTS.filter((s: any) => s.featured && !existingTitles.has(s.title))
          setProducts([...mapped, ...fallback])
        }
      } else {
        // Fallback to sample products if API fails
        setProducts(SAMPLE_PRODUCTS)
      }
    } catch (error) {
      console.error('Failed to load products:', error)
      setProducts(SAMPLE_PRODUCTS)
    }
  }

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products.length > 0 ? products : SAMPLE_PRODUCTS
    const productList = products.length > 0 ? products : SAMPLE_PRODUCTS
    return productList.filter(p => 
      p.title.toLowerCase().includes(q) || 
      (p.description || '').toLowerCase().includes(q)
    )
  }, [query, products])

  const handleAddToCart = async (product: Product) => {
    try {
      await addItem(product, 1)
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
  }

  async function handleSubscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const email = (form.elements[0] as HTMLInputElement).value
    
    if (!email || !email.includes('@')) {
      showToast?.('Please enter a valid email')
      return
    }

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        showToast?.(data.error || 'Failed to subscribe')
        return
      }

      localStorage.setItem('hh_newsletter', email)
      setSubscribedEmail(email)
      setSubscribed(true)
      setShowSubscriptionModal(true)
      form.reset()
    } catch (error) {
      console.error('Subscription error:', error)
      showToast?.('An error occurred. Please try again.')
    }
  }

  return (
    <>
      <Head>
        <title>Handcrafted Haven - Unique Handmade Treasures</title>
        <meta name="description" content="Discover unique handcrafted treasures from local artisans. Support sustainable craftsmanship and bring authentic, handmade quality into your home." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header />

      <main>
        <section className="hero" id="home">
          <div className="container hero-inner">
            <div className="hero-left">
              <div className="kicker">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 1l1.5 3 3.5.5-2.5 2.5.5 3.5L8 9.5 5 11l.5-3.5L3 5l3.5-.5L8 1z" fill="currentColor"/>
                </svg>
                Authentic Handcrafted Quality
              </div>
              <h1>Discover Unique <span>Handcrafted</span> Treasures</h1>
              <p className="lead">
                Shop directly from talented artisans around the world. Every piece tells a story, 
                supports sustainable practices, and brings authentic craftsmanship into your home.
              </p>
              <div className="hero-cta">
                <Link href="/shop" className="btn primary">
                  Explore Collection
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '8px' }}>
                    <path d="M7.5 15l5-5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <Link href="/register?role=artisan" className="btn outline">Become a Seller</Link>
              </div>
            </div>
            <div className="hero-right">
              <div className="hero-card">
                <Image
                  src="/assets/avatar-2.png"
                  alt="Beautiful handcrafted products"
                  width={600}
                  height={450}
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="container features-inner">
            <div className="feature">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 4L4 10v6c0 7.18 4.84 13.91 12 16 7.16-2.09 12-8.82 12-16v-6L16 4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 16l4 4 8-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h4>100% Authentic</h4>
              <p>Every item is carefully vetted and comes directly from verified artisans. Guaranteed quality and craftsmanship.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="11" r="3" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 26c0-4 3.5-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M24 12c1.1 0 2-.9 2-2s-.9-2-2-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M26 19c2 .5 3 2 3 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h4>Support Artisans</h4>
              <p>Your purchase directly supports independent makers and helps preserve traditional crafts for future generations.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M28 16c0 6.627-5.373 12-12 12S4 22.627 4 16 9.373 4 16 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M16 4c3.5 0 6.5 1.5 8 4M26 10l-10 10-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h4>Eco-Friendly</h4>
              <p>Sustainable materials and ethical production methods. Make choices that are good for you and the planet.</p>
            </div>
          </div>
        </section>

        <section className="featured-creations" id="shop">
          <div className="container">
            <div className="section-head">
              <div>
                <h2>Featured Collection</h2>
                <p className="muted">Handpicked treasures from our most talented artisans</p>
              </div>
              <Link href="/shop" className="view-all">
                Browse All Products
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 15l5-5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

            <div className="products-grid">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={(p) => router.push(`/product/${p.id}`)}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="artisans" id="about">
          <div className="container">
            <div className="section-head center">
              <h2>Meet Our Master Artisans</h2>
              <p className="muted">
                Connect with the talented creators behind each piece. Every artisan brings years of experience, 
                dedication, and passion to their craft, creating heirloom-quality pieces you'll treasure forever.
              </p>
            </div>

            <div className="artist-grid">
              <div className="artist-card">
                <Image
                  className="avatar"
                  src="/assets/profile/avatar-1.JPG"
                  alt="Sarah Martinez"
                  width={140}
                  height={140}
                />
                <div className="artist-rating">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 1l1.5 3 3.5.5-2.5 2.5.5 3.5L6 8.5 3 10.5l.5-3.5L1 4.5l3.5-.5L6 1z" fill="currentColor"/>
                  </svg>
                  <span>4.9</span>
                </div>
                <h4>Sarah Martinez</h4>
                <p className="role">Pottery & Ceramics • Portland, OR</p>
                <p className="bio">
                  Creating functional art with clay for over 16 years. Each piece is hand-thrown and uniquely glazed.
                </p>
              </div>

              <div className="artist-card">
                <Image
                  className="avatar"
                  src="/assets/profile/avatar-2.jpeg"
                  alt="Maria Chen"
                  width={140}
                  height={140}
                />
                <div className="artist-rating">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 1l1.5 3 3.5.5-2.5 2.5.5 3.5L6 8.5 3 10.5l.5-3.5L1 4.5l3.5-.5L6 1z" fill="currentColor"/>
                  </svg>
                  <span>4.8</span>
                </div>
                <h4>Maria Chen</h4>
                <p className="role">Textile Weaving • Santa Fe, NM</p>
                <p className="bio">
                  Traditional weaving techniques passed down through generations, creating modern heirloom pieces.
                </p>
              </div>

              <div className="artist-card">
                <Image
                  className="avatar"
                  src="/assets/profile/avatar-3.jpg"
                  alt="James Walker"
                  width={140}
                  height={140}
                />
                <div className="artist-rating">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 1l1.5 3 3.5.5-2.5 2.5.5 3.5L6 8.5 3 10.5l.5-3.5L1 4.5l3.5-.5L6 1z" fill="currentColor"/>
                  </svg>
                  <span>5.0</span>
                </div>
                <h4>James Walker</h4>
                <p className="role">Woodworking • Asheville, NC</p>
                <p className="bio">
                  Sustainable woodworking using locally sourced materials to create timeless kitchen essentials.
                </p>
              </div>
            </div>

            <div className="center">
              <Link href="/about" className="btn outline">
                Discover More Stories
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '8px' }}>
                  <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </section>

        <section className="cta-band" id="community">
          <div className="container cta-inner">
            <h2>Ready to Share Your Craft?</h2>
            <p className="lead">
              Join our thriving community of artisans and reach customers who value quality, authenticity, 
              and the story behind each handmade piece. Start your journey today.
            </p>
            <Link href="/register?role=artisan" className="btn primary dark">
              Start Selling Today
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '8px' }}>
                <path d="M7.5 15l5-5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </section>
      </main>

      <Footer onSubscribe={handleSubscribe} subscribed={subscribed} />

      <Modal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        type="product"
        product={selectedProduct || undefined}
        onAddToCart={handleAddToCart}
      />

      <SubscriptionModal
        isOpen={showSubscriptionModal}
        email={subscribedEmail}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </>
  )
}
