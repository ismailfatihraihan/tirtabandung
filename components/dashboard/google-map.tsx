"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Droplet, AlertTriangle, CheckCircle } from "lucide-react"

// Water monitoring points in Bandung area
const monitoringPoints = [
  {
    id: 1,
    name: "Sumur Bor Cibaduyut",
    lat: -6.9575,
    lng: 107.6349,
    status: "safe",
    ph: 7.2,
    turbidity: "Low",
    ecoli: 0,
    district: "Bandung Kidul",
  },
  {
    id: 2,
    name: "Reservoir Dago",
    lat: -6.8564,
    lng: 107.6136,
    status: "safe",
    ph: 7.1,
    turbidity: "Low",
    ecoli: 0,
    district: "Coblong",
  },
  {
    id: 3,
    name: "Instalasi Bojongsoang",
    lat: -6.9841,
    lng: 107.6595,
    status: "warning",
    ph: 6.8,
    turbidity: "Medium",
    ecoli: 45,
    district: "Bandung Kidul",
  },
  {
    id: 4,
    name: "Sumur Sekeloa",
    lat: -6.8948,
    lng: 107.6049,
    status: "critical",
    ph: 6.2,
    turbidity: "High",
    ecoli: 180,
    district: "Coblong",
  },
  {
    id: 5,
    name: "PDAM Kiara Condong",
    lat: -6.9289,
    lng: 107.6546,
    status: "warning",
    ph: 6.9,
    turbidity: "Medium",
    ecoli: 52,
    district: "Batununggal",
  },
]

const statusConfig = {
  safe: { 
    color: "bg-green-500", 
    label: "Aman", 
    icon: CheckCircle,
    textColor: "text-green-700",
    bgLight: "bg-green-50",
    borderColor: "border-green-200"
  },
  warning: { 
    color: "bg-yellow-500", 
    label: "Peringatan", 
    icon: AlertTriangle,
    textColor: "text-yellow-700",
    bgLight: "bg-yellow-50",
    borderColor: "border-yellow-200"
  },
  critical: { 
    color: "bg-red-500", 
    label: "Kritis", 
    icon: AlertTriangle,
    textColor: "text-red-700",
    bgLight: "bg-red-50",
    borderColor: "border-red-200"
  },
}

