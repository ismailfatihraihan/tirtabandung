import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const maintenanceData = [
  {
    id: 1,
    lokasi: "Sumur Bor Coblong",
    status: "Rusak Ringan",
    estimasi: "5 hari",
    priority: "medium",
  },
  {
    id: 2,
    lokasi: "Pompa PDAM Cibeunying",
    status: "Rusak Berat",
    estimasi: "10 hari",
    priority: "high",
  },
  {
    id: 3,
    lokasi: "Mata Air Ciburial",
    status: "Terawat",
    estimasi: "Tidak ada",
    priority: "low",
  },
]

export function MaintenanceTable() {
  const getStatusBadge = (status: string) => {
    if (status.includes("Rusak Berat")) return <Badge variant="destructive">{status}</Badge>
    if (status.includes("Rusak Ringan")) return <Badge variant="secondary">{status}</Badge>
    return (
      <Badge variant="default" className="bg-green-500">
        {status}
      </Badge>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-200">
              <TableHead className="text-slate-700 font-semibold">Lokasi</TableHead>
              <TableHead className="text-slate-700 font-semibold">Status</TableHead>
              <TableHead className="text-slate-700 font-semibold">Estimasi Perbaikan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {maintenanceData.map((item) => (
              <TableRow key={item.id} className="border-b border-slate-100">
                <TableCell className="text-slate-900 font-medium">{item.lokasi}</TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell className="text-slate-600">{item.estimasi}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
