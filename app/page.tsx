"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplets, MapPin, Activity, Users, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem("user")
    if (user) {
      router.push("/dashboard")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-10">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center justify-center p-4 bg-blue-600 rounded-full mb-4">
            <Droplets className="h-16 w-16 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900">
            Tirta Bandung
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto">
            Sistem Monitoring Kualitas Air & Infrastruktur Sanitasi Kota Bandung
          </p>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Real-time monitoring, analisis prediktif, dan decision support system untuk pengelolaan air bersih yang lebih baik
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/login">
              <Button size="lg" className="gap-2">
                Masuk Sistem
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="gap-2">
                Daftar Akun
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-2 hover:border-blue-200 transition-colors">
            <CardHeader>
              <MapPin className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Pemetaan Geografis</CardTitle>
              <CardDescription>
                Visualisasi real-time lokasi titik monitoring dan status kualitas air
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-blue-200 transition-colors">
            <CardHeader>
              <Activity className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>Analisis Kesehatan</CardTitle>
              <CardDescription>
                Monitoring parameter E.Coli dan korelasi dengan data kesehatan masyarakat
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-blue-200 transition-colors">
            <CardHeader>
              <Droplets className="h-10 w-10 text-cyan-600 mb-2" />
              <CardTitle>Manajemen Infrastruktur</CardTitle>
              <CardDescription>
                Tracking perawatan sumur, reservoir, dan sistem distribusi air
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-blue-200 transition-colors">
            <CardHeader>
              <Users className="h-10 w-10 text-purple-600 mb-2" />
              <CardTitle>Koordinasi Tim</CardTitle>
              <CardDescription>
                Platform terintegrasi untuk admin, surveyor, dan teknisi lapangan
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-12">
        <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0">
          <CardContent className="py-12">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">1,240</div>
                <div className="text-blue-100">Titik Monitoring Aktif</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">98.5%</div>
                <div className="text-blue-100">Tingkat Kualitas Air Aman</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-blue-100">Monitoring Real-time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-slate-600">
        <p>© 2025 Tirta Bandung. Sistem Monitoring Kualitas Air.</p>
        <p className="text-sm mt-2">Dikelola oleh Pemerintah Kota Bandung</p>
      </footer>
    </div>
  )
}

