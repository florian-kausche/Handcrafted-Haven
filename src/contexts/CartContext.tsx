import React, { createContext, useContext, useState, useEffect } from 'react'
import { cartAPI } from '../lib/api'
import { useAuth } from './AuthContext'

interface CartItem {
  id: number
  product_id: number
  quantity: number
  title: string
  price: string
  image_url: string
  stock_quantity: number
}

interface CartContextType {
  items: CartItem[]
  loading: boolean
  addItem: (productId: number, quantity: number) => Promise<void>
  removeItem: (productId: number) => Promise<void>
  refreshCart: () => Promise<void>
  getTotal: () => number
  getItemCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const refreshCart = async () => {
    if (!user) {
      setItems([])
      return
    }

    setLoading(true)
    try {
      const data = await cartAPI.getItems()
      setItems(data.items || [])
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

  const addItem = async (productId: number, quantity: number) => {
    if (!user) {
      alert('Please login to add items to cart')
      return
    }

    try {
      await cartAPI.addItem(productId, quantity)
      await refreshCart()
    } catch (error) {
      console.error('Failed to add item:', error)
      alert('Failed to add item to cart. Please try again.')
      throw error
    }
  }

  const removeItem = async (productId: number) => {
    try {
      await cartAPI.removeItem(productId)
      await refreshCart()
    } catch (error) {
      console.error('Failed to remove item:', error)
      alert('Failed to remove item from cart. Please try again.')
      throw error
    }
  }

  const getTotal = () => {
    return items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0)
  }

  const getItemCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }

  return (
    <CartContext.Provider value={{ items, loading, addItem, removeItem, refreshCart, getTotal, getItemCount }}>
      {children}
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

