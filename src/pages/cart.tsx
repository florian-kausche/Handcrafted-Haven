import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { cartAPI } from '../lib/api'

/*
  Cart page

  Renders the authenticated user's cart (this page requires auth). The UI
  relies on `useCart()` which exposes normalized items and helper methods.

  Note: Guest users are shown a small message prompting them to login — guest
  cart UI is maintained in localStorage and shown in other UX flows.
*/
export default function Cart() {
  const { items, removeItem, getTotal, loading, refreshCart, showToast } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [updating, setUpdating] = useState<string | number | null>(null)
  const [lastOrder, setLastOrder] = useState<any | null>(null)
  const [resendLoading, setResendLoading] = useState(false)

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem('hh_last_order') : null
      if (raw) {
        const parsed = JSON.parse(raw)
        setLastOrder(parsed);

        // If stored order items are only product IDs (no titles), try to
        // fetch the populated order from the server to show readable
        // product titles on the receipt. Use guestToken if available.
        (async () => {
          try {
            const id = parsed.orderId || parsed._id
            if (!id) return

            const hasTitles = (parsed.items || []).some((it: any) => it.title || it.productData?.title || (it.product && it.product.title))
            if (hasTitles) return

              // Accept different token/email key names that may be stored by older flows
              const token = parsed.guestToken || parsed.guest_token || parsed.guest_token_value
              const email = parsed.guestEmail || parsed.guest_email || parsed.email
              const qs = token ? `?guestToken=${encodeURIComponent(token)}` : (email ? `?guestEmail=${encodeURIComponent(email)}` : '')
            const resp = await fetch(`/api/orders/${id}${qs}`, { credentials: 'include' })
            if (!resp.ok) return
            const body = await resp.json()
            // Expect the API to return the order in `order` or the raw populated object
            const populated = body.order || body
            if (populated) {
              setLastOrder(populated)
              // also update localStorage so subsequent loads are populated
              try {
                window.localStorage.setItem('hh_last_order', JSON.stringify(populated))
              } catch (e) {
                // ignore storage errors
              }
            }
          } catch (e) {
            // ignore fetch errors; receipt will fallback to IDs
            console.warn('Could not fetch populated order for receipt', e)
          }
        })()
      }
    } catch (e) {
      console.error('Failed to read last order from localStorage', e)
    }
  }, [])

  const handleQuantityChange = async (productId: string | number, newQuantity: number) => {
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
      showToast?.('Failed to update quantity')
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
            // If cart empty but we have a last order in localStorage, show receipt
            lastOrder ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <h2 style={{ marginBottom: 8 }}>Thank you — your order is placed</h2>
                <p style={{ marginBottom: 16 }}>Order ID: <strong>{lastOrder.orderId || lastOrder._id}</strong></p>
                <div style={{ background: 'white', padding: 20, borderRadius: 8, display: 'inline-block', textAlign: 'left', minWidth: 360 }}>
                  <h4>Receipt</h4>
                  <div style={{ marginBottom: 8 }}>
                    {(lastOrder.items || []).map((it: any, idx: number) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>{it.title || it.productData?.title || (it.product && it.product.title) || String(it.product || '')} x {it.quantity}</div>
                        <div>${((it.price || 0) * (it.quantity || 1)).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                    <strong>Total</strong>
                    <strong>${(lastOrder.total_amount || lastOrder.total || 0).toFixed ? (lastOrder.total_amount || lastOrder.total).toFixed(2) : lastOrder.total_amount}</strong>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="btn primary"
                      onClick={() => {
                        // generate simple text invoice and download
                        const invoice = [`Order ${lastOrder.orderId || lastOrder._id}`, `Total: $${(lastOrder.total_amount || lastOrder.total || 0).toFixed(2)}`, '', 'Items:', ...((lastOrder.items || []).map((it: any) => `- ${it.title || it.productData?.title || String(it.product || '')} x ${it.quantity} — $${((it.price || 0) * (it.quantity || 1)).toFixed(2)}`))].join('\n')
                        const blob = new Blob([invoice], { type: 'text/plain' })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = `invoice-${lastOrder.orderId || lastOrder._id}.txt`
                        document.body.appendChild(a)
                        a.click()
                        a.remove()
                        URL.revokeObjectURL(url)
                      }}
                    >
                      Download Receipt
                    </button>
                    <button
                      className="btn outline"
                      onClick={async () => {
                        setResendLoading(true)
                        try {
                          const id = lastOrder.orderId || lastOrder._id
                          const body: any = {}
                          // If guest, include guestEmail or guestToken if present
                          if (lastOrder.guestToken) body.guestToken = lastOrder.guestToken
                            // include guest token or email in whichever key the stored order uses
                            if (lastOrder.guestToken) body.guestToken = lastOrder.guestToken
                            if (lastOrder.guest_token) body.guestToken = lastOrder.guest_token
                            if (lastOrder.guest_email) body.guestEmail = lastOrder.guest_email
                            if (lastOrder.guestEmail) body.guestEmail = lastOrder.guestEmail
                          const resp = await fetch(`/api/orders/${id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
                          const data = await resp.json()
                          if (resp.ok && data.ok) {
                            showToast?.('Receipt resent to your email')
                          } else {
                            showToast?.('Failed to resend receipt')
                          }
                        } catch (e) {
                          console.error('Resend error', e)
                          showToast?.('Failed to resend receipt')
                        } finally {
                          setResendLoading(false)
                        }
                      }}
                      disabled={resendLoading}
                    >
                      {resendLoading ? 'Sending...' : 'Send to my email'}
                    </button>
                    <Link href="/shop" className="btn outline">Continue Shopping</Link>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <p style={{ fontSize: '18px', marginBottom: '24px' }}>Your cart is empty</p>
                <Link href="/shop" className="btn primary">
                  Continue Shopping
                </Link>
              </div>
            )
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
                    <Image
                      src={item.image_url || '/assets/product-1.jpeg'}
                      alt={item.title}
                      width={120}
                      height={120}
                      style={{ objectFit: 'cover', borderRadius: '8px' } as React.CSSProperties}
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
                            disabled={updating === item.product_id || item.quantity >= (item.stock_quantity ?? Infinity)}
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

