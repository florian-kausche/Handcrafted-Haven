import React, { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { ordersAPI } from '../lib/api'

export default function Checkout() {
  const { items, getTotal, showToast, refreshCart } = useCart()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    shippingAddress: '',
    billingAddress: '',
    paymentMethod: 'credit',
    guestEmail: '',
  })
  const [cardInfo, setCardInfo] = useState({ cardNumber: '', expiry: '', cvc: '' })
  const [mobileNumber, setMobileNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const emailRef = useRef<HTMLInputElement | null>(null)

  const isValidEmail = (email: string) => {
    return !!email && /^[\w-.]+@[\w-]+\.[A-Za-z]{2,}$/.test(email)
  }

  useEffect(() => {
    if (!authLoading && items.length === 0) {
      router.push('/cart')
    }
  }, [authLoading, items.length, router])

  if (authLoading || items.length === 0) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Guest email validation: focus email and scroll to top when missing/invalid
    if (!user) {
      if (!isValidEmail(formData.guestEmail)) {
        setError('Please enter a valid email address for order updates.')
        // focus the email input and scroll to top so user sees the error
        setLoading(false)
        emailRef.current?.focus()
        try { window.scrollTo({ top: 0, behavior: 'smooth' }) } catch (err) {}
        return
      }
    }
    try {
      // Build payload including cart items so server (or future guest flow) has the details
      const payload: any = { ...formData }
      payload.items = items.map((it: any) => ({
        id: it.product_id || it.product?.id || it.id,
        title: it.title || it.product?.title,
        price: it.price || (it.product && it.product.price) || 0,
        quantity: it.quantity,
      }))
      // Include payment-specific fields
      if (formData.paymentMethod === 'credit') payload.card = cardInfo
      if (formData.paymentMethod === 'mobile') payload.mobileNumber = mobileNumber

      const res = await ordersAPI.create(payload)
      const guestParam = (!user && formData.guestEmail) ? `&guestEmail=${encodeURIComponent(formData.guestEmail)}` : ''
      // If server returned a guestToken, prefer that (more secure)
      const returnedToken = res?.guestToken || res?.order?.guest_token || res?.order?.guestToken
      const guestParamFinal = returnedToken ? `&guestToken=${encodeURIComponent(returnedToken)}` : guestParam

      // Handle mock payment responses
      if (res.redirectUrl) {
        // PayPal flow - redirect user
        // Clear guest cart locally and refresh client cart state so UI is empty before redirect
        if (!user) {
          try { localStorage.removeItem('hh_guest_cart') } catch (e) {}
        }
        try { await refreshCart() } catch (e) {}
        try { localStorage.setItem('hh_last_order', JSON.stringify({ ...(res.order || { orderId: res.orderId, status: res.status }), guestToken: returnedToken || res?.guestToken || res?.order?.guest_token || res?.order?.guestToken, emailSent: !!res.emailSent })) } catch (e) {}
        // Append guest token/email to PayPal redirect if returned by server
        const redirectUrl = new URL(res.redirectUrl)
        if (!user) {
          if (res.guestToken) redirectUrl.searchParams.set('guestToken', res.guestToken)
          else if (formData.guestEmail) redirectUrl.searchParams.set('guestEmail', formData.guestEmail)
        }
        window.location.href = redirectUrl.toString()
        return
      }

      if (res.bankDetails) {
        // Show bank instructions then go to unified success/pending page
        showToast?.(`Bank transfer instructions:\nAccount: ${res.bankDetails.accountNumber}\nSort code: ${res.bankDetails.sortCode}\nReference: ${res.bankDetails.reference}`)
        // Clear client cart (guest localStorage or refresh server cart) then navigate
        if (!user) {
          try { localStorage.removeItem('hh_guest_cart') } catch (e) {}
        }
        try { await refreshCart() } catch (e) {}
        try { localStorage.setItem('hh_last_order', JSON.stringify({ ...(res.order || { orderId: res.orderId, status: res.status }), guestToken: returnedToken || res?.guestToken || res?.order?.guest_token || res?.order?.guestToken, emailSent: !!res.emailSent })) } catch (e) {}
        router.push(`/order/success?order=${res.orderId || ''}&status=pending&method=bank${guestParam}`)
        return
      }

      if (res.mobileInstructions) {
        showToast?.(`Mobile payment:\n${res.mobileInstructions}`)
        if (!user) {
          try { localStorage.removeItem('hh_guest_cart') } catch (e) {}
        }
        try { await refreshCart() } catch (e) {}
        try { localStorage.setItem('hh_last_order', JSON.stringify({ ...(res.order || { orderId: res.orderId, status: res.status }), guestToken: returnedToken || res?.guestToken || res?.order?.guest_token || res?.order?.guestToken, emailSent: !!res.emailSent })) } catch (e) {}
        router.push(`/order/success?order=${res.orderId || ''}&status=pending&method=mobile${guestParam}`)
        return
      }

      if (res.codInstructions) {
        showToast?.(`Payment on Delivery:\n${res.codInstructions}`)
        if (!user) {
          try { localStorage.removeItem('hh_guest_cart') } catch (e) {}
        }
        try { await refreshCart() } catch (e) {}
        try { localStorage.setItem('hh_last_order', JSON.stringify({ ...(res.order || { orderId: res.orderId, status: res.status }), emailSent: !!res.emailSent })) } catch (e) {}
        router.push(`/order/success?order=${res.orderId || ''}&status=pending&method=cod${guestParam}`)
        return
      }

      if (res.orderId) {
        // Clear cart on client side (guest localStorage or refresh server cart)
        if (!user) {
          try { localStorage.removeItem('hh_guest_cart') } catch (e) {}
        }
        try { await refreshCart() } catch (e) {}
        try { localStorage.setItem('hh_last_order', JSON.stringify({ ...(res.order || { orderId: res.orderId, status: res.status }), guestToken: returnedToken || res?.guestToken || res?.order?.guest_token || res?.order?.guestToken })) } catch (e) {}
        router.push(`/order/success?order=${res.orderId}${guestParam}`)
        return
      }
    } catch (err: any) {
      setError(err.message || 'Checkout failed')
      try { window.scrollTo({ top: 0, behavior: 'smooth' }) } catch (e) {}
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Checkout - Handcrafted Haven</title>
      </Head>

      <Header />

      <main style={{ padding: '40px 0' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '42px', marginBottom: '32px' }}>Checkout</h1>

          {error && (
            <div style={{ background: '#fee', color: '#c24c3d', padding: '12px', borderRadius: '8px', marginBottom: '24px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '24px' }}>Shipping Information</h2>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Shipping Address</label>
                  <textarea
                    value={formData.shippingAddress}
                    onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                    required
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      fontSize: '15px',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Billing Address</label>
                  <textarea
                    value={formData.billingAddress}
                    onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                    required
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      fontSize: '15px',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Payment Method</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      fontSize: '15px',
                    }}
                  >
                    <option value="credit">Credit Card</option>
                    <option value="mobile">Mobile Money</option>
                    <option value="cod">Payment on Delivery</option>
                    <option value="paypal">PayPal</option>
                    <option value="bank">Bank Transfer</option>
                  </select>
                </div>

                {!user && (
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Email</label>
                    <input
                      placeholder="you@example.com"
                          ref={emailRef}
                          value={formData.guestEmail}
                          onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                          required
                          style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px' }}
                    />
                    <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '8px' }}>We'll send order updates to this email.</p>
                  </div>
                )}

                {/* Conditional payment UIs */}
                {formData.paymentMethod === 'credit' && (
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Card Details</label>
                    <input
                      placeholder="Card number"
                      value={cardInfo.cardNumber}
                      onChange={(e) => setCardInfo({ ...cardInfo, cardNumber: e.target.value })}
                      required
                      style={{ width: '100%', padding: '12px', marginBottom: '8px', border: '1px solid var(--border)', borderRadius: '8px' }}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        placeholder="MM/YY"
                        value={cardInfo.expiry}
                        onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                        required
                        style={{ flex: 1, padding: '12px', border: '1px solid var(--border)', borderRadius: '8px' }}
                      />
                      <input
                        placeholder="CVC"
                        value={cardInfo.cvc}
                        onChange={(e) => setCardInfo({ ...cardInfo, cvc: e.target.value })}
                        required
                        style={{ width: '120px', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px' }}
                      />
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '8px' }}>We use a secure payment processor. Card handling here is mocked for demo purposes.</div>
                  </div>
                )}

                {formData.paymentMethod === 'mobile' && (
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Mobile Number</label>
                    <input
                      placeholder="e.g. +233501234567"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      required
                      style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px' }}
                    />
                    <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '8px' }}>You will receive a mobile money prompt to confirm the payment.</p>
                  </div>
                )}

                {formData.paymentMethod === 'paypal' && (
                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ color: 'var(--muted)' }}>You'll be redirected to PayPal to complete the payment.</p>
                  </div>
                )}

                {formData.paymentMethod === 'cod' && (
                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ color: 'var(--muted)' }}>Pay the courier when your order arrives. Please have the exact amount available.</p>
                  </div>
                )}

                {formData.paymentMethod === 'bank' && (
                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ color: 'var(--muted)' }}>After placing your order we'll show bank transfer instructions to complete the payment.</p>
                  </div>
                )}
              </div>

              <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', height: 'fit-content' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '24px' }}>Order Summary</h2>
                {items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span>{item.title} x {item.quantity}</span>
                    <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: '700' }}>
                    <span>Total</span>
                    <span style={{ color: 'var(--accent)' }}>${getTotal().toFixed(2)}</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn primary"
                  style={{ width: '100%', marginTop: '24px' }}
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer onSubscribe={() => {}} subscribed={false} />
    </>
  )
}

