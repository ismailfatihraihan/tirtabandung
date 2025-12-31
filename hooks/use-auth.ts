"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "officer"
  phone?: string
  district?: string
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
        setUser(data.user)
        // Sync ke localStorage
        localStorage.setItem("user", JSON.stringify(data.user))
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

  const isAdmin = user?.role === "admin"
  const isOfficer = user?.role === "officer"

  const requireAdmin = () => {
    if (!isAdmin) {
      router.push("/dashboard")
      return false
    }
    return true
  }

  return {
    user,
    isAdmin,
    isOfficer,
    isLoading,
    requireAdmin,
    logout,
    refreshUser: fetchUser
  }
}
