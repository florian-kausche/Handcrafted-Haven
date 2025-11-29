import React, { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { productsAPI } from '../lib/api'
import { useCart } from '../contexts/CartContext'

interface Product {
  id: number
  title: string
  price: string
  image_url: string
  featured: boolean
  description: string
  rating: number
  artisan_name: string
  category: string
}

const SAMPLE_PRODUCTS: Product[] = [
  { id: 1, title: 'Handcrafted Ceramic Bowl Set', price: '89.99', image_url: '/assets/product-1.jpeg', featured: true, description: 'Hand-thrown ceramic bowl set with reactive glaze.', rating: 5, artisan_name: 'Sarah Martinez', category: 'Pottery & Ceramics' },
  { id: 2, title: 'Artisan Woven Basket', price: '65.00', image_url: '/assets/product-2.jpeg', featured: true, description: 'Handwoven storage basket using natural fibers.', rating: 5, artisan_name: 'Maria Chen', category: 'Textiles & Weaving' },
  { id: 3, title: 'Handmade Silver Necklace', price: '120.00', image_url: '/assets/product-3.jpeg', featured: false, description: 'Handcrafted silver necklace with unique stone setting.', rating: 4.5, artisan_name: 'Emma Thompson', category: 'Jewelry' },
  { id: 4, title: 'Wooden Serving Bowls', price: '75.00', image_url: '/assets/product-4.png', featured: false, description: 'Turned wooden serving bowls finished with food-safe oil.', rating: 5, artisan_name: 'James Walker', category: 'Woodwork' },
  { id: 5, title: 'Natural Soy Candle Set', price: '45.00', image_url: '/assets/product-5.png', featured: false, description: 'Hand-poured soy candles with natural fragrances.', rating: 4.5, artisan_name: 'Lisa Anderson', category: 'Candles' },
  { id: 6, title: 'Leather Journal Cover', price: '55.00', image_url: '/assets/product-6.png', featured: false, description: 'Vegetable-tanned leather journal cover, stitched by hand.', rating: 5, artisan_name: 'Michael Brown', category: 'Leather' },
]

export default function Shop() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const { addItem } = useCart()

  const categories = ['All', 'Pottery & Ceramics', 'Jewelry', 'Textiles & Weaving', 'Woodwork', 'Candles', 'Leather']

  useEffect(() => {
    // If URL contains a category query param, sync it to selectedCategory so the button highlights
    if (router.query.category && router.query.category !== selectedCategory) {
      setSelectedCategory(router.query.category as string)
    }
    loadProducts()
  }, [router.query, selectedCategory])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (router.query.search) params.search = router.query.search as string
      if (router.query.category) params.category = router.query.category as string
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory

      const data = await productsAPI.getAll(params)
      // normalize products coming from API to include category and expected fields
      const apiProducts = (data.products || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        price: p.price || '0.00',
        image_url: p.image_url || '/assets/product-1.jpeg',
        featured: p.featured || false,
        description: p.description || '',
        rating: p.rating || 5,
        artisan_name: p.artisan_name || 'Artisan',
        category: p.category || 'Uncategorized',
      }))
      setProducts(apiProducts)
    } catch (error) {
      console.error('Failed to load products:', error)
      // fallback to sample products when API fails
      setProducts(SAMPLE_PRODUCTS)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (product: Product) => {
    try {
      await addItem(product.id, 1)
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
  }

  const productsRef = useRef<HTMLDivElement | null>(null)

  // Select a category client-side. Also update the URL shallowly so it's bookmarkable,
  // and smoothly scroll the products area into view so the user sees the results.
  const handleSelectCategory = (cat: string) => {
    const value = cat === 'All' ? '' : cat
    setSelectedCategory(value)
    // update URL query param without a full navigation
    const query = value ? { category: value } : {}
    router.push({ pathname: '/shop', query }, undefined, { shallow: true })

    // allow the DOM to update then scroll into view
    requestAnimationFrame(() => {
      // small timeout to let layout settle (works well with Next shallow routing)
      setTimeout(() => {
        if (productsRef.current) {
          productsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 80)
    })
  }

  return (
    <>
      <Head>
        <title>Shop - Handcrafted Haven</title>
      </Head>

      <Header />

      <main style={{ padding: '40px 0' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '42px', marginBottom: '8px' }}>Shop</h1>
          <p style={{ color: 'var(--muted)', marginBottom: '32px' }}>Discover unique handcrafted treasures</p>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '40px', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleSelectCategory(cat)}
                className={selectedCategory === (cat === 'All' ? '' : cat) ? 'btn primary' : 'btn outline'}
                style={{ padding: '10px 20px' }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div ref={productsRef}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p>No products found</p>
            </div>
          ) : (
            <>
              {/* If a category filter is active, show filtered grid. Otherwise render sections per category */}
              {selectedCategory && selectedCategory !== 'All' ? (
                <div className="products-grid">
                  {products
                    .filter((p) => (p.category || 'Uncategorized') === selectedCategory)
                    .map((product) => {
                      const productForCard = {
                        id: product.id,
                        title: product.title,
                        price: parseFloat(product.price as any),
                        image: product.image_url || '/assets/product-1.jpeg',
                        featured: product.featured,
                        description: product.description || '',
                        rating: product.rating || 5,
                        artisanName: product.artisan_name || 'Artisan',
                      }
                      return (
                        <ProductCard
                          key={product.id}
                          product={productForCard}
                          onSelect={(p) => router.push(`/product/${p.id}`)}
                          onAddToCart={async () => { await handleAddToCart(product) }}
                        />
                      )
                    })}
                </div>
              ) : (
                // Group products by category and render sections
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                  {categories.slice(1).map((cat) => {
                    const items = products.filter((p) => ((p.category || 'Uncategorized') === cat))
                    if (items.length === 0) return null
                    return (
                      <section key={cat}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <h3 style={{ margin: 0 }}>{cat}</h3>
                          <button onClick={() => handleSelectCategory(cat)} className="view-all" style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}>View All</button>
                        </div>
                        <div className="products-grid">
                          {items.slice(0, 8).map((product) => {
                            const productForCard = {
                              id: product.id,
                              title: product.title,
                              price: parseFloat(product.price as any),
                              image: product.image_url || '/assets/product-1.jpeg',
                              featured: product.featured,
                              description: product.description || '',
                              rating: product.rating || 5,
                              artisanName: product.artisan_name || 'Artisan',
                            }
                            return (
                              <ProductCard
                                key={product.id}
                                product={productForCard}
                                onSelect={(p) => router.push(`/product/${p.id}`)}
                                onAddToCart={async () => { await handleAddToCart(product) }}
                              />
                            )
                          })}
                        </div>
                      </section>
                    )
                  })}
                </div>
              )}
            </>
          )}
          </div>
        </div>
      </main>

      <Footer onSubscribe={() => {}} subscribed={false} />
    </>
  )
}

