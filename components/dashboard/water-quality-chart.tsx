"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { TrendingDown, TrendingUp } from "lucide-react"

const chartData = [
  { month: "Jan", ecoli: 450, diare: 230, safe: 350 },
  { month: "Feb", ecoli: 300, diare: 221, safe: 350 },
  { month: "Mar", ecoli: 200, diare: 229, safe: 350 },
  { month: "Apr", ecoli: 278, diare: 200, safe: 350 },
  { month: "May", ecoli: 189, diare: 220, safe: 350 },
  { month: "Jun", ecoli: 239, diare: 180, safe: 350 },
]

const chartConfig = {
  ecoli: {
    label: "E.Coli (CFU/100ml)",
    color: "hsl(var(--chart-1))",
  },
  diare: {
    label: "Kasus Diare",
    color: "hsl(var(--chart-2))",
  },
  safe: {
    label: "Batas Aman",
    color: "hsl(var(--muted))",
  },
} satisfies ChartConfig

export function WaterQualityChart() {
  const trend = ((chartData[5].ecoli - chartData[0].ecoli) / chartData[0].ecoli * 100).toFixed(1)
  const isDecreasing = Number(trend) < 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Tren Kualitas Air & Kesehatan</span>
          <div className={`flex items-center gap-1 text-sm font-normal ${isDecreasing ? 'text-green-600' : 'text-red-600'}`}>
            {isDecreasing ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
            {Math.abs(Number(trend))}% vs Jan
          </div>
        </CardTitle>
        <CardDescription>
          Monitoring bakteri E.Coli dan korelasi dengan kasus diare
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillEcoli" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-ecoli)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--color-ecoli)" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="fillDiare" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-diare)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--color-diare)" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="safe"
              type="monotone"
              fill="var(--color-safe)"
              fillOpacity={0.2}
              stroke="var(--color-safe)"
              strokeDasharray="5 5"
              strokeWidth={2}
            />
            <Area
              dataKey="ecoli"
              type="monotone"
              fill="url(#fillEcoli)"
              fillOpacity={0.4}
              stroke="var(--color-ecoli)"
              strokeWidth={2}
            />
            <Area
              dataKey="diare"
              type="monotone"
              fill="url(#fillDiare)"
              fillOpacity={0.4}
              stroke="var(--color-diare)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
