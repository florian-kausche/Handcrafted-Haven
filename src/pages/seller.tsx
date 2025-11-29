import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'
import { sellerAPI } from '../lib/api'

export default function Seller() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [stats, setStats] = useState({ productCount: 0, totalSales: 0, rating: 0 })
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image_url: '',
    category: '',
    stock_quantity: '',
    featured: false,
  })

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'artisan')) {
      router.push('/')
      return
    }
    if (user && user.role === 'artisan') {
      loadData()
    }
  }, [user, authLoading, router])

  const loadData = async () => {
    setLoading(true)
    try {
      const [productsData, statsData] = await Promise.all([
        sellerAPI.getProducts(),
        sellerAPI.getStats(),
      ])
      setProducts(productsData.products || [])
      setStats(statsData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await sellerAPI.createProduct({
        ...formData,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity) || 0,
      })
      setFormData({
        title: '',
        description: '',
        price: '',
        image_url: '',
        category: '',
        stock_quantity: '',
        featured: false,
      })
      setShowAddForm(false)
      loadData()
    } catch (error) {
      console.error('Failed to create product:', error)
      alert('Failed to create product')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      await sellerAPI.deleteProduct(id)
      loadData()
    } catch (error) {
      console.error('Failed to delete product:', error)
      alert('Failed to delete product')
    }
  }

  if (authLoading || !user || user.role !== 'artisan') {
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

  return (
    <>
      <Head>
        <title>Seller Dashboard - Handcrafted Haven</title>
      </Head>

      <Header />

      <main style={{ padding: '40px 0' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '42px', marginBottom: '32px' }}>Seller Dashboard</h1>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '40px' }}>
            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '8px' }}>Total Products</h3>
              <p style={{ fontSize: '32px', fontWeight: '700' }}>{stats.productCount}</p>
            </div>
            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '8px' }}>Total Sales</h3>
              <p style={{ fontSize: '32px', fontWeight: '700' }}>${stats.totalSales.toFixed(2)}</p>
            </div>
            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '8px' }}>Rating</h3>
              <p style={{ fontSize: '32px', fontWeight: '700' }}>{stats.rating.toFixed(1)}</p>
            </div>
          </div>

          <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px' }}>My Products</h2>
              <button className="btn primary" onClick={() => setShowAddForm(!showAddForm)}>
                {showAddForm ? 'Cancel' : 'Add Product'}
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleSubmit} style={{ background: 'var(--bg)', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
                <h3 style={{ marginBottom: '20px' }}>Add New Product</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '8px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '8px' }}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '8px' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '8px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Stock Quantity</label>
                    <input
                      type="number"
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                      style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '8px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Image URL</label>
                    <input
                      type="text"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="/assets/product-1.jpeg"
                      style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '8px' }}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    />
                    <span>Featured Product</span>
                  </label>
                </div>
                <button type="submit" className="btn primary">Create Product</button>
              </form>
            )}

            {loading ? (
              <p>Loading...</p>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <p style={{ marginBottom: '24px' }}>No products yet. Start by adding your first product!</p>
                <button className="btn primary" onClick={() => setShowAddForm(true)}>Add Your First Product</button>
              </div>
            ) : (
              <div className="products-grid">
                {products.map((product) => (
                  <div key={product.id} style={{ background: 'var(--bg)', padding: '16px', borderRadius: '8px', position: 'relative' }}>
                    <Link href={`/product/${product.id}`}>
                      <Image src={product.image_url || '/assets/product-1.jpeg'} alt={product.title} width={400} height={280} style={{ width: '100%', borderRadius: '8px', marginBottom: '12px', cursor: 'pointer' } as React.CSSProperties} />
                    </Link>
                    <h3>{product.title}</h3>
                    <p style={{ fontWeight: '700', color: 'var(--accent)', marginBottom: '8px' }}>${parseFloat(product.price).toFixed(2)}</p>
                    <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '12px' }}>Stock: {product.stock_quantity}</p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="btn small outline"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer onSubscribe={() => {}} subscribed={false} />
    </>
  )
}

