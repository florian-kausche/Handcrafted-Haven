import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import Modal from '../components/Modal'
import { useCart } from '../contexts/CartContext'
import { productsAPI } from '../lib/api'

interface Product {
  id: number
  title: string
  price: number
  image: string
  featured: boolean
  description: string
  rating: number
  artisanName: string
}

interface CartItem {
  id: number
  title: string
  price: number
  qty: number
}

const SAMPLE_PRODUCTS: Product[] = [
  { id: 1, title: 'Handcrafted Ceramic Bowl Set', price: 89.99, image: '/assets/product-1.jpeg', featured: true, description: 'Hand-thrown ceramic bowl set with reactive glaze.', rating: 5, artisanName: 'Sarah Martinez' },
  { id: 2, title: 'Artisan Woven Basket', price: 65.00, image: '/assets/product-2.jpeg', featured: true, description: 'Handwoven storage basket using natural fibers.', rating: 5, artisanName: 'Maria Chen' },
  { id: 3, title: 'Handmade Silver Necklace', price: 120.00, image: '/assets/product-3.jpeg', featured: false, description: 'Handcrafted silver necklace with unique stone setting.', rating: 4.5, artisanName: 'Emma Thompson' },
  { id: 4, title: 'Wooden Serving Bowls', price: 75.00, image: '/assets/product-4.png', featured: false, description: 'Turned wooden serving bowls finished with food-safe oil.', rating: 5, artisanName: 'James Walker' },
  { id: 5, title: 'Natural Soy Candle Set', price: 45.00, image: '/assets/product-5.png', featured: false, description: 'Hand-poured soy candles with natural fragrances.', rating: 4.5, artisanName: 'Lisa Anderson' },
  { id: 6, title: 'Leather Journal Cover', price: 55.00, image: '/assets/product-6.png', featured: false, description: 'Vegetable-tanned leather journal cover, stitched by hand.', rating: 5, artisanName: 'Michael Brown' },
  { id: 7, title: 'Ornate Ceramic Vase', price: 48.00, image: '/assets/pottery/Ornateceramic.jpg', featured: true, description: 'A hand-glazed ornate ceramic vase, perfect for flowers or as a decorative piece.', rating: 4.7, artisanName: 'Pottery Collective' },
  { id: 8, title: 'Essaouira Decorative Pot', price: 55.00, image: '/assets/pottery/essaouirapot.jpg', featured: true, description: 'Decorative pot hand-painted with coastal motifs from Essaouira.', rating: 4.8, artisanName: 'Pottery Collective' },
  { id: 9, title: 'Decorated Tajine', price: 39.00, image: '/assets/pottery/DecoratedTajines.jpg', featured: false, description: 'Beautifully decorated tajine pot suitable for serving and cooking.', rating: 4.6, artisanName: 'Pottery Collective' },
  { id: 10, title: 'Market Clay Pots', price: 26.00, image: '/assets/pottery/soupkpots.jpg', featured: false, description: 'Simple, sturdy clay pots traditionally used for cooking and storage.', rating: 4.4, artisanName: 'Pottery Collective' },
  { id: 11, title: 'Hand-Thrown Planter', price: 34.00, image: '/assets/product-4.png', featured: true, description: 'A modern planter finished with a matte glaze, ideal for indoor greenery.', rating: 4.6, artisanName: 'Green Studio' },
  { id: 12, title: 'Set of Stoneware Mugs', price: 58.00, image: '/assets/product-5.png', featured: true, description: 'Durable stoneware mugs, each with a unique speckled glaze.', rating: 4.9, artisanName: 'Clay & Co.' },
  { id: 13, title: 'Engraved Wooden Spoon', price: 18.00, image: '/assets/product-6.png', featured: false, description: 'Hand-carved wooden spoon with decorative engraving.', rating: 5, artisanName: 'James Walker' },
  { id: 14, title: 'Scented Candle Trio', price: 29.00, image: '/assets/candle1.jpeg', featured: false, description: 'Three small soy candles in seasonal fragrances.', rating: 4.7, artisanName: 'Lisa Anderson' }
]

