"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  avatar?: string | null
  phone?: string
  address?: string
  is_active: boolean
  created_at: Date
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Coba ambil dari localStorage dulu (untuk backward compatibility)
    const localUser = localStorage.getItem("user")
    if (localUser) {
      try {
        setUser(JSON.parse(localUser))
      } catch (e) {
        console.error('Error parsing user from localStorage:', e)
      }
    }

    // Kemudian fetch dari API untuk data terbaru
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include' // Penting untuk mengirim cookie
      })

      if (response.ok) {
        const data = await response.json()
        // Normalize avatar field to either string or null
        const fetched = data.user || {}
        if (fetched.avatar === undefined) fetched.avatar = null
        setUser(fetched)
        // Sync ke localStorage
        localStorage.setItem("user", JSON.stringify(fetched))
      } else {
        // Token invalid atau expired
        setUser(null)
        localStorage.removeItem("user")
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      // Tetap gunakan data localStorage jika API error
    } finally {
      setIsLoading(false)
    }
  }

  // Listen for external updates to the user (e.g. profile edit) and refresh
  useEffect(() => {
    const handler = () => {
      fetchUser()
    }

    window.addEventListener('user:updated', handler)
    return () => window.removeEventListener('user:updated', handler)
  }, [])

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      localStorage.removeItem("user")
      router.push("/login")
    }
  }

  const isAdmin = true // Always admin in simplified app

  const requireAdmin = () => {
    return true // No need to check, all users are admin
  }

  return {
    user,
    isAdmin,
    isLoading,
    requireAdmin,
    logout,
    refreshUser: fetchUser
  }
}
