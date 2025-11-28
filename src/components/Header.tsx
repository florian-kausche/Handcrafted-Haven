import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState('')
  const router = useRouter()
  const { user, logout } = useAuth()
  const { getItemCount } = useCart()
  const cartCount = getItemCount()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query)}`)
    }
  }

  const handleCartClick = () => {
    router.push('/cart')
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="brand">
          <img 
            src="https://images.unsplash.com/photo-1517841964259-22a8a8174548?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Handcrafted Haven logo" 
            className="logo" 
          />
          <span className="brand-name">Handcrafted Haven</span>
        </div>

        <nav className={`main-nav ${mobileOpen ? 'open' : ''}`} aria-hidden={!mobileOpen}>
          <Link href="/">Home</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <div className="header-actions">
          <form className="search" onSubmit={handleSearch}>
            <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="m19 19-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
              type="search" 
              placeholder="Search handmade treasures..." 
              aria-label="Search products" 
            />
          </form>
          <div className="icons">
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Link href={user.role === 'artisan' ? '/seller' : '/account'} className="icon-btn" title="Account" aria-label="Account">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 17c0-2.5 2.5-5 5-5s5 2.5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <button onClick={logout} className="btn small outline" style={{ padding: '8px 16px' }}>
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="btn small outline" style={{ padding: '8px 16px' }}>
                Login
              </Link>
            )}
            <button className="icon-btn cart-btn" title="Cart" onClick={handleCartClick} aria-label="Shopping cart">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 7.5h10l-1 6H6l-1-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.5 10v-2.5a2.5 2.5 0 0 1 5 0V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
            <button 
              className="icon-btn mobile-toggle" 
              onClick={() => setMobileOpen(v => !v)} 
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {mobileOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

