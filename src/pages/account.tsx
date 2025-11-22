import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'
import { ordersAPI } from '../lib/api'

export default function Account() {
  const { user } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    if (user) {
      loadOrders()
    }
  }, [user, router])

  const loadOrders = async () => {
    try {
      const data = await ordersAPI.getAll()
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Failed to load orders:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <>
      <Head>
        <title>My Account - Handcrafted Haven</title>
      </Head>

      <Header />

      <main style={{ padding: '40px 0' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '42px', marginBottom: '32px' }}>My Account</h1>

          {router.query.order === 'success' && (
            <div style={{ background: '#d4edda', color: '#155724', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
              Order placed successfully!
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
            <div>
              <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '20px' }}>Profile</h2>
                <p style={{ marginBottom: '8px' }}><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                <p style={{ marginBottom: '8px' }}><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
              </div>
            </div>

            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '24px' }}>Order History</h2>
              {loading ? (
                <p>Loading orders...</p>
              ) : orders.length === 0 ? (
                <p>No orders yet</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      style={{
                        background: 'white',
                        padding: '24px',
                        borderRadius: '12px',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div>
                          <strong>Order #{order.id}</strong>
                          <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '4px' }}>
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--accent)' }}>
                            ${parseFloat(order.total_amount).toFixed(2)}
                          </div>
                          <span
                            style={{
                              padding: '4px 12px',
                              borderRadius: '12px',
                              background: order.status === 'pending' ? '#fff3cd' : '#d4edda',
                              color: order.status === 'pending' ? '#856404' : '#155724',
                              fontSize: '12px',
                              fontWeight: '600',
                            }}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                      {order.items && order.items.length > 0 && (
                        <div>
                          {order.items.map((item: any, idx: number) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                              <span>{item.title} x {item.quantity}</span>
                              <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer onSubscribe={() => {}} subscribed={false} />
    </>
  )
}

