"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function useAuth() {
  const [user, setUser] = useState<{ email: string; role: "admin" | "officer"; district?: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
    setIsLoading(false)
  }, [])

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
    requireAdmin
  }
}