export function GoogleMapComponent() {
  const [selectedPoint, setSelectedPoint] = useState<typeof monitoringPoints[0] | null>(null)
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)

  // Calculate center of Bandung
  const centerLat = -6.9175
  const centerLng = 107.6191

  // Calculate map bounds
  const latRange = 0.15
  const lngRange = 0.08
  const minLat = centerLat - latRange / 2
  const maxLat = centerLat + latRange / 2
  const minLng = centerLng - lngRange / 2
  const maxLng = centerLng + lngRange / 2

  // Convert lat/lng to SVG coordinates
  const latToY = (lat: number) => {
    return ((maxLat - lat) / (maxLat - minLat)) * 100
  }

  const lngToX = (lng: number) => {
    return ((lng - minLng) / (maxLng - minLng)) * 100
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Peta Distribusi Geografis - Kualitas Air Bandung
          </CardTitle>
          <div className="flex gap-2">
            <div className="flex items-center gap-1 text-xs">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span>Aman</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <span>Peringatan</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <span>Kritis</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          {/* Map Section */}
          <div className="md:col-span-2">
            <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-slate-200 overflow-hidden">
              <svg viewBox="0 0 100 100" className="w-full h-[400px]">
                {/* Background grid */}
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e2e8f0" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#grid)" />

                {/* Bandung city area */}
                <ellipse cx="50" cy="50" rx="35" ry="30" fill="#dbeafe" fillOpacity="0.3" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="2,2" />
                
                {/* District labels */}
                <text x="50" y="25" fontSize="3" fill="#64748b" textAnchor="middle" fontWeight="500">
                  Bandung Utara
                </text>
                <text x="50" y="75" fontSize="3" fill="#64748b" textAnchor="middle" fontWeight="500">
                  Bandung Selatan
                </text>

                {/* Connection lines (optional) */}
                {monitoringPoints.map((point, idx) => {
                  if (idx < monitoringPoints.length - 1) {
                    const nextPoint = monitoringPoints[idx + 1]
                    return (
                      <line
                        key={`line-${point.id}`}
                        x1={lngToX(point.lng)}
                        y1={latToY(point.lat)}
                        x2={lngToX(nextPoint.lng)}
                        y2={latToY(nextPoint.lat)}
                        stroke="#cbd5e1"
                        strokeWidth="0.3"
                        strokeDasharray="1,1"
                        opacity="0.5"
                      />
                    )
                  }
                  return null
                })}

                {/* Monitoring points */}
                {monitoringPoints.map((point) => {
                  const config = statusConfig[point.status as keyof typeof statusConfig]
                  const x = lngToX(point.lng)
                  const y = latToY(point.lat)
                  const isSelected = selectedPoint?.id === point.id
                  const isHovered = hoveredPoint === point.id

                  return (
                    <g key={point.id}>
                      {/* Pulse animation for critical points */}
                      {point.status === "critical" && (
                        <circle cx={x} cy={y} r="4" className={config.color} opacity="0.3">
                          <animate
                            attributeName="r"
                            from="4"
                            to="8"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            from="0.3"
                            to="0"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}

                      {/* Outer ring */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isHovered || isSelected ? "5" : "4"}
                        fill="white"
                        stroke={config.color.replace('bg-', '#')}
                        strokeWidth={isSelected ? "1" : "0.5"}
                        style={{ transition: "all 0.2s" }}
                      />

                      {/* Inner dot */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isHovered || isSelected ? "3.5" : "2.5"}
                        className={config.color}
                        style={{ 
                          cursor: "pointer",
                          transition: "all 0.2s"
                        }}
                        onMouseEnter={() => setHoveredPoint(point.id)}
                        onMouseLeave={() => setHoveredPoint(null)}
                        onClick={() => setSelectedPoint(point)}
                      />

                      {/* Label on hover or select */}
                      {(isHovered || isSelected) && (
                        <g>
                          <rect
                            x={x - 15}
                            y={y - 10}
                            width="30"
                            height="6"
                            fill="white"
                            stroke="#e2e8f0"
                            strokeWidth="0.2"
                            rx="1"
                          />
                          <text
                            x={x}
                            y={y - 6}
                            fontSize="2"
                            fill="#1e293b"
                            textAnchor="middle"
                            fontWeight="600"
                          >
                            {point.name.split(' ')[0]}
                          </text>
                        </g>
                      )}
                    </g>
                  )
                })}
              </svg>
            </div>
          </div>

          {/* Details Panel */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Droplet className="h-4 w-4 text-blue-600" />
              Titik Monitoring ({monitoringPoints.length})
            </h3>
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-2">
              {monitoringPoints.map((point) => {
                const config = statusConfig[point.status as keyof typeof statusConfig]
                const Icon = config.icon
                const isSelected = selectedPoint?.id === point.id

                return (
                  <div
                    key={point.id}
                    onClick={() => setSelectedPoint(point)}
                    onMouseEnter={() => setHoveredPoint(point.id)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected 
                        ? `${config.bgLight} ${config.borderColor}` 
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{point.name}</div>
                        <div className="text-xs text-muted-foreground">{point.district}</div>
                      </div>
                      <Badge className={`${config.color} text-white text-xs`}>
                        {config.label}
                      </Badge>
                    </div>
                    {isSelected && (
                      <div className="mt-2 space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">pH:</span>
                          <span className="font-medium">{point.ph}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Kekeruhan:</span>
                          <span className="font-medium">{point.turbidity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">E.Coli:</span>
                          <span className="font-medium">{point.ecoli} CFU/100ml</span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
