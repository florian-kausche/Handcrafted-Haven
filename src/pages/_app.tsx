import type { AppProps } from 'next/app'
import '../styles/globals.css'
import { AuthProvider } from '../contexts/AuthContext'
import { CartProvider } from '../contexts/CartContext'
import PageLoader from '../components/PageLoader'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <PageLoader />
        <Component {...pageProps} />
      </CartProvider>
    </AuthProvider>
  )
}


