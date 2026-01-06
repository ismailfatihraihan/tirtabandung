"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Edit, Clock, User, MapPin, AlertCircle, ShieldCheck, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { Issue } from "@/lib/types/database"

export default function IssueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { isAdmin } = useAuth()
  const [issue, setIssue] = useState<Issue | null>(null)
  const [loading, setLoading] = useState(true)
  const [updateNote, setUpdateNote] = useState("")
  const [newStatus, setNewStatus] = useState<Issue['status']>("Perlu Disurvei")
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchIssue()
  }, [id])

  const fetchIssue = async () => {
    try {
      const response = await fetch(`/api/issues/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch issue')
      }
      const data = await response.json()
      setIssue(data.data)
      setNewStatus(data.data.status)
    } catch (error) {
      console.error('Error fetching issue:', error)
      toast.error('Gagal memuat detail masalah')
    } finally {
      setLoading(false)
    }
  }

  const getSeverityBadge = (severity: Issue['severity']) => {
    const colors = {
      'Kritis': 'bg-red-600',
      'Tinggi': 'bg-orange-500',
      'Sedang': 'bg-yellow-500',
      'Rendah': 'bg-blue-500'
    }
    return <Badge className={colors[severity]}>{severity}</Badge>
  }

  const getStatusBadge = (status: Issue['status']) => {
    const colors = {
      'Perlu Disurvei': 'bg-red-500',
      'Sedang Diperbaiki': 'bg-yellow-500',
      'Selesai': 'bg-green-500',
      'Invalid': 'bg-gray-500'
    }
    return <Badge className={colors[status]}>{status}</Badge>
  }

  const handleUpdateStatus = async () => {
    if (!issue) return

    setUpdating(true)
    try {
      const response = await fetch(`/api/issues/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          // TODO: Add note to timeline or action tracking
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update status')
      }

      const data = await response.json()
      setIssue(data.data)
      toast.success("Status berhasil diperbarui!")
      setUpdateNote("")
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error(error instanceof Error ? error.message : 'Gagal memperbarui status')
    } finally {
      setUpdating(false)
    }
  }

  const handleInvalidate = async () => {
    if (!issue) return

    setUpdating(true)
    try {
      const response = await fetch(`/api/issues/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'Invalid',
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to invalidate issue')
      }

      const data = await response.json()
      setIssue(data.data)
      toast.success("Laporan ditandai sebagai invalid")
    } catch (error) {
      console.error('Error invalidating issue:', error)
      toast.error(error instanceof Error ? error.message : 'Gagal menandai sebagai invalid')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-center min-h-100">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!issue) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <p className="text-muted-foreground">Masalah tidak ditemukan</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{issue.title}</h1>
            <p className="text-muted-foreground">Detail laporan masalah</p>
          </div>
        </div>
        <div className="flex gap-2">
          {/* Only Admin can mark as invalid or resolve */}
          {isAdmin && issue.status !== 'Invalid' && (
            <Button variant="destructive" onClick={handleInvalidate} disabled={updating}>
              {updating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Tandai Invalid
            </Button>
          )}
        </div>
      </div>

      {/* Admin Only Badge for Update Actions */}
      {isAdmin && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 flex items-center gap-2 text-sm">
          <ShieldCheck className="h-4 w-4 text-purple-600" />
          <p className="text-purple-900">
            <span className="font-semibold">Admin:</span> Anda dapat mengubah status dan menandai laporan sebagai selesai atau invalid
          </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Masalah</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <div className="flex gap-2">
                {getStatusBadge(issue.status)}
                {getSeverityBadge(issue.severity)}
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Deskripsi</p>
              <p className="text-sm">{issue.description}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Lokasi
              </p>
              <p className="font-medium">{issue.water_point_name || 'Unknown Location'}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                <User className="h-4 w-4" />
                Pelapor
              </p>
              <p className="font-medium">{issue.reporter_name || `User ${issue.reported_by}`}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Waktu Laporan
              </p>
              <p className="font-medium">
                {new Date(issue.created_at).toLocaleString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Only Admin can update status */}
        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Update Progres</CardTitle>
              <CardDescription>Perbarui status penanganan (Admin Only)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status Baru</label>
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as Issue['status'])} className="border rounded px-3 py-2">
                  <option value="Perlu Disurvei">Perlu Disurvei</option>
                  <option value="Sedang Diperbaiki">Sedang Diperbaiki</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Catatan Tindakan</label>
              <Textarea
                placeholder="Contoh: Filter air sudah diganti, pompa sudah diperbaiki..."
                value={updateNote}
                onChange={(e) => setUpdateNote(e.target.value)}
                rows={4}
              />
            </div>

            <Button className="w-full" onClick={handleUpdateStatus} disabled={updating}>
              {updating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Simpan Update
            </Button>
          </CardContent>
        </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Timeline Tindakan</CardTitle>
          <CardDescription>Riwayat penanganan masalah</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <div className="w-0.5 h-full bg-border" />
              </div>
              <div className="flex-1 pb-4">
                <p className="font-medium">Laporan Dibuat</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(issue.created_at).toLocaleString('id-ID')}
                </p>
                <p className="text-sm mt-1">{issue.description}</p>
              </div>
            </div>
            <div className="text-center text-muted-foreground text-sm py-4">
              Belum ada update tindakan
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
