"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import { Factory, Home, Trash2 } from "lucide-react"

const chartData = [
  { 
    category: "Limbah\nDomestik", 
    value: 65, 
    fill: "hsl(var(--chart-1))",
    icon: "home"
  },
  { 
    category: "Limbah\nIndustri", 
    value: 28, 
    fill: "hsl(var(--chart-2))",
    icon: "factory"
  },
  { 
    category: "Sampah\nFisik", 
    value: 7, 
    fill: "hsl(var(--chart-3))",
    icon: "trash"
  },
]

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribusi Sumber Pencemaran</CardTitle>
        <CardDescription>
          Analisis penyebab pencemaran air utama di Bandung
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 30 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-muted" />
            <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              width={80}
              className="text-xs"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" radius={[0, 8, 8, 0]}>
              <LabelList
                dataKey="value"
                position="right"
                formatter={(value: number) => `${value}%`}
                className="fill-foreground font-semibold"
              />
            </Bar>
          </BarChart>
        </ChartContainer>
        <div className="mt-4 grid grid-cols-3 gap-4">
          {chartData.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap]
            return (
              <div key={item.category} className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/50">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <div className="text-center">
                  <div className="text-2xl font-bold">{item.value}%</div>
                  <div className="text-xs text-muted-foreground">{item.category.replace('\n', ' ')}</div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
