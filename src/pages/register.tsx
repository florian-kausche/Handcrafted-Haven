import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SubscriptionModal from '../components/SubscriptionModal'
import { useSubscription } from '../contexts/SubscriptionContext'

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'customer',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { subscribed, subscribedEmail, showSubscriptionModal, setShowSubscriptionModal, handleSubscribe } = useSubscription()
  const { register } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (router.query.role === 'artisan') {
      setFormData((prev) => ({ ...prev, role: 'artisan' }))
    }
  }, [router.query])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register(formData)
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Register - Handcrafted Haven</title>
      </Head>

      <Header />

      <main style={{ minHeight: 'calc(100vh - 200px)', padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: '480px', margin: '0 auto' }}>
          <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', marginBottom: '8px' }}>
              {formData.role === 'artisan' ? 'Become a Seller' : 'Create Account'}
            </h1>
            <p style={{ color: 'var(--muted)', marginBottom: '32px' }}>
              {formData.role === 'artisan' ? 'Join our community of talented makers' : 'Sign up to start shopping'}
            </p>

            {error && (
              <div style={{ background: '#fee', color: '#c24c3d', padding: '12px', borderRadius: '8px', marginBottom: '24px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      fontSize: '15px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      fontSize: '15px',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '15px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '15px',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn primary"
                style={{ width: '100%', marginBottom: '20px' }}
              >
                {loading ? 'Creating account...' : formData.role === 'artisan' ? 'Start Selling' : 'Sign Up'}
              </button>
            </form>

            <p style={{ textAlign: 'center', color: 'var(--muted)' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: 'var(--accent)', fontWeight: '600' }}>
                Sign in
              </Link>
            </p>
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

