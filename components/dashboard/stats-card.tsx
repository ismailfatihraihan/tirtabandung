import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  subtitle: string
  icon: LucideIcon
  color: "blue" | "red" | "green"
}

export function StatsCard({ title, value, subtitle, icon: Icon, color }: StatsCardProps) {
  const colorClasses = {
    blue: "bg-sky-50 text-sky-600 border-sky-200",
    red: "bg-red-50 text-red-600 border-red-200",
    green: "bg-green-50 text-green-600 border-green-200",
  }

  const textClasses = {
    blue: "text-sky-900",
    red: "text-red-900",
    green: "text-green-900",
  }

  return (
    <Card className={cn("border", colorClasses[color])}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-600 mb-2">{title}</p>
            <p className={cn("text-3xl font-bold", textClasses[color])}>{value}</p>
            <p className="text-xs text-slate-500 mt-2">{subtitle}</p>
          </div>
          <div className={cn("p-2 rounded-lg", colorClasses[color])}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
