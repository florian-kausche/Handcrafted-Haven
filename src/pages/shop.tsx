import React, { useState, useEffect } from 'react'
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

export default function Shop() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const { addItem } = useCart()

  const categories = ['All', 'Pottery & Ceramics', 'Jewelry', 'Textiles & Weaving', 'Woodwork', 'Candles', 'Leather']

  useEffect(() => {
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
      setProducts(data.products || [])
    } catch (error) {
      console.error('Failed to load products:', error)
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
                onClick={() => setSelectedCategory(cat === 'All' ? '' : cat)}
                className={selectedCategory === (cat === 'All' ? '' : cat) ? 'btn primary' : 'btn outline'}
                style={{ padding: '10px 20px' }}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p>No products found</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => {
                const productForCard = {
                  id: product.id,
                  title: product.title,
                  price: parseFloat(product.price),
                  image: product.image_url || '/assets/product-1.svg',
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
                    onAddToCart={async (p) => {
                      await handleAddToCart(product)
                    }}
                  />
                )
              })}
            </div>
          )}
        </div>
      </main>

      <Footer onSubscribe={() => {}} subscribed={false} />
    </>
  )
}

