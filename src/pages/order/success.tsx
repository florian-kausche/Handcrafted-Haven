import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function OrderSuccess() {
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
            <h3 style={{ marginTop: 0 }}>Next steps</h3>
            <ul style={{ textAlign: 'left' }}>
              <li>You'll receive an email confirmation with order details.</li>
              <li>If you selected bank or mobile payment, follow the instructions shown on the checkout confirmation page.</li>
              <li>Track your order in your account page once it's shipped.</li>
            </ul>
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
