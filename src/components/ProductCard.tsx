import React from 'react'
import type { Product } from '../types'

interface ProductCardProps {
  product: Product
  onSelect: (product: Product) => void
  onAddToCart: (product: Product) => void
}

export default function ProductCard({ product, onSelect, onAddToCart }: ProductCardProps) {
  const priceNumber = typeof product.price === 'number' ? product.price : parseFloat(product.price as any || '0')
  const rating = typeof product.rating === 'number' ? product.rating : (product.rating ? Number(product.rating) : 0)
    const img = ((product.images && product.images[0]?.url) || product.image_url || product.image || '/assets/product-1.jpeg') as string
  
  return (
    <article className="product-card">
      {product.featured && <div className="ribbon">Featured</div>}
      <div className="product-image-wrapper" onClick={() => onSelect(product)}>
          <img
            src={img}
            alt={product.title}
            className="product-image"
            loading="lazy"
            width="360"
            height="240"
          />
      </div>
      <div className="product-body">
        <h3>{product.title}</h3>
        <p className="by">by {product.artisan_name || product.artisanName || 'Artisan'}</p>
        <div className="product-rating">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill={i < rating ? 'currentColor' : 'none'}
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M7 1l1.5 3 3.5.5-2.5 2.5.5 3.5L7 9.5 3.5 10.5l.5-3.5L1.5 4.5l3.5-.5L7 1z" strokeWidth="1"/>
            </svg>
          ))}
          <span className="rating-value">{product.rating}</span>
        </div>
        <div className="meta">
          <div className="price">${priceNumber.toFixed(2)}</div>
          <button 
            className="btn small" 
            onClick={() => onAddToCart(product)}
            aria-label={`Add ${product.title} to cart`}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '4px' }}>
              <path d="M3.5 5.25h7l-.875 5.25H4.375l-.875-5.25z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5.25 7v-1.75a1.75 1.75 0 0 1 3.5 0V7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Add
          </button>
        </div>
      </div>
    </article>
  )
}

