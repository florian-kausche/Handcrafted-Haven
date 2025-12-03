import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function OrderSuccess() {
  const [order, setOrder] = useState<any | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('hh_last_order')
      if (raw) {
        const parsed = JSON.parse(raw)
        setOrder(parsed)
        // Remove the last-order after reading so it doesn't persist indefinitely
        try { localStorage.removeItem('hh_last_order') } catch (e) {}
      }
    } catch (e) {
      // ignore
    }
  }, [])

  // If no local stored order, try fetching by id from the query (authenticated users or guests providing guestEmail)
  useEffect(() => {
    if (order) return
    try {
      const params = new URLSearchParams(window.location.search)
      const orderId = params.get('order')
      const guestEmail = params.get('guestEmail')
      if (!orderId) return

      ;(async () => {
        try {
          // Prefer guestToken param if provided, otherwise guestEmail
          const params = new URLSearchParams(window.location.search)
          const guestToken = params.get('guestToken')
          const guestEmailParam = params.get('guestEmail')
          const q = guestToken ? `?guestToken=${encodeURIComponent(guestToken)}` : (guestEmailParam ? `?guestEmail=${encodeURIComponent(guestEmailParam)}` : '')
          const res = await fetch(`/api/orders/${orderId}${q}`, { credentials: 'include' })
          if (!res.ok) return
          const payload = await res.json()
          if (payload && payload.order) setOrder(payload.order)
        } catch (e) {
          console.warn('Failed to fetch order by id', e)
        }
      })()
    } catch (e) {}
  }, [order])

  return (
    <>
      <Head>
        <title>Order Success - Handcrafted Haven</title>
      </Head>

      <Header />

      <main style={{ padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', marginBottom: '12px' }}>Thank you — your order is confirmed</h1>
          <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>We've received your order and will email you updates about shipping and delivery.</p>

          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', marginBottom: '24px' }}>
            <h3 style={{ marginTop: 0 }}>Order receipt</h3>
            {order ? (
              <div style={{ textAlign: 'left' }}>
                {/* Email send status banner */}
                {((order.emailSent === true) || (order.email_sent === true)) && (
                  <div style={{ background: '#e6ffef', color: '#0b6b2f', padding: '10px', borderRadius: 8, marginBottom: 12 }}>
                    Receipt sent to: <strong>{order.guest_email || 'your account email'}</strong>
                  </div>
                )}

                {((order.emailSent === false) || (order.email_sent === false)) && (
                  <div style={{ background: '#fff3f2', color: '#c24c3d', padding: '10px', borderRadius: 8, marginBottom: 12 }}>
                    We couldn't send the receipt by email. Please check your email address or contact support.
                  </div>
                )}

                {((order.emailSent === undefined) && (order.email_sent === undefined)) && (
                  <div style={{ background: '#f6f9ff', color: '#264e86', padding: '10px', borderRadius: 8, marginBottom: 12 }}>
                    A confirmation email will be sent to you shortly.
                  </div>
                )}

                
                
                <p><strong>Order ID:</strong> {order.orderId || order._id || order.id}</p>
                <p><strong>Status:</strong> {order.status || 'pending'}</p>
                {order.guest_email && <p><strong>Receipt sent to:</strong> {order.guest_email}</p>}
                <div style={{ marginTop: 12 }}>
                  <strong>Items</strong>
                  <ul>
                    {(order.items || []).map((it: any, i: number) => (
                      <li key={i}>{(it.title || it.productData?.title || it.product || it.product_id)} x {it.quantity} — ${(Number(it.price || 0) * Number(it.quantity || 1)).toFixed(2)}</li>
                    ))}
                  </ul>
                </div>
                <p style={{ marginTop: 8 }}><strong>Total:</strong> ${order.total_amount?.toFixed ? order.total_amount.toFixed(2) : order.total_amount}</p>
                <p style={{ color: 'var(--muted)', marginTop: 12 }}>A confirmation email was sent if you provided an address. Check your inbox or spam folder. You can view this order in your account if you're signed in.</p>
              </div>
            ) : (
              <div>
                <h3 style={{ marginTop: 0 }}>Next steps</h3>
                <ul style={{ textAlign: 'left' }}>
                  <li>You'll receive an email confirmation with order details.</li>
                  <li>If you selected bank or mobile payment, follow the instructions shown on the checkout confirmation page.</li>
                  <li>Track your order in your account page once it's shipped.</li>
                </ul>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link href="/shop" className="btn primary">Continue Shopping</Link>
            <Link href="/account" className="btn outline">View Account</Link>
          </div>
        </div>
      </main>

      <Footer onSubscribe={() => {}} subscribed={false} />
    </>
  )
}
