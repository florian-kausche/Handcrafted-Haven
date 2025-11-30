import React from 'react'
import Image from 'next/image'
import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function About() {
  return (
    <>
      <Head>
        <title>About Us - Handcrafted Haven</title>
      </Head>

      <Header />

      <main style={{ padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', marginBottom: '24px', textAlign: 'center' }}>
            About Handcrafted Haven
          </h1>
          <p style={{ fontSize: '18px', lineHeight: '1.8', color: 'var(--muted)', marginBottom: '40px', textAlign: 'center' }}>
            Supporting local artisans and sustainable craftsmanship since 2020
          </p>

          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <Image
              src="/assets/avatar-2.png"
              alt="Handcrafted tools"
              width={720}
              height={480}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>

          <div style={{ marginBottom: '60px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', marginBottom: '20px' }}>Our Mission</h2>
            <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '20px' }}>
              At Handcrafted Haven, we believe in the power of handmade. Every item tells a story, and every purchase
              directly supports independent makers and their craft. We're committed to bringing authentic, sustainable
              craftsmanship into your home while helping artisans share their passion with the world.
            </p>
          </div>

          <div style={{ marginBottom: '60px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', marginBottom: '20px' }}>What We Stand For</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
              <div>
                <h3 style={{ marginBottom: '12px' }}>Support Artisans</h3>
                <p style={{ color: 'var(--muted)', lineHeight: '1.7' }}>
                  Every purchase directly supports independent makers and their craft.
                </p>
              </div>
              <div>
                <h3 style={{ marginBottom: '12px' }}>Quality Guaranteed</h3>
                <p style={{ color: 'var(--muted)', lineHeight: '1.7' }}>
                  Each item is carefully curated and crafted with attention to detail.
                </p>
              </div>
              <div>
                <h3 style={{ marginBottom: '12px' }}>Sustainable Choice</h3>
                <p style={{ color: 'var(--muted)', lineHeight: '1.7' }}>
                  Eco-friendly materials and practices for a better tomorrow.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', marginBottom: '20px' }}>Join Our Community</h2>
            <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '24px' }}>
              Whether you're looking for unique handmade treasures or you're an artisan ready to share your craft,
              we welcome you to our community. Together, we're keeping the art of handmade alive.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="/register?role=artisan" className="btn primary">
                Become a Seller
              </a>
              <a href="/shop" className="btn outline">
                Browse Products
              </a>
            </div>
          </div>

          <div style={{ marginTop: '40px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', marginBottom: '12px', textAlign: 'center' }}>Our Makers & Creations</h2>
            <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: '20px' }}>
              A few faces and pieces from our community.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
              <Image src="/assets/avatar-1.jpeg" alt="Maker 1" width={64} height={64} />
              <Image src="/assets/avatar-2.jpeg" alt="Maker 2" width={64} height={64} />
              <Image src="/assets/avatar-3.svg" alt="Maker 3" width={64} height={64} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
              <Image src="/assets/product-1.jpeg" alt="Product 1" width={240} height={160} />
              <Image src="/assets/product-2.jpeg" alt="Product 2" width={240} height={160} />
              <Image src="/assets/product-3.jpeg" alt="Product 3" width={240} height={160} />
              <Image src="/assets/product-4.png" alt="Product 4" width={240} height={160} />
              <Image src="/assets/product-5.png" alt="Product 5" width={240} height={160} />
              <Image src="/assets/product-6.png" alt="Product 6" width={240} height={160} />
            </div>
          </div>
        </div>
      </main>

      <Footer onSubscribe={() => {}} subscribed={false} />
    </>
  )
}

