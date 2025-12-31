"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Droplets } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Login gagal')
        setIsLoading(false)
        return
      }

      // Simpan user data ke localStorage
      localStorage.setItem("user", JSON.stringify(data.user))
      
      toast.success("Login berhasil!")
      
      // Redirect based on role
      if (data.user.role === "officer") {
        router.push("/my-tasks")
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error("Terjadi kesalahan. Coba lagi.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center">
              <Droplets className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Selamat Datang</CardTitle>
          <CardDescription>
            Login ke sistem monitoring Tirta Bandung
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@tirtabandung.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Loading..." : "Login"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Belum punya akun?{" "}
              <Link href="/register" className="text-blue-600 hover:underline font-medium">
                Daftar disini
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
