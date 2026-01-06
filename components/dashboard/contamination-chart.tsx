"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts"
import { Factory, Home, Trash2, Loader2 } from "lucide-react"

type ChartRow = { category: string; open: number; resolved: number; icon: "home" | "factory" | "trash" }

const chartConfig = {
  value: {
    label: "Persentase",
  },
} satisfies ChartConfig

const iconMap = {
  home: Home,
  factory: Factory,
  trash: Trash2,
}

export function ContaminationChart() {
  const [data, setData] = useState<ChartRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch("/api/issues", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to fetch issues")
        const json = await res.json()
        const list = Array.isArray(json?.data) ? json.data : []

        const counts: Record<string, { open: number; resolved: number }> = {
          "Kerusakan Fisik": { open: 0, resolved: 0 },
          "Kualitas Air": { open: 0, resolved: 0 },
          "Operasional": { open: 0, resolved: 0 },
          "Lainnya": { open: 0, resolved: 0 },
        }

        list.forEach((issue: any) => {
          if (!counts[issue.category]) return
          const isResolved = issue.status === "Selesai"
          counts[issue.category][isResolved ? "resolved" : "open"] += 1
        })

        const rows: ChartRow[] = [
          { category: "Kualitas Air", open: counts["Kualitas Air"].open, resolved: counts["Kualitas Air"].resolved, icon: "home" },
          { category: "Operasional", open: counts["Operasional"].open, resolved: counts["Operasional"].resolved, icon: "factory" },
          { category: "Kerusakan Fisik", open: counts["Kerusakan Fisik"].open, resolved: counts["Kerusakan Fisik"].resolved, icon: "trash" },
          { category: "Lainnya", open: counts["Lainnya"].open, resolved: counts["Lainnya"].resolved, icon: "home" },
        ]

        setData(rows)
      } catch (err) {
        console.error("contamination chart error", err)
        setError("Gagal memuat data isu")
      } finally {
        setLoading(false)
      }
    }

    fetchIssues()
  }, [])

  const bars = useMemo(() => data, [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribusi Kategori Isu</CardTitle>
        <CardDescription>
          Komposisi laporan berdasarkan kategori masalah
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Memuat data...</div>
        ) : error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : bars.length === 0 ? (
          <div className="text-sm text-muted-foreground">Belum ada data isu untuk divisualisasikan.</div>
        ) : (
          <>
            <ChartContainer config={chartConfig} className="h-[320px] w-full">
              <BarChart data={bars} layout="vertical" margin={{ left: 0, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-muted" />
                <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis
                  dataKey="category"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  width={110}
                  className="text-xs"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend payload={[
                  { value: 'Open/Unsafe', type: 'square', color: '#ef4444' },
                  { value: 'Resolved/Safe', type: 'square', color: '#22c55e' },
                ]} />
                <Bar dataKey="open" stackId="status" fill="#ef4444" name="Open/Unsafe" radius={[0, 0, 0, 0]} />
                <Bar dataKey="resolved" stackId="status" fill="#22c55e" name="Resolved/Safe" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ChartContainer>
          </>
        )}
      </CardContent>
    </Card>
  )
}