export default function Home() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showCart, setShowCart] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const { addItem, items: cartItems } = useCart()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const data = await productsAPI.getAll({ featured: true })
      if (data.products && data.products.length > 0) {
        const mapped = data.products.map((p: any) => ({
          id: p.id,
          title: p.title,
          price: parseFloat(p.price),
          image: p.image_url || '/assets/product-1.jpeg',
          featured: p.featured,
          description: p.description,
          rating: p.rating || 5,
          artisanName: p.artisan_name || 'Artisan',
        }))

        // If the API returned few featured items, supplement with sample featured products
        const TARGET_COUNT = 6
        if (mapped.length < TARGET_COUNT) {
          const existingTitles = new Set(mapped.map((m: any) => m.title))
          const fallback = SAMPLE_PRODUCTS.filter((s: any) => s.featured && !existingTitles.has(s.title))
          let i = 0
          while (mapped.length < TARGET_COUNT && i < fallback.length) {
            mapped.push(fallback[i])
            i++
          }
        }

        setProducts(mapped)
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
      p.description.toLowerCase().includes(q)
    )
  }, [query, products])

  const handleAddToCart = async (product: Product) => {
    try {
      await addItem(product.id, 1)
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
  }

  function handleSubscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const email = (form.elements[0] as HTMLInputElement).value
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email')
      return
    }
    localStorage.setItem('hh_newsletter', email)
    setSubscribed(true)
  }

  return (
    <>
      <Head>
        <title>Handcrafted Haven - Unique Handmade Treasures</title>
        <meta name="description" content="Discover unique handcrafted treasures from local artisans. Support sustainable craftsmanship and bring authentic, handmade quality into your home." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet" />
      </Head>

      <Header />

      <main>
        <section className="hero" id="home">
          <div className="container hero-inner">
            <div className="hero-left">
              <div className="kicker">Handmade with Love</div>
              <h1>Discover Unique Handcrafted Treasures</h1>
              <p className="lead">
                Support local artisans and bring authentic, sustainable craftsmanship into your home. 
                Every purchase tells a story and supports a creator's passion.
              </p>
              <div className="hero-cta">
                <Link href="/shop" className="btn primary">
                  Shop Now
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '8px' }}>
                    <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <Link href="/register?role=artisan" className="btn outline">Become a Seller</Link>
              </div>
            </div>
            <div className="hero-right">
              <div className="hero-card">
                <Image
                  src="/assets/avatar-2.png"
                  alt="Handcrafted tools and materials"
                  width={520}
                  height={360}
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
                  <circle cx="10" cy="12" r="2" fill="currentColor"/>
                  <circle cx="16" cy="10" r="2" fill="currentColor"/>
                  <circle cx="22" cy="12" r="2" fill="currentColor"/>
                  <path d="M8 20c0-2 2-4 4-4h8c2 0 4 2 4 4v4H8v-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h4>Support Artisans</h4>
              <p>Every purchase directly supports independent makers and their craft.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 4L4 10v6c0 6.627 5.373 12 12 12s12-5.373 12-12v-6L16 4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 16l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h4>Quality Guaranteed</h4>
              <p>Each item is carefully curated and crafted with attention to detail.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="6" y="8" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 12h20M10 16h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 20h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 6l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h4>Sustainable Choice</h4>
              <p>Eco-friendly materials and practices for a better tomorrow.</p>
            </div>
          </div>
        </section>

        <section className="featured-creations" id="shop">
          <div className="container">
            <div className="section-head">
              <div>
                <h2>Featured Creations</h2>
                <p className="muted">Handpicked treasures from our talented community</p>
              </div>
              <Link href="/shop" className="view-all">
                View All
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '6px', display: 'inline-block', verticalAlign: 'middle' }}>
                  <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
              <h2>Meet Our Artisans</h2>
              <p className="muted">
                Get to know the talented makers behind the crafts. Each artisan brings their unique story, 
                skill, and passion to every creation.
              </p>
            </div>

            <div className="artist-grid">
              <div className="artist-card">
                <Image
                  className="avatar"
                  src="/assets/avatar-1.jpeg"
                  alt="Sarah Martinez"
                  width={64}
                  height={64}
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
                  src="/assets/avatar-2.jpeg"
                  alt="Maria Chen"
                  width={64}
                  height={64}
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
                  src="/assets/avatar-3.svg"
                  alt="James Walker"
                  width={64}
                  height={64}
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
            <h2>Are You an Artisan?</h2>
            <p className="lead muted">
              Join our community of talented makers. Share your craft with the world and connect with 
              customers who value handmade quality.
            </p>
            <Link href="/register?role=artisan" className="btn primary dark">
              Start Selling Today
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '8px' }}>
                <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
    </>
  )
}
