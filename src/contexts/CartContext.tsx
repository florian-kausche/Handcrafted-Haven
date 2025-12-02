import React, { createContext, useContext, useState, useEffect } from 'react'
import { cartAPI, productsAPI } from '../lib/api'
import { useAuth } from './AuthContext'
import type { CartItem, Product } from '../types'

interface CartContextType {
  items: CartItem[]
  loading: boolean
  addItem: (product: Product, quantity: number) => Promise<void>
  removeItem: (productId: string | number) => Promise<void>
  refreshCart: () => Promise<void>
  getTotal: () => number
  getItemCount: () => number
  showToast?: (message: string, actionLabel?: string, action?: (() => Promise<void>) | (() => void)) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const GUEST_KEY = 'hh_guest_cart'

  const loadGuestCart = (): CartItem[] => {
    try {
      const raw = localStorage.getItem(GUEST_KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw)
      // Ensure shape matches CartItem
      return (parsed || []).map((it: any) => ({
        id: it.id || it.productId || `${it.productId}`,
        product_id: it.productId || it.product_id,
        quantity: Number(it.quantity || 0),
        title: it.title || '',
        price: (it.price !== undefined ? String(it.price) : '0.00'),
        image_url: it.image_url || it.image || '/assets/product-1.jpeg',
        stock_quantity: Number(it.stock_quantity || 0),
      }))
    } catch (e) {
      console.error('Failed to load guest cart', e)
      return []
    }
  }

  const saveGuestCart = (next: CartItem[]) => {
    try {
      localStorage.setItem(GUEST_KEY, JSON.stringify(next))
    } catch (e) {
      console.error('Failed to save guest cart', e)
    }
  }

  const refreshCart = async () => {
    setLoading(true)
    try {
      if (!user) {
        // load guest cart from localStorage
        const guest = loadGuestCart()
        setItems(guest || [])
        setLoading(false)
        return
      }

      const data = await cartAPI.getItems()
      // normalize server items to the flat shape the UI expects
      const serverItems = (data.items || []).map((it: any) => {
        // support both nested product object and flat shapes
        const prod = it.product || it.productData || {}
        const productId = (prod._id && String(prod._id)) || prod.id || it.product || it.product_id || it.productId || ''
        const title = prod.title || it.title || ''
        const price = prod.price !== undefined ? prod.price : (it.price !== undefined ? it.price : 0)
        const image_url = (prod.images && prod.images[0]?.url) || prod.image_url || it.image_url || it.image || '/assets/product-1.jpeg'
        const stock_quantity = prod.stock_quantity || prod.stock || it.stock_quantity || 0

        return {
          id: it._id || it.id || `${productId}`,
          product_id: productId,
          quantity: Number(it.quantity || 0),
          title,
          price,
          image_url,
          stock_quantity: Number(stock_quantity || 0),
        }
      })

      setItems(serverItems)
    } catch (error) {
      console.error('Failed to load cart:', error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshCart()
  }, [user])

  // toast state and helper
  const [toast, setToast] = useState<null | { message: string; actionLabel?: string; action?: (() => Promise<void>) | (() => void) }>(null)
  const clearToast = () => setToast(null)
  const showToast = (message: string, actionLabel?: string, action?: (() => Promise<void>) | (() => void)) => {
    setToast({ message, actionLabel, action })
    window.setTimeout(() => setToast(null), 3500)
  }

  const addItem = async (product: Product, quantity: number) => {
    const productId = product.id || (product as any)._id

    if (!user) {
      // guest cart: persist locally
      const current = loadGuestCart()
      const currentBefore = current.map((it) => ({ ...it }))
      const existing = current.find((it: any) => String(it.product_id) === String(productId))
      if (existing) {
        existing.quantity = (existing.quantity || 0) + quantity
      } else {
        const title = product.title || ''
        const price = product.price !== undefined ? String(product.price) : '0.00'
        const image_url = (product.image_url || product.image) as string | undefined
        current.push({ id: `${productId}`, product_id: productId, quantity, title, price, image_url })
      }
      saveGuestCart(current)
      setItems(current)

      // show toast for guest add with undo
      const prev = currentBefore
      showToast(`${product.title} added to cart`, 'Undo', () => {
        saveGuestCart(prev)
        setItems(prev)
        clearToast()
      })
      return
    }

    try {
      // get previous quantity for undo
      let prevQty = 0
      try {
        const existing = await cartAPI.getItems()
        const found = (existing.items || []).find((it: any) => String(it.product.id) === String(productId) || String(it.product.id) === String(String(productId)))
        if (found) prevQty = found.quantity || 0
      } catch (e) {
        // ignore
      }

      await cartAPI.addItem(productId, quantity)
      await refreshCart()

      // show toast for authenticated add with undo that restores previous quantity
      showToast(`${product.title} added to cart`, 'Undo', async () => {
        try {
          await cartAPI.updateItem(productId, prevQty)
          await refreshCart()
        } catch (e) {
          console.error('Undo failed', e)
        }
        clearToast()
      })
    } catch (error) {
      console.error('Failed to add item:', error)
      showToast('Failed to add item to cart. Please try again.')
      throw error
    }
  }

  const removeItem = async (productId: string | number) => {
    if (!user) {
      const current = loadGuestCart()
      const next = current.filter((it: any) => String(it.product_id || it.productId || it.id) !== String(productId))
      saveGuestCart(next)
      setItems(next as any)
      return
    }

    try {
      await cartAPI.removeItem(productId)
      await refreshCart()
    } catch (error) {
      console.error('Failed to remove item:', error)
      showToast('Failed to remove item from cart. Please try again.')
      throw error
    }
  }

  // when user logs in, sync any guest cart items to server
  useEffect(() => {
    const syncGuestToServer = async () => {
      if (!user) return
      const guest = loadGuestCart()
      if (!guest || guest.length === 0) return
      try {
        for (const it of guest) {
          // add each guest item to authenticated cart
          await cartAPI.addItem(it.product_id, it.quantity || 1)
        }
      } catch (e) {
        console.error('Failed to sync guest cart:', e)
      }
      // clear guest cart and refresh from server
      saveGuestCart([])
      await refreshCart()
    }

    syncGuestToServer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const getTotal = () => {
    return items.reduce((sum, item) => {
      const price = typeof item.price === 'number' ? item.price : parseFloat(String(item.price || '0'))
      const qty = Number(item.quantity || 0)
      return sum + price * qty
    }, 0)
  }

  const getItemCount = () => {
    return items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
  }

  return (
    <CartContext.Provider value={{ items, loading, addItem, removeItem, refreshCart, getTotal, getItemCount, showToast }}>
      {children}

      {/* Simple toast rendered by the CartProvider so addItem can trigger UX feedback */}
      {toast && (
        <div style={{ position: 'fixed', right: 20, bottom: 20, background: 'rgba(0,0,0,0.85)', color: 'white', padding: '12px 18px', borderRadius: 8, zIndex: 9999, boxShadow: '0 6px 18px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>{toast.message}</span>
            {toast.actionLabel && (
              <button
                onClick={async () => {
                  try {
                    await (toast.action && (toast.action as any)())
                  } catch (e) {
                    console.error('Toast action error', e)
                  }
                  clearToast()
                }}
                style={{ marginLeft: 8, background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '6px 10px', borderRadius: 6, cursor: 'pointer' }}
              >
                {toast.actionLabel}
              </button>
            )}
          </div>
        </div>
      )}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

