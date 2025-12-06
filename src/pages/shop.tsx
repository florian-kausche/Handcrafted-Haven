import React, { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SubscriptionModal from '../components/SubscriptionModal'
import ProductCard from '../components/ProductCard'
import { productsAPI } from '../lib/api'
import { useCart } from '../contexts/CartContext'
import { useSubscription } from '../contexts/SubscriptionContext'
import connectMongoose from '../lib/mongoose'
import ProductModel from '../models/Product'
import type { Product } from '../types'

const SAMPLE_PRODUCTS: Product[] = [
  { id: 1, title: 'Handcrafted Ceramic Bowl Set', price: '89.99', image_url: '/assets/product-1.jpeg', featured: true, description: 'Hand-thrown ceramic bowl set with reactive glaze.', rating: 5, artisan_name: 'Sarah Martinez', category: 'Pottery & Ceramics' },
  { id: 2, title: 'Artisan Woven Basket', price: '65.00', image_url: '/assets/product-2.jpeg', featured: true, description: 'Handwoven storage basket using natural fibers.', rating: 5, artisan_name: 'Maria Chen', category: 'Textiles & Weaving' },
  { id: 3, title: 'Handmade Silver Necklace', price: '120.00', image_url: '/assets/product-3.jpeg', featured: false, description: 'Handcrafted silver necklace with unique stone setting.', rating: 4.5, artisan_name: 'Emma Thompson', category: 'Jewelry' },
  { id: 11, title: 'Beaded Maasai Necklace', price: '55.00', image_url: '/assets/product-11.jpeg', featured: false, description: 'Colorful handcrafted beaded necklace inspired by Maasai designs.', rating: 4.7, artisan_name: 'Nia Wanjiru', category: 'Jewelry' },
  { id: 12, title: 'Kente Cloth Wrap', price: '150.00', image_url: '/assets/product-12.jpeg', featured: false, description: 'Handwoven Kente cloth from Ghana, bright geometric patterns.', rating: 4.9, artisan_name: 'Kwame Mensah', category: 'Textiles & Weaving' },
  { id: 13, title: 'Carved Wooden Stool', price: '120.00', image_url: '/assets/product-13.jpeg', featured: false, description: 'Solid carved wooden stool with traditional motifs.', rating: 4.8, artisan_name: 'Ayo Okonkwo', category: 'Woodwork' },
  { id: 14, title: 'Brass Tuareg Lamp', price: '85.00', image_url: '/assets/product-14.jpeg', featured: false, description: 'Hand-hammered brass lamp in Tuareg style.', rating: 4.6, artisan_name: 'Ibrahim El-Mansour', category: 'Woodwork' },
  { id: 15, title: 'Soapstone Elephant', price: '40.00', image_url: '/assets/product-15.jpeg', featured: false, description: 'Small soapstone carving of an elephant, polished finish.', rating: 4.5, artisan_name: 'Lekwa Carvings', category: 'Woodwork' },
  { id: 4, title: 'Wooden Serving Bowls', price: '75.00', image_url: '/assets/product-4.png', featured: false, description: 'Turned wooden serving bowls finished with food-safe oil.', rating: 5, artisan_name: 'James Walker', category: 'Woodwork' },
  { id: 5, title: 'Natural Soy Candle Set', price: '45.00', image_url: '/assets/product-5.png', featured: false, description: 'Hand-poured soy candles with natural fragrances.', rating: 4.5, artisan_name: 'Lisa Anderson', category: 'Candles' },
  { id: 6, title: 'Leather Journal Cover', price: '55.00', image_url: '/assets/product-6.png', featured: false, description: 'Vegetable-tanned leather journal cover, stitched by hand.', rating: 5, artisan_name: 'Michael Brown', category: 'Leather' },
  { id: 7, title: 'Ornate Ceramic Vase', price: '74.00', image_url: '/assets/pottery/Ornateceramic.jpg', featured: false, description: 'Decorative hand-painted ceramic vase with intricate patterns.', rating: 4.9, artisan_name: "Sarah's Pottery", category: 'Pottery & Ceramics' },
  { id: 8, title: 'Traditional Souk Pots', price: '48.00', image_url: '/assets/pottery/soukpots.jpg', featured: false, description: 'Set of small decorative pots inspired by North African souk wares.', rating: 4.8, artisan_name: "Sarah's Pottery", category: 'Pottery & Ceramics' },
  { id: 9, title: 'Essaouira Clay Pot', price: '62.50', image_url: '/assets/pottery/essaouirapot.jpg', featured: false, description: 'Robust clay pot crafted in traditional Essaouira style.', rating: 4.9, artisan_name: "Sarah's Pottery", category: 'Pottery & Ceramics' },
  { id: 10, title: 'Decorated Tajines', price: '95.00', image_url: '/assets/pottery/DecoratedTajines.jpg', featured: false, description: 'Hand-decorated tajines perfect for cooking and display.', rating: 5.0, artisan_name: "Sarah's Pottery", category: 'Pottery & Ceramics' },
  { id: 16, title: 'Handwoven Raffia Mat', price: '38.00', image_url: '/assets/product-16.jpeg', featured: false, description: 'Durable handwoven raffia mat for home display or use.', rating: 4.4, artisan_name: 'Coast Weavers', category: 'Textiles & Weaving' },
  { id: 17, title: 'Beaded Leather Sandals', price: '65.00', image_url: '/assets/product-17.jpeg', featured: false, description: 'Comfortable leather sandals decorated with beadwork.', rating: 4.6, artisan_name: 'Tala Footwear', category: 'Leather' },
  { id: 18, title: 'Indigo Adire Scarf', price: '42.00', image_url: '/assets/product-18.jpeg', featured: false, description: 'Resist-dyed indigo scarf using traditional Adire techniques.', rating: 4.7, artisan_name: 'Abeni Textiles', category: 'Textiles & Weaving' },
  { id: 19, title: 'Hand-poured Scented Candle', price: '22.00', image_url: '/assets/product-19.jpeg', featured: false, description: 'Small batch scented candle using local essential oils.', rating: 4.5, artisan_name: 'Mwezi Candles', category: 'Candles' },
  { id: 20, title: 'Tuareg Leather Wallet', price: '28.00', image_url: '/assets/product-20.jpeg', featured: false, description: 'Handstitched leather wallet with stamped patterns.', rating: 4.3, artisan_name: 'Sahara Leather', category: 'Leather' },
]

type CategoryCount = { value: string; count: number }

type ShopProps = {
  initialProducts?: Product[]
  categories?: CategoryCount[]
}

export default function Shop({ initialProducts = [], categories = [] }: ShopProps) {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [availableCategories, setAvailableCategories] = useState<CategoryCount[]>(categories || [])
  const { addItem } = useCart()
  const { subscribed, subscribedEmail, showSubscriptionModal, setShowSubscriptionModal, handleSubscribe } = useSubscription()

  const fallbackCats = ['All', 'Pottery & Ceramics', 'Jewelry', 'Textiles & Weaving', 'Woodwork', 'Candles', 'Leather']

  // Sync selectedCategory from URL when it changes
  useEffect(() => {
    if (router.query.category && router.query.category !== selectedCategory) {
      setSelectedCategory(router.query.category as string)
    }
  }, [router.query.category])

  // Whenever selectedCategory or search changes, load products client-side
  useEffect(() => {
    // avoid server-side forced SSR param
    if (!router.query.ssr) {
      loadProducts()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, router.query.search])

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
        id: p.id || (p._id && (typeof p._id === 'string' ? p._id : p._id.toString())) || undefined,
        title: p.title,
        price: p.price || '0.00',
        image_url: p.image_url || (p.images && p.images[0] && p.images[0].url) || '/assets/product-1.jpeg',
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
      await addItem(product, 1)
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
            {(availableCategories.length > 0 ? [{ value: 'All', count: 0 }, ...availableCategories] : fallbackCats.map(c => ({ value: c, count: 0 }))).map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleSelectCategory(cat.value)}
                className={selectedCategory === (cat.value === 'All' ? '' : cat.value) ? 'btn primary' : 'btn outline'}
                style={{ padding: '10px 20px' }}
              >
                {cat.value}{cat.count ? ` (${cat.count})` : ''}
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
                  {(availableCategories.length > 0 ? availableCategories : fallbackCats.map(c => ({ value: c, count: 0 }))).map((cat) => {
                    const items = products.filter((p) => ((p.category || 'Uncategorized') === cat.value))
                    if (items.length === 0) return null
                    return (
                      <section key={cat.value}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <h3 style={{ margin: 0 }}>{cat.value}</h3>
                          <button onClick={() => handleSelectCategory(cat.value)} className="view-all" style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}>View All</button>
                        </div>
                        <div className="products-grid">
                          {items.map((product) => {
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

      <Footer onSubscribe={handleSubscribe} subscribed={subscribed} />

      <SubscriptionModal
        isOpen={showSubscriptionModal}
        email={subscribedEmail}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { category, search } = context.query as any
    const conn = await connectMongoose()
    
    // If connection failed, return with no initial products (client will fetch)
    if (!conn) {
      console.warn('MongoDB not connected in getServerSideProps, returning empty')
      return { 
        props: { initialProducts: [], categories: [] },
        revalidate: 60 // ISR: revalidate every 60 seconds
      }
    }

    const filter: any = {}
    if (category) filter.category = category
    if (search) filter.$text = { $search: search }

    const products = await ProductModel.find(filter)
      .sort({ createdAt: -1 })
      .limit(200)
      .lean()
      .timeout(10000) // 10 second timeout for the query

    if (!products || products.length === 0) {
      console.warn('No products found in database')
      return {
        props: { initialProducts: [], categories: [] },
        revalidate: 60
      }
    }

    const serialized = products.map((p: any) => ({
      id: p._id ? p._id.toString() : `product-${Math.random()}`,
      title: p.title || 'Untitled Product',
      price: (p.price ?? 0).toString(),
      image_url: (p.image_url || (p.images && p.images[0] && p.images[0].url) || '/assets/product-1.jpeg'),
      featured: !!p.featured,
      description: p.description || p.shortDescription || '',
      rating: p.rating || 5,
      artisan_name: (p.artisan && p.artisan.name) || 'Artisan',
      category: p.category || 'Uncategorized',
    }))

    // Build category counts for the category filter UI
    const catAgg = await ProductModel.aggregate([
      { $match: {} },
      { $group: { _id: { $ifNull: ['$category', 'Uncategorized'] }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])
    const categories = (catAgg || []).map((c: any) => ({ value: c._id, count: c.count }))

    return { 
      props: { initialProducts: serialized, categories },
      revalidate: 60 // ISR: revalidate every 60 seconds
    }
  } catch (err) {
    console.error('getServerSideProps error (shop):', err)
    return { 
      props: { initialProducts: [], categories: [] },
      revalidate: 60 // ISR: revalidate every 60 seconds even on error
    }
  }
}

