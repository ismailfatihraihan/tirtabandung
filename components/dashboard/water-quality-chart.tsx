"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, ComposedChart, CartesianGrid, Line, ReferenceLine, XAxis, YAxis } from "recharts"
import { Loader2 } from "lucide-react"

type ChartRow = {
  month: string
  turbidity: number
  ecoli: number
  safe: number
  count: number
}

const SAFE_TURBIDITY = 5 // NTU, panduan umum

const chartConfig = {
  turbidity: {
    label: "Kekeruhan (NTU)",
    color: "hsl(var(--chart-1))",
  },
  ecoli: {
    label: "E.Coli (CFU/100ml)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function WaterQualityChart() {
  const [data, setData] = useState<ChartRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInspections = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch("/api/inspections", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to fetch inspections")
        const json = await res.json()
        const list = Array.isArray(json?.data) ? json.data : []

        const buckets = new Map<string, { turbidity: number; ecoli: number; count: number }>()
        list.forEach((item: any) => {
          const d = item.date ? new Date(item.date) : null
          if (!d || Number.isNaN(d.getTime())) return
          const key = `${d.getFullYear()}-${d.getMonth()}`
          const bucket = buckets.get(key) || { turbidity: 0, ecoli: 0, count: 0 }
          bucket.turbidity += Number(item.parameters?.turbidity ?? 0)
          bucket.ecoli += Number(item.parameters?.ecoli ?? 0)
          bucket.count += 1
          buckets.set(key, bucket)
        })

        // keep last 6 months sorted ascending
        const sortedKeys = Array.from(buckets.keys()).sort((a, b) => {
          const [ay, am] = a.split("-").map(Number)
          const [by, bm] = b.split("-").map(Number)
          return ay === by ? am - bm : ay - by
        }).slice(-6)

        const rows: ChartRow[] = sortedKeys.map((key) => {
          const [y, m] = key.split("-").map(Number)
          const bucket = buckets.get(key)!
          return {
            month: new Date(y, m, 1).toLocaleDateString("id-ID", { month: "short" }),
            turbidity: bucket.count ? Number((bucket.turbidity / bucket.count).toFixed(2)) : 0,
            ecoli: bucket.count ? Number((bucket.ecoli / bucket.count).toFixed(2)) : 0,
            safe: SAFE_TURBIDITY,
            count: bucket.count
          }
        })

        setData(rows)
      } catch (err) {
        console.error("water-quality chart error", err)
        setError("Gagal memuat data inspeksi")
      } finally {
        setLoading(false)
      }
    }

    fetchInspections()
  }, [])

  const trendText = useMemo(() => {
    if (data.length < 2) return null
    const first = data[0].turbidity
    const last = data[data.length - 1].turbidity
    if (first === 0) return null
    const delta = ((last - first) / first) * 100
    return `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}% kekeruhan vs awal`}
  , [data])

  const sampleInfo = useMemo(() => {
    if (!data.length) return null
    const total = data.reduce((acc, row) => acc + row.count, 0)
    const avg = total / data.length
    return `${total} sampel (${avg.toFixed(1)}/bulan)`
  }, [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Tren Kualitas Air</span>
          <div className="text-xs text-muted-foreground">Rata-rata bulanan (maks 6 bulan)</div>
        </CardTitle>
        <CardDescription>
          Kekeruhan & E.Coli berbasis hasil inspeksi lapangan
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Memuat data...</div>
        ) : error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : data.length === 0 ? (
          <div className="text-sm text-muted-foreground">Belum ada data inspeksi untuk ditampilkan.</div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ComposedChart data={data}>
              <defs>
                <linearGradient id="fillTurbidity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-turbidity)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--color-turbidity)" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
              <YAxis
                yAxisId="left"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs"
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                yAxisId="left"
                dataKey="turbidity"
                type="monotone"
                fill="url(#fillTurbidity)"
                fillOpacity={0.4}
                stroke="var(--color-turbidity)"
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="ecoli"
                stroke="var(--color-ecoli)"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <ReferenceLine yAxisId="right" y={100} stroke="#ef4444" strokeDasharray="4 4" label="Batas Aman" />
            </ComposedChart>
          </ChartContainer>
        )}
        {trendText && !loading && !error && data.length > 0 && (
          <div className="mt-3 text-xs text-muted-foreground">{trendText}</div>
        )}
        {sampleInfo && !loading && !error && data.length > 0 && (
          <div className="text-xs text-muted-foreground">{sampleInfo}</div>
        )}
      </CardContent>
    </Card>
  )
}
