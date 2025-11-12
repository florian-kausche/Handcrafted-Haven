import React, { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'

const SAMPLE_PRODUCTS = [
  { id: 1, title: 'Ceramic Vase', price: 48, image: '/assets/product-1.svg', featured: true, description: 'Hand-thrown ceramic vase with reactive glaze.' },
  { id: 2, title: 'Woven Basket', price: 36, image: '/assets/product-2.svg', featured: true, description: 'Handwoven storage basket using natural fibers.' },
  { id: 3, title: 'Leather Pouch', price: 60, image: '/assets/product-3.svg', featured: false, description: 'Vegetable-tanned leather pouch, stitched by hand.' },
  { id: 4, title: 'Wooden Bowl', price: 40, image: '/assets/product-4.svg', featured: false, description: 'Turned wooden bowl finished with food-safe oil.' },
  { id: 5, title: 'Macramé Wall Hanging', price: 72, image: '/assets/product-5.svg', featured: false, description: 'Hand-knotted macramé to add texture and warmth.' },
  { id: 6, title: 'Beaded Necklace', price: 55, image: '/assets/product-6.svg', featured: false, description: 'One-of-a-kind beadwork with brass accents.' }
]

export default function Home() {
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState([])
  const [selected, setSelected] = useState(null) // product shown in modal
  const [mobileOpen, setMobileOpen] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  // restore cart from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('hh_cart')
      if (raw) setCart(JSON.parse(raw))
    } catch (e) {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('hh_cart', JSON.stringify(cart))
    } catch (e) {}
  }, [cart])

  const products = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return SAMPLE_PRODUCTS
    return SAMPLE_PRODUCTS.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
  }, [query])

  const cartCount = cart.reduce((s, item) => s + item.qty, 0)

  function addToCart(product, qty = 1) {
    setCart(prev => {
      const found = prev.find(i => i.id === product.id)
      if (found) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i)
      return [...prev, { id: product.id, title: product.title, price: product.price, qty }]
    })
  }

  function removeFromCart(id) {
    setCart(prev => prev.filter(i => i.id !== id))
  }

  function clearCart() {
    setCart([])
  }

  function handleSubscribe(e) {
    e.preventDefault()
    const form = e.target
    const email = form.elements[0].value
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email')
      return
    }
    // For demo, persist a flag and show message
    localStorage.setItem('hh_newsletter', email)
    setSubscribed(true)
  }

  return (
    <>
      <Head>
        <title>Handcrafted Haven</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet" />
      </Head>

      <header className="site-header">
        <div className="container header-inner">
          <div className="brand">
            <img src="/assets/logo.svg" alt="Handcrafted Haven logo" className="logo" />
            <span className="brand-name">Handcrafted Haven</span>
          </div>

          <nav className={`main-nav ${mobileOpen ? 'open' : ''}`} aria-hidden={!mobileOpen}>
            <a href="#">Home</a>
            <a href="#">Shop</a>
            <a href="#">About</a>
            <a href="#">Community</a>
          </nav>

          <div className="header-actions">
            <div className="search">
              <input value={query} onChange={e => setQuery(e.target.value)} type="search" placeholder="Search handmade treasures..." aria-label="Search products" />
            </div>
            <div className="icons">
              <button className="icon-btn" title="Notifications">🔔</button>
              <button className="icon-btn" title="Cart" onClick={() => setSelected({ cartOpen: true })}>
                🛒{cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>
              <button className="icon-btn mobile-toggle" onClick={() => setMobileOpen(v => !v)} aria-label="Toggle menu">☰</button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-inner">
            <div className="hero-left">
              <div className="kicker">Handmade with Love</div>
              <h1>Discover Unique Handcrafted Treasures</h1>
              <p className="lead">Support local artisans and bring authentic, sustainable craftsmanship into your home. Every purchase tells a story and supports a creator’s passion.</p>
              <div className="hero-cta">
                <button className="btn primary" onClick={() => { const p = SAMPLE_PRODUCTS[0]; setSelected(p) }}>Shop Now</button>
                <a className="btn outline" href="#">Become a Seller</a>
              </div>
            </div>
            <div className="hero-right">
              <div className="hero-card">
                <img src="/assets/hero-toolbox.svg" alt="toolbox" />
              </div>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="container features-inner">
            <div className="feature">
              <div className="feature-icon">🧑‍🎨</div>
              <h4>Support Artisans</h4>
              <p>Every purchase directly supports independent makers and their craft.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🛡️</div>
              <h4>Quality Guaranteed</h4>
              <p>Each item is carefully curated and crafted with attention to detail.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🌱</div>
              <h4>Sustainable Choice</h4>
              <p>Eco-friendly materials and practices for a better tomorrow.</p>
            </div>
          </div>
        </section>

        <section className="featured-creations">
          <div className="container">
            <div className="section-head">
              <h2>Featured Creations</h2>
              <p className="muted">Handpicked treasures from our talented community</p>
              <a className="view-all" href="#">View All</a>
            </div>

            <div className="products-grid">
              {products.map(p => (
                <article className="product-card" key={p.id}>
                  {p.featured && <div className="ribbon">Featured</div>}
                  <img src={p.image} alt={p.title} loading="lazy" onClick={() => setSelected(p)} style={{cursor:'pointer'}} />
                  <div className="product-body">
                    <h3>{p.title}</h3>
                    <p className="by">by Artist Name</p>
                    <div className="meta">
                      <div className="price">${p.price}.00</div>
                      <button className="btn small" onClick={() => addToCart(p)}>Add</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="artisans">
          <div className="container">
            <div className="section-head center">
              <h2>Meet Our Artisans</h2>
              <p className="muted">Get to know the talented makers behind the crafts. Each artisan brings their unique story, skill, and passion to every creation.</p>
            </div>

            <div className="artist-grid">
              <div className="artist-card">
                <img className="avatar" src="/assets/avatar-1.svg" alt="Sarah Martinez" />
                <h4>Sarah Martinez</h4>
                <p className="role">Pottery & Ceramics • Portland, OR</p>
                <p className="bio">Creating functional art with clay for over 16 years. Each piece is hand-thrown and uniquely glazed.</p>
              </div>

              <div className="artist-card">
                <img className="avatar" src="/assets/avatar-2.svg" alt="Maria Chen" />
                <h4>Maria Chen</h4>
                <p className="role">Textile Weaving • Santa Fe, NM</p>
                <p className="bio">Traditional weaving techniques passed down through generations, creating modern heirloom pieces.</p>
              </div>

              <div className="artist-card">
                <img className="avatar" src="/assets/avatar-3.svg" alt="James Walker" />
                <h4>James Walker</h4>
                <p className="role">Woodworking • Asheville, NC</p>
                <p className="bio">Sustainable woodworking using locally sourced materials to create timeless kitchen essentials.</p>
              </div>
            </div>

            <div className="center"><a className="btn outline" href="#">Discover More Stories</a></div>
          </div>
        </section>

        <section className="cta-band">
          <div className="container cta-inner">
            <h2>Are You an Artisan?</h2>
            <p className="lead muted">Join our community of talented makers. Share your craft with the world and connect with customers who value handmade quality.</p>
            <a className="btn primary dark" href="#">Start Selling Today</a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-col">
            <img src="/assets/logo.svg" alt="logo" className="logo small" />
            <p className="muted">Supporting local artisans and sustainable craftsmanship since 2020.</p>
          </div>
          <div className="footer-col">
            <h4>Shop</h4>
            <ul>
              <li>All Products</li>
              <li>Pottery & Ceramics</li>
              <li>Jewelry</li>
              <li>Textiles & Weaving</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li>About Us</li>
              <li>Contact</li>
              <li>Shipping & Returns</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Stay Connected</h4>
            <p className="muted">Subscribe to discover new artisans and exclusive offers.</p>
            <form className="newsletter" onSubmit={handleSubscribe}>
              <input placeholder="Your email" aria-label="email" />
              <button type="submit">{subscribed ? 'Subscribed' : 'Subscribe'}</button>
            </form>
          </div>
        </div>
        <div className="copyright">© 2025 Handcrafted Haven. All rights reserved.</div>
      </footer>

      {/* Product / cart modal */}
      {selected && selected.cartOpen && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal-inner container">
            <h3>Your Cart</h3>
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <ul>
                {cart.map(i => (
                  <li key={i.id} style={{display:'flex',justifyContent:'space-between',gap:12}}>
                    <span>{i.title} x {i.qty}</span>
                    <div style={{display:'flex',gap:8}}>
                      <strong>${i.price * i.qty}.00</strong>
                      <button className="btn small" onClick={() => removeFromCart(i.id)}>Remove</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div style={{marginTop:18,display:'flex',gap:12}}>
              <button className="btn outline" onClick={() => setSelected(null)}>Close</button>
              <button className="btn primary" onClick={() => { alert('Checkout demo — cart cleared'); clearCart(); setSelected(null) }}>Checkout</button>
            </div>
          </div>
        </div>
      )}

      {selected && selected.id && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal-inner container">
            <div style={{display:'flex',gap:20,alignItems:'flex-start'}}>
              <img src={selected.image} alt={selected.title} style={{width:260,height:180,objectFit:'cover',borderRadius:8}} />
              <div>
                <h3>{selected.title}</h3>
                <p className="muted">${selected.price}.00</p>
                <p>{selected.description}</p>
                <div style={{display:'flex',gap:8,marginTop:12}}>
                  <button className="btn primary" onClick={() => { addToCart(selected); setSelected(null) }}>Add to cart</button>
                  <button className="btn outline" onClick={() => setSelected(null)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        /* Lightweight modal styles */
        .modal{position:fixed;inset:0;background:rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;z-index:80}
        .modal-inner{background:white;padding:20px;border-radius:12px;max-width:880px;width:100%;}
        .cart-badge{background:#c24c3d;color:white;border-radius:999px;padding:2px 8px;font-size:12px;margin-left:6px}
        .mobile-toggle{display:none}
        @media(max-width:900px){.main-nav{display:none}.mobile-toggle{display:inline-block}}
      `}</style>
    </>
  )
}
