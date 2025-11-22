import React, { useState } from 'react'
import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send to an API
    console.log('Contact form submitted:', formData)
    setSubmitted(true)
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <>
      <Head>
        <title>Contact Us - Handcrafted Haven</title>
      </Head>

      <Header />

      <main style={{ padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', marginBottom: '24px', textAlign: 'center' }}>
            Get in Touch
          </h1>
          <p style={{ fontSize: '18px', lineHeight: '1.8', color: 'var(--muted)', marginBottom: '60px', textAlign: 'center' }}>
            Have a question? We'd love to hear from you.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', marginBottom: '24px' }}>Contact Information</h2>
              <div style={{ marginBottom: '24px' }}>
                <strong>Email</strong>
                <p style={{ color: 'var(--muted)', marginTop: '8px' }}>support@handcraftedhaven.com</p>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <strong>Phone</strong>
                <p style={{ color: 'var(--muted)', marginTop: '8px' }}>1-800-HANDMADE</p>
              </div>
              <div>
                <strong>Address</strong>
                <p style={{ color: 'var(--muted)', marginTop: '8px' }}>
                  123 Artisan Street<br />
                  Craft City, CC 12345
                </p>
              </div>
            </div>

            <div>
              <form onSubmit={handleSubmit} style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                {submitted && (
                  <div style={{ background: '#d4edda', color: '#155724', padding: '12px', borderRadius: '8px', marginBottom: '24px' }}>
                    Thank you! We'll get back to you soon.
                  </div>
                )}

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      fontSize: '15px',
                    }}
                  />
                </div>

                <button type="submit" className="btn primary" style={{ width: '100%' }}>
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer onSubscribe={() => {}} subscribed={false} />
    </>
  )
}

