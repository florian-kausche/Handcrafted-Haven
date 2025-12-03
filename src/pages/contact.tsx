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
        <div className="container" style={{ maxWidth: '1100px' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', marginBottom: '12px' }}>Get in Touch</h1>
            <p style={{ fontSize: '18px', lineHeight: '1.8', color: 'var(--muted)', margin: '0 auto', maxWidth: '760px' }}>
              We're here to help — whether you have a question about an order, want to collaborate as an artisan, or just want to say hello. Reach out and we'll respond within 1–2 business days.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '48px', alignItems: 'start' }}>
            <div>
              <div style={{ background: 'white', padding: '28px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '12px' }}>Contact Information</h2>
                <p style={{ color: 'var(--muted)', marginBottom: '20px' }}>Prefer email? Send us a message and we'll reply as soon as possible. For urgent matters, call the number below during business hours.</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '12px 18px', alignItems: 'start', marginBottom: '14px' }}>
                  <strong style={{ gridRow: '1 / span 1' }}>Email</strong>
                  <div style={{ color: 'var(--muted)' }}>support@handcraftedhaven.com</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '12px 18px', alignItems: 'start', marginBottom: '14px' }}>
                  <strong>Phone</strong>
                  <div style={{ color: 'var(--muted)' }}>1-800-HANDMADE (Mon–Fri, 9am–5pm)</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '12px 18px', alignItems: 'start' }}>
                  <strong>Address</strong>
                  <div style={{ color: 'var(--muted)' }}>
                    43 Sowatey Close<br />
                    East Adenta
                  </div>
                </div>

                <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid var(--border)' }} />

                <div style={{ color: 'var(--muted)', fontSize: '14px' }}>
                  <strong style={{ color: 'inherit' }}>Business Hours</strong>
                  <div>Mon–Fri: 9:00 AM – 5:00 PM</div>
                  <div>Sat: 10:00 AM – 2:00 PM</div>
                </div>
              </div>
            </div>

            <div>
              <form onSubmit={handleSubmit} style={{ background: 'white', padding: '28px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }} aria-label="Contact form">
                {submitted && (
                  <div style={{ background: '#d4edda', color: '#155724', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                    Thank you — your message has been sent. We'll get back to you shortly.
                  </div>
                )}

                <div style={{ marginBottom: '14px' }}>
                  <label htmlFor="contact-name" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Name</label>
                  <input
                    id="contact-name"
                    placeholder="Your full name"
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

                <div style={{ marginBottom: '14px' }}>
                  <label htmlFor="contact-email" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Email</label>
                  <input
                    id="contact-email"
                    placeholder="you@example.com"
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

                <div style={{ marginBottom: '18px' }}>
                  <label htmlFor="contact-message" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Message</label>
                  <textarea
                    id="contact-message"
                    placeholder="How can we help you today?"
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

