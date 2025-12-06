import React from 'react'

interface SubscriptionModalProps {
  isOpen: boolean
  email: string
  onClose: () => void
}

export default function SubscriptionModal({ isOpen, email, onClose }: SubscriptionModalProps) {
  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes checkmark {
          0% {
            stroke-dashoffset: 66;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>

      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '48px',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        animation: 'slideInDown 0.4s ease-out'
      }}>
        {/* Checkmark Icon */}
        <div style={{
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background Circle */}
            <circle cx="40" cy="40" r="40" fill="#d4edda" opacity="0.3" />
            <circle 
              cx="40" 
              cy="40" 
              r="36" 
              fill="none" 
              stroke="#28a745" 
              strokeWidth="2"
            />
            
            {/* Checkmark */}
            <path
              d="M 25 42 L 37 54 L 57 28"
              stroke="#28a745"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              style={{
                animation: 'checkmark 0.6s ease-out 0.3s both',
                strokeDasharray: 66,
                strokeDashoffset: 66
              }}
            />
          </svg>
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '32px',
          fontWeight: 700,
          marginBottom: '12px',
          color: '#1a1a1a'
        }}>
          Welcome Aboard!
        </h2>

        {/* Subtitle */}
        <p style={{
          fontSize: '16px',
          color: 'var(--muted)',
          marginBottom: '12px',
          lineHeight: '1.6'
        }}>
          You've successfully subscribed to our newsletter.
        </p>

        {/* Email Display */}
        <div style={{
          background: '#f8f9fa',
          padding: '16px',
          borderRadius: '12px',
          marginBottom: '24px',
          wordBreak: 'break-all'
        }}>
          <p style={{ fontSize: '14px', color: 'var(--muted)', margin: '0 0 8px 0' }}>
            Confirmation sent to:
          </p>
          <p style={{ 
            fontSize: '16px', 
            fontWeight: 600, 
            color: '#1a1a1a',
            margin: 0
          }}>
            {email}
          </p>
        </div>

        {/* Message */}
        <p style={{
          fontSize: '15px',
          color: 'var(--muted)',
          marginBottom: '28px',
          lineHeight: '1.7'
        }}>
          Get ready to discover unique handcrafted treasures, exclusive artisan stories, and special offers delivered straight to your inbox.
        </p>

        {/* CTA Button */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '14px 24px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(40, 167, 69, 0.2)'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = '#218838'
            ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.3)'
            ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = '#28a745'
            ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(40, 167, 69, 0.2)'
            ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
          }}
        >
          Explore Our Shop
        </button>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '32px',
            height: '32px',
            background: 'transparent',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#999',
            transition: 'color 0.2s ease',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = '#333'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = '#999'
          }}
          aria-label="Close modal"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
