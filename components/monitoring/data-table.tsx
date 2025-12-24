import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

interface DataTableProps {
  view: "admin" | "officer"
}

const waterPoints = [
  {
    id: "WP-001",
    location: "Sumur Bor Komunal - Cibaduyut",
    type: "Sumur",
    status: "UNSAFE",
    lastInspection: "2025-12-23",
    inspector: "Kader Budi",
    issue: "Limbah Industri Sepatu",
  },
  {
    id: "WP-002",
    location: "Mata Air Ciburial - Dago",
    type: "Mata Air",
    status: "SAFE",
    lastInspection: "2025-12-22",
    inspector: "Kader Siti",
    issue: "None",
  },
  {
    id: "WP-003",
    location: "Pipa PDAM - Bojongsoang",
    type: "PDAM",
    status: "WARNING",
    lastInspection: "2025-12-21",
    inspector: "Kader Ahmad",
    issue: "Kebocoran Pipa Kecil",
  },
  {
    id: "WP-004",
    location: "Sumur Warga RT 05 - Sekeloa",
    type: "Sumur",
    status: "SAFE",
    lastInspection: "2025-12-23",
    inspector: "Kader Budi",
    issue: "None",
  },
  {
    id: "WP-005",
    location: "Pompa Komunal - Kiara Condong",
    type: "Pompa",
    status: "WARNING",
    lastInspection: "2025-12-20",
    inspector: "Kader Rahmat",
    issue: "Perlu Maintenance",
  },
]

export function DataTable({ view }: DataTableProps) {
  const getStatusBadge = (status: string) => {
    if (status === "UNSAFE") return <Badge variant="destructive">{status}</Badge>
    if (status === "WARNING") return <Badge variant="secondary">{status}</Badge>
    return (
      <Badge variant="default" className="bg-green-500">
        {status}
      </Badge>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-200">
                <TableHead className="text-slate-700 font-semibold">ID</TableHead>
                <TableHead className="text-slate-700 font-semibold">Lokasi</TableHead>
                <TableHead className="text-slate-700 font-semibold">Tipe</TableHead>
                <TableHead className="text-slate-700 font-semibold">Status</TableHead>
                <TableHead className="text-slate-700 font-semibold">Tanggal Inspeksi</TableHead>
                <TableHead className="text-slate-700 font-semibold">Masalah</TableHead>
                {view === "admin" && <TableHead className="text-slate-700 font-semibold">Inspektur</TableHead>}
                <TableHead className="text-slate-700 font-semibold">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {waterPoints.map((point) => (
                <TableRow key={point.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <TableCell className="text-slate-600 text-sm font-mono">{point.id}</TableCell>
                  <TableCell className="text-slate-900 font-medium max-w-xs">{point.location}</TableCell>
                  <TableCell className="text-slate-600 text-sm">{point.type}</TableCell>
                  <TableCell>{getStatusBadge(point.status)}</TableCell>
                  <TableCell className="text-slate-600 text-sm">{point.lastInspection}</TableCell>
                  <TableCell className="text-slate-600 text-sm">{point.issue}</TableCell>
                  {view === "admin" && <TableCell className="text-slate-600 text-sm">{point.inspector}</TableCell>}
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-sky-600 hover:text-sky-700">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
