import React, { useState } from 'react'
import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SubscriptionModal from '../components/SubscriptionModal'
import { useSubscription } from '../contexts/SubscriptionContext'

export default function Contact() {
  const { subscribed, subscribedEmail, showSubscriptionModal, setShowSubscriptionModal, handleSubscribe } = useSubscription()
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

          {/* FAQs Section */}
          <div style={{ marginTop: '80px', paddingTop: '40px', borderTop: '1px solid var(--border)' }} id="faqs">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', marginBottom: '24px' }}>Frequently Asked Questions</h2>
            
            <div style={{ display: 'grid', gap: '24px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>How long does shipping take?</h3>
                <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>Most orders are processed within 1–2 business days. Shipping typically takes 3–7 business days depending on your location. Expedited options are available at checkout.</p>
              </div>
              
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Can I return or exchange an item?</h3>
                <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>Yes! We offer 30-day returns on most items in unused condition. See our full Shipping & Returns policy below for details.</p>
              </div>
              
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Do you ship internationally?</h3>
                <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>Currently, we ship within the United States. International shipping coming soon! Contact us if you're interested in a specific location.</p>
              </div>
              
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Are the products vegan/sustainable?</h3>
                <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>Each artisan has unique practices. Check individual product pages for material and sustainability information, or contact us for specific questions.</p>
              </div>

              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>How do I become a seller?</h3>
                <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>Ready to share your craft? <a href="/register?role=artisan" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>Apply as an artisan</a> and we'll review your application within 3–5 business days.</p>
              </div>
            </div>
          </div>

          {/* Shipping & Returns Section */}
          <div style={{ marginTop: '80px', paddingTop: '40px', borderTop: '1px solid var(--border)' }} id="shipping">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', marginBottom: '24px' }}>Shipping & Returns</h2>
            
            <div style={{ display: 'grid', gap: '24px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Shipping Policy</h3>
                <ul style={{ color: 'var(--muted)', lineHeight: '1.7', paddingLeft: '20px', margin: '0' }}>
                  <li>Orders are processed within 1–2 business days (excluding weekends and holidays)</li>
                  <li>Standard shipping: 3–7 business days (free on orders over $75)</li>
                  <li>Expedited shipping: 1–2 business days (flat rate $15)</li>
                  <li>You'll receive tracking information via email once your order ships</li>
                  <li>We ship to all continental US addresses</li>
                </ul>
              </div>

              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Return & Exchange Policy</h3>
                <ul style={{ color: 'var(--muted)', lineHeight: '1.7', paddingLeft: '20px', margin: '0' }}>
                  <li>30-day return window from delivery date</li>
                  <li>Items must be unused and in original condition with packaging</li>
                  <li>Customer pays return shipping unless there's a defect</li>
                  <li>Refunds processed within 5–7 business days of receipt</li>
                  <li>Exchanges: Free shipping on replacement items</li>
                </ul>
              </div>

              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Damaged or Lost Orders</h3>
                <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>If your order arrives damaged or is lost in transit, please contact us within 7 days with photos and tracking information. We'll arrange a replacement or refund immediately.</p>
              </div>
            </div>
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

