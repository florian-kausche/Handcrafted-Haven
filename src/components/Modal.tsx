import React, { useEffect } from 'react'
import Image from 'next/image'

interface CartItem {
  id: number
  title: string
  price: number
  qty: number
}

interface Product {
  id: number
  title: string
  price: number
  image: string
  featured: boolean
  description: string
  rating: number
  artisanName: string
}

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'cart' | 'product'
  cart?: CartItem[]
  product?: Product
  onRemoveFromCart?: (id: number) => void
  onClearCart?: () => void
  onAddToCart?: (product: Product) => void
}

export default function Modal({ 
  isOpen, 
  onClose, 
  type, 
  cart = [], 
  product,
  onRemoveFromCart,
  onClearCart,
  onAddToCart
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {type === 'cart' && (
          <div className="cart-modal">
            <h2>Your Cart</h2>
            {cart.length === 0 ? (
              <div className="empty-cart">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 24l-4-8H8M20 24h32l-4-8H20z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M24 40a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM52 40a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p>Your cart is empty</p>
                <button className="btn outline" onClick={onClose}>Continue Shopping</button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-info">
                        <h4>{item.title}</h4>
                        <p>Quantity: {item.qty}</p>
                      </div>
                      <div className="cart-item-actions">
                        <span className="cart-item-price">${item.price * item.qty}.00</span>
                        <button 
                          className="btn-remove" 
                          onClick={() => onRemoveFromCart?.(item.id)}
                          aria-label={`Remove ${item.title} from cart`}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart-footer">
                  <div className="cart-total">
                    <span>Total:</span>
                    <strong>${total}.00</strong>
                  </div>
                  <div className="cart-actions">
                    <button className="btn outline" onClick={onClose}>Continue Shopping</button>
                    <button 
                      className="btn primary" 
                      onClick={() => {
                        alert('Checkout demo — cart cleared')
                        onClearCart?.()
                        onClose()
                      }}
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {type === 'product' && product && (
          <div className="product-modal">
            <div className="product-modal-image">
              <Image
                src={product.image}
                alt={product.title}
                width={600}
                height={600}
                className="product-image-large"
              />
            </div>
            <div className="product-modal-content">
              <h2>{product.title}</h2>
              <div className="product-price">${product.price}.00</div>
              <p className="product-description">{product.description}</p>
              <div className="product-modal-actions">
                <button 
                  className="btn primary" 
                  onClick={() => {
                    onAddToCart?.(product)
                    onClose()
                  }}
                >
                  Add to Cart
                </button>
                <button className="btn outline" onClick={onClose}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

