import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Login - Handcrafted Haven</title>
      </Head>

      <Header />

      <main style={{ minHeight: 'calc(100vh - 200px)', padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: '480px', margin: '0 auto' }}>
          <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', marginBottom: '8px' }}>Welcome Back</h1>
            <p style={{ color: 'var(--muted)', marginBottom: '32px' }}>Sign in to your account</p>

            {error && (
              <div style={{ background: '#fee', color: '#c24c3d', padding: '12px', borderRadius: '8px', marginBottom: '24px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

              <button
                type="submit"
                disabled={loading}
                className="btn primary"
                style={{ width: '100%', marginBottom: '20px' }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p style={{ textAlign: 'center', color: 'var(--muted)' }}>
              Don't have an account?{' '}
              <Link href="/register" style={{ color: 'var(--accent)', fontWeight: '600' }}>
                Sign up
              </Link>
            </p>

            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
              <Link href="/register?role=artisan" style={{ display: 'block', textAlign: 'center', color: 'var(--accent-dark)', fontWeight: '600' }}>
                Become a Seller →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer onSubscribe={() => {}} subscribed={false} />
    </>
  )
}

