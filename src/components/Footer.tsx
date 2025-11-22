import React from 'react'
import Link from 'next/link'

interface FooterProps {
  onSubscribe: (e: React.FormEvent<HTMLFormElement>) => void
  subscribed: boolean
}

export default function Footer({ onSubscribe, subscribed }: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-col">
          <img 
            src="/assets/logo.svg" 
            alt="Handcrafted Haven logo" 
            className="logo small" 
          />
          <p className="muted">Supporting local artisans and sustainable craftsmanship since 2020.</p>
          <div className="social-icons">
            <a href="#" aria-label="Instagram" className="social-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="15" cy="5" r="1" fill="currentColor"/>
              </svg>
            </a>
            <a href="#" aria-label="Pinterest" className="social-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2C5.5 2 2 5.5 2 10c0 3.2 2 5.9 4.8 7-0.1-0.6-0.1-1.4 0.2-2.1l0.8-3.3c-0.5 0.3-0.8 1.2-0.8 2.1 0 1.5 0.9 2.8 2.2 2.8 1 0 1.9-0.8 1.9-2 0-1.5-1-2.5-2.4-2.5-1.9 0-3.1 1.4-3.1 2.8 0 1 0.4 1.9 1 2.3 0.1 0.1 0.2 0 0.2-0.1l0.2-0.8c0-0.2 0-0.3-0.1-0.4-0.3-0.4-0.4-0.9-0.4-1.5 0-2 1.5-3.8 4-3.8 2.1 0 3.7 1.3 3.7 3 0 2.1-1.3 3.8-3.2 3.8-0.6 0-1.2-0.3-1.4-0.7l-0.4 1.5c-0.1 0.5-0.4 1.1-0.6 1.5 0.5 0.1 1 0.2 1.5 0.2 5.5 0 10-4.5 10-10S15.5 2 10 2z" fill="currentColor"/>
              </svg>
            </a>
            <a href="#" aria-label="Twitter" className="social-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 4.5c-0.6 0.3-1.3 0.5-2 0.6 0.7-0.4 1.3-1.1 1.6-1.9-0.7 0.4-1.4 0.7-2.2 0.9C14.4 3.8 13.4 3 12.2 3c-1.9 0-3.4 1.5-3.4 3.4 0 0.3 0 0.5 0.1 0.8-2.8-0.1-5.3-1.5-7-3.6-0.3 0.5-0.5 1.1-0.5 1.7 0 1.2 0.6 2.2 1.5 2.8-0.5 0-1-0.2-1.4-0.4v0c0 1.6 1.2 3 2.7 3.3-0.3 0.1-0.6 0.1-0.9 0.1-0.2 0-0.4 0-0.6-0.1 0.4 1.3 1.6 2.2 3 2.2-1.1 0.9-2.5 1.4-4 1.4-0.3 0-0.5 0-0.8 0 1.5 1 3.3 1.5 5.2 1.5 6.2 0 9.6-5.1 9.6-9.6v-0.4c0.7-0.5 1.3-1.1 1.8-1.8z" fill="currentColor"/>
              </svg>
            </a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Shop</h4>
          <ul>
            <li><Link href="/shop">All Products</Link></li>
            <li><Link href="/shop?category=Pottery & Ceramics">Pottery & Ceramics</Link></li>
            <li><Link href="/shop?category=Jewelry">Jewelry</Link></li>
            <li><Link href="/shop?category=Textiles & Weaving">Textiles & Weaving</Link></li>
            <li><Link href="/shop?category=Woodwork">Woodwork</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Support</h4>
          <ul>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/contact">FAQs</Link></li>
            <li><Link href="/contact">Shipping & Returns</Link></li>
            <li><Link href="/contact">Privacy Policy</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Stay Connected</h4>
          <p className="muted">Subscribe to discover new artisans and exclusive offers.</p>
          <form className="newsletter" onSubmit={onSubscribe}>
            <input 
              type="email" 
              placeholder="Your email" 
              aria-label="Email address" 
              required
            />
            <button type="submit" className={subscribed ? 'subscribed' : ''}>
              {subscribed ? '✓ Subscribed' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>
      <div className="copyright">© 2025 Handcrafted Haven. All rights reserved.</div>
    </footer>
  )
}

