"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { month: "Jan", ecoli: 450, diare: 230 },
  { month: "Feb", ecoli: 300, diare: 221 },
  { month: "Mar", ecoli: 200, diare: 229 },
  { month: "Apr", ecoli: 278, diare: 200 },
  { month: "May", ecoli: 189, diare: 220 },
  { month: "Jun", ecoli: 239, diare: 229 },
]

export function WaterQualityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Tren Kualitas Air (Bakteri E.Coli)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="ecoli"
              stroke="#0ea5e9"
              dot={{ fill: "#0ea5e9", r: 4 }}
              name="E.Coli (CFU/100ml)"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="diare"
              stroke="#ef4444"
              dot={{ fill: "#ef4444", r: 4 }}
              name="Kasus Diare"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
