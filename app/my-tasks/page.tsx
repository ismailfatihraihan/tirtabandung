"use client"

import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Droplet, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Clock,
  Plus,
  FileText
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

// Mock data untuk tugas officer
const mockTasks = {
  district: "Cibaduyut",
  totalWaterPoints: 15,
  checkedThisMonth: 9,
  pendingInspections: 6,
  openIssues: 2,
  upcomingTasks: [
    {
      id: "1",
      waterPointName: "Sumur Bor Cibaduyut A",
      address: "Jl. Cibaduyut Raya No. 45",
      lastInspection: "2024-12-15",
      status: "urgent",
      daysOverdue: 3
    },
    {
      id: "2",
      waterPointName: "Reservoir Cibaduyut B",
      address: "Jl. Cibaduyut Kidul No. 12",
      lastInspection: "2024-12-20",
      status: "due-soon",
      daysOverdue: 0
    },
    {
      id: "3",
      waterPointName: "Instalasi Cibaduyut C",
      address: "Jl. Cibaduyut Wetan No. 88",
      lastInspection: "2024-12-25",
      status: "ok",
      daysOverdue: -5
    }
  ]
}

export default function MyTasksPage() {
  const { user, isOfficer, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isOfficer) {
      router.push("/dashboard")
    }
  }, [isLoading, isOfficer, router])

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  if (!isOfficer) {
    return null
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tugas Saya</h1>
        <p className="text-muted-foreground mt-2">
          Wilayah tugas: <span className="font-semibold text-foreground">{mockTasks.district}</span>
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Droplet className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{mockTasks.totalWaterPoints}</div>
                <div className="text-xs text-muted-foreground">Titik Air</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{mockTasks.checkedThisMonth}</div>
                <div className="text-xs text-muted-foreground">Sudah Dicek</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{mockTasks.pendingInspections}</div>
                <div className="text-xs text-muted-foreground">Belum Dicek</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold">{mockTasks.openIssues}</div>
                <div className="text-xs text-muted-foreground">Masalah Aktif</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
          <CardDescription>Tugas yang sering dilakukan</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/inspections/new" className="w-full">
            <Button size="lg" className="w-full h-24 flex-col gap-2">
              <FileText className="h-8 w-8" />
              <span>Tambah Laporan Inspeksi</span>
            </Button>
          </Link>
          <Link href="/issues/new" className="w-full">
            <Button size="lg" variant="destructive" className="w-full h-24 flex-col gap-2">
              <AlertTriangle className="h-8 w-8" />
              <span>Laporkan Masalah</span>
            </Button>
          </Link>
          <Link href="/water-points" className="w-full">
            <Button size="lg" variant="outline" className="w-full h-24 flex-col gap-2">
              <MapPin className="h-8 w-8" />
              <span>Lihat Semua Lokasi</span>
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Upcoming Tasks */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Jadwal Inspeksi</CardTitle>
              <CardDescription>Titik yang perlu segera dicek</CardDescription>
            </div>
            <Badge variant="outline">
              {mockTasks.pendingInspections} pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockTasks.upcomingTasks.map((task) => {
            const statusConfig = {
              urgent: { 
                badge: "destructive", 
                text: "URGENT - Terlambat", 
                color: "text-red-600",
                icon: AlertTriangle
              },
              "due-soon": { 
                badge: "default", 
                text: "Segera dicek", 
                color: "text-orange-600",
                icon: Clock
              },
              ok: { 
                badge: "secondary", 
                text: "Masih aman", 
                color: "text-green-600",
                icon: CheckCircle2
              },
            }
            
            const config = statusConfig[task.status as keyof typeof statusConfig]
            const Icon = config.icon

            return (
              <div key={task.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${config.color}`} />
                      <h4 className="font-semibold">{task.waterPointName}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {task.address}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Terakhir dicek: {new Date(task.lastInspection).toLocaleDateString('id-ID')}
                      {task.daysOverdue > 0 && (
                        <span className="text-red-600 font-medium ml-2">
                          ({task.daysOverdue} hari terlambat)
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={config.badge as any}>
                      {config.text}
                    </Badge>
                    <Link href={`/inspections/new?waterPointId=${task.id}`}>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Input Data
                      </Button>
                    </Link>
                  </div>
                </div>
                <Separator className="mt-4" />
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Terakhir</CardTitle>
          <CardDescription>Riwayat inspeksi dan laporan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-muted-foreground">Inspeksi di Sumur Bor Cibaduyut A</span>
              <span className="ml-auto text-xs text-muted-foreground">2 jam lalu</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-muted-foreground">Melaporkan masalah pipa bocor</span>
              <span className="ml-auto text-xs text-muted-foreground">5 jam lalu</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-muted-foreground">Inspeksi di Reservoir Cibaduyut B</span>
              <span className="ml-auto text-xs text-muted-foreground">Kemarin</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
