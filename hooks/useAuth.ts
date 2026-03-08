'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import React from 'react'
import { AuthUser } from '@/lib/auth'

interface AuthContextType {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProviderComponent({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // Only check auth if there's a token in cookies
      const token = document.cookie.split(';').find(cookie => cookie.trim().startsWith('auth-token='))
      
      if (!token) {
        console.log('🔍 No token found in cookies, skipping auth check')
        setLoading(false)
        return
      }
      
      console.log('🔍 Token found, checking auth...')
      const response = await fetch('/api/auth/me')
      const data = await response.json()
      
      if (data.success) {
        setUser(data.data)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🔍 Starting login process...')
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      console.log('🔍 Login API response status:', response.status)
      
      const data = await response.json()
      console.log('🔍 Login API response data:', data)
      
      if (data.success) {
        console.log('🔍 Login successful, setting user...')
        setUser(data.data.user)
        return true
      } else {
        console.log('🔍 Login failed:', data.error)
        alert(data.error || 'การเข้าสู่ระบบล้มเหลว')
        return false
      }
    } catch (error) {
      console.error('🔍 Login failed with error:', error)
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ')
      return false
    }
  }

  const logout = () => {
    setUser(null)
    window.location.href = '/login'
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    loading
  }

  return React.createElement(
    AuthContext.Provider,
    { value },
    children
  )
}

export const AuthProvider = AuthProviderComponent
