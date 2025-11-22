import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { authAPI } from '../lib/api'

interface User {
  id: number
  email: string
  firstName: string | null
  lastName: string | null
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: { email: string; password: string; firstName?: string; lastName?: string; role?: string }) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const refreshUser = async () => {
    try {
      const data = await authAPI.getCurrentUser()
      setUser(data.user)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const login = async (email: string, password: string) => {
    const data = await authAPI.login(email, password)
    setUser(data.user)
    router.push('/')
  }

  const register = async (registerData: { email: string; password: string; firstName?: string; lastName?: string; role?: string }) => {
    const data = await authAPI.register(registerData)
    setUser(data.user)
    router.push('/')
  }

  const logout = async () => {
    await authAPI.logout()
    setUser(null)
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

