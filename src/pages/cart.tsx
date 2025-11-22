import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { cartAPI } from '../lib/api'

export default function Cart() {
  const { items, removeItem, getTotal, loading, refreshCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [updating, setUpdating] = useState<number | null>(null)

  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeItem(productId)
      return
    }
    setUpdating(productId)
    try {
      await cartAPI.updateItem(productId, newQuantity)
      await refreshCart()
    } catch (error) {
      console.error('Failed to update quantity:', error)
      alert('Failed to update quantity')
    } finally {
      setUpdating(null)
    }
  }

  if (!user) {
    return (
      <>
        <Header />
        <main style={{ padding: '80px 0', textAlign: 'center' }}>
          <p>Please login to view your cart</p>
          <Link href="/login" className="btn primary" style={{ marginTop: '20px' }}>
            Login
          </Link>
        </main>
        <Footer onSubscribe={() => {}} subscribed={false} />
      </>
    )
  }

  if (loading) {
    return (
      <>
        <Header />
        <main style={{ padding: '80px 0', textAlign: 'center' }}>
          <p>Loading cart...</p>
        </main>
        <Footer onSubscribe={() => {}} subscribed={false} />
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Cart - Handcrafted Haven</title>
      </Head>

      <Header />

      <main style={{ padding: '40px 0' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '42px', marginBottom: '32px' }}>Your Cart</h1>

          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ fontSize: '18px', marginBottom: '24px' }}>Your cart is empty</p>
              <Link href="/shop" className="btn primary">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
              <div>
                {items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      gap: '20px',
                      padding: '24px',
                      background: 'white',
                      borderRadius: '12px',
                      boxShadow: 'var(--shadow-sm)',
                      marginBottom: '20px',
                    }}
                  >
                    <img
                      src={item.image_url || '/assets/product-1.svg'}
                      alt={item.title}
                      style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ marginBottom: '8px' }}>{item.title}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <span style={{ color: 'var(--muted)' }}>Quantity:</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                            disabled={updating === item.product_id}
                            className="btn small outline"
                            style={{ padding: '6px 12px', minWidth: '36px' }}
                          >
                            -
                          </button>
                          <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: '600' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                            disabled={updating === item.product_id || item.quantity >= item.stock_quantity}
                            className="btn small outline"
                            style={{ padding: '6px 12px', minWidth: '36px' }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--accent)' }}>
                          ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </div>
                        <button
                          onClick={() => removeItem(item.product_id)}
                          className="btn small outline"
                          style={{ padding: '8px 16px' }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', height: 'fit-content' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '24px' }}>Order Summary</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span>Subtotal</span>
                  <span>${getTotal().toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: '700' }}>
                    <span>Total</span>
                    <span style={{ color: 'var(--accent)' }}>${getTotal().toFixed(2)}</span>
                  </div>
                </div>
                <Link href="/checkout" className="btn primary" style={{ width: '100%', textAlign: 'center' }}>
                  Proceed to Checkout
                </Link>
                <Link href="/shop" className="btn outline" style={{ width: '100%', textAlign: 'center', marginTop: '12px' }}>
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer onSubscribe={() => {}} subscribed={false} />
    </>
  )
}

