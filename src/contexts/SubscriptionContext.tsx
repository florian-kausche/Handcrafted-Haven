import { useState } from 'react'
import { useCart } from './CartContext'

export function useSubscription() {
  const [subscribed, setSubscribed] = useState(false)
  const [subscribedEmail, setSubscribedEmail] = useState('')
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const { showToast } = useCart()

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const email = (form.elements[0] as HTMLInputElement).value
    
    if (!email || !email.includes('@')) {
      showToast?.('Please enter a valid email')
      return
    }

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        showToast?.(data.error || 'Failed to subscribe')
        return
      }

      localStorage.setItem('hh_newsletter', email)
      setSubscribedEmail(email)
      setSubscribed(true)
      setShowSubscriptionModal(true)
      form.reset()
    } catch (error) {
      console.error('Subscription error:', error)
      showToast?.('An error occurred. Please try again.')
    }
  }

  return {
    subscribed,
    subscribedEmail,
    showSubscriptionModal,
    setShowSubscriptionModal,
    handleSubscribe,
  }
}
