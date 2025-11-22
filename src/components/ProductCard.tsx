import React from 'react'

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

interface ProductCardProps {
  product: Product
  onSelect: (product: Product) => void
  onAddToCart: (product: Product) => void
}

export default function ProductCard({ product, onSelect, onAddToCart }: ProductCardProps) {
  return (
    <article className="product-card">
      {product.featured && <div className="ribbon">Featured</div>}
      <div className="product-image-wrapper" onClick={() => onSelect(product)}>
        <img 
          src={product.image} 
          alt={product.title} 
          className="product-image"
          loading="lazy"
        />
      </div>
      <div className="product-body">
        <h3>{product.title}</h3>
        <p className="by">by {product.artisanName}</p>
        <div className="product-rating">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M7 1l1.5 3 3.5.5-2.5 2.5.5 3.5L7 9.5 3.5 10.5l.5-3.5L1.5 4.5l3.5-.5L7 1z" strokeWidth="1"/>
            </svg>
          ))}
          <span className="rating-value">{product.rating}</span>
        </div>
        <div className="meta">
          <div className="price">${product.price.toFixed(2)}</div>
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

