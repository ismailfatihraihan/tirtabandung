import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

type IssueRow = {
  type: "issue"
  id: string
  title: string
  location: string
  status: string
  eta?: string
  link: string
}

type InspectionRow = {
  type: "inspection"
  id: string
  title: string
  location: string
  status: string
  eta?: string
  link: string
}

type Row = IssueRow | InspectionRow

const statusColor = (status: string) => {
  if (status === "Sedang Diperbaiki") return "bg-amber-100 text-amber-800"
  if (status === "Perlu Disurvei" || status === "Perlu Perhatian") return "bg-yellow-100 text-yellow-800"
  if (status === "Berbahaya" || status === "Kritis") return "bg-red-100 text-red-800"
  return "bg-emerald-100 text-emerald-800"
}

export function MaintenanceTable() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [issuesRes, inspectionsRes] = await Promise.all([
        fetch("/api/issues?status=Perlu%20Disurvei", { cache: "no-store" }),
        fetch("/api/inspections?status=Perlu%20Perhatian", { cache: "no-store" })
      ])

      if (!issuesRes.ok || !inspectionsRes.ok) throw new Error("Failed to fetch maintenance data")

      const issuesJson = await issuesRes.json()
      const inspectionsJson = await inspectionsRes.json()

      const issueRows: IssueRow[] = (issuesJson?.data || []).map((issue: any) => ({
        type: "issue",
        id: issue._id,
        title: issue.title,
        location: issue.water_point_name || issue.water_point_id || "-",
        status: issue.status,
        eta: issue.resolved_at ? new Date(issue.resolved_at).toLocaleDateString("id-ID") : undefined,
        link: `/issues/${issue._id}`
      }))

      const inspectionRows: InspectionRow[] = (inspectionsJson?.data || []).map((insp: any) => ({
        type: "inspection",
        id: insp._id,
        title: insp.notes || `Inspeksi ${insp.date ? new Date(insp.date).toLocaleDateString("id-ID") : ""}`,
        location: insp.water_point_name || insp.water_point_id || "-",
        status: insp.status,
        link: `/inspections/${insp._id}`,
        eta: undefined
      }))

      const merged = [...issueRows, ...inspectionRows].slice(0, 8)
      setRows(merged)
    } catch (err) {
      console.error("maintenance table fetch error", err)
      setError("Gagal memuat data maintenance")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const content = useMemo(() => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
            <div className="flex items-center justify-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" /> Memuat data...
            </div>
          </TableCell>
        </TableRow>
      )
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="text-center py-6 text-red-600 text-sm">
            {error}
          </TableCell>
        </TableRow>
      )
    }

    if (rows.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="text-center py-6 text-muted-foreground text-sm">
            Belum ada pekerjaan maintenance atau inspeksi yang perlu perhatian.
          </TableCell>
        </TableRow>
      )
    }

    return rows.map((row) => (
      <TableRow key={`${row.type}-${row.id}`} className="border-b border-slate-100">
        <TableCell className="text-slate-900 font-medium">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{row.type === "issue" ? "Isu" : "Inspeksi"}</Badge>
            <a href={row.link} className="hover:underline">{row.title}</a>
          </div>
          <div className="text-xs text-muted-foreground">{row.location}</div>
        </TableCell>
        <TableCell>
          <Badge className={statusColor(row.status)}>{row.status}</Badge>
        </TableCell>
        <TableCell className="text-right">
          <a href={row.link} className="text-blue-600 text-sm hover:underline">Lihat</a>
        </TableCell>
      </TableRow>
    ))
  }, [error, loading, rows])

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-800">Perbaikan & Inspeksi Prioritas</h3>
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Muat ulang"}
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-200">
              <TableHead className="text-slate-700 font-semibold">Item</TableHead>
              <TableHead className="text-slate-700 font-semibold">Status</TableHead>
              <TableHead className="text-right text-slate-700 font-semibold">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{content}</TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
