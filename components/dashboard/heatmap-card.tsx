import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function HeatmapCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Geographic Distribution - Water Quality Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-64 bg-gradient-to-br from-green-100 via-yellow-100 to-red-100 rounded-lg flex items-center justify-center relative overflow-hidden">
          {/* Heatmap visualization placeholder */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none">
            {/* Safe zone - Dago (Green) */}
            <circle cx="300" cy="100" r="60" fill="#22c55e" opacity="0.6" />
            <text x="300" y="105" textAnchor="middle" className="text-xs" fill="#ffffff" fontWeight="bold">
              Dago
            </text>

            {/* Warning zone - Center */}
            <circle cx="200" cy="150" r="50" fill="#eab308" opacity="0.6" />
            <text x="200" y="155" textAnchor="middle" className="text-xs" fill="#ffffff" fontWeight="bold">
              Center
            </text>

            {/* Critical zone - Dayeuhkolot (Red) */}
            <circle cx="100" cy="120" r="70" fill="#ef4444" opacity="0.6" />
            <text x="100" y="125" textAnchor="middle" className="text-xs" fill="#ffffff" fontWeight="bold">
              Dayeuhkolot
            </text>
          </svg>

          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-white rounded-lg p-3 shadow-md space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs font-medium text-slate-700">Safe</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-xs font-medium text-slate-700">Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs font-medium text-slate-700">Critical</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
