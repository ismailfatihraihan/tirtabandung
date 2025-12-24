"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Water monitoring points in Bandung area with relative positions
const monitoringPoints = [
  {
    name: "Cibaduyut",
    x: 45,
    y: 65,
    status: "safe",
    ph: 7.2,
    turbidity: "Low",
    district: "Bandung Wetan",
  },
  {
    name: "Dago",
    x: 50,
    y: 35,
    status: "safe",
    ph: 7.1,
    turbidity: "Low",
    district: "Bandung Utara",
  },
  {
    name: "Bojongsoang",
    x: 65,
    y: 70,
    status: "warning",
    ph: 6.8,
    turbidity: "Medium",
    district: "Rancasari",
  },
  {
    name: "Sekeloa",
    x: 35,
    y: 55,
    status: "critical",
    ph: 6.2,
    turbidity: "High",
    district: "Bandung Barat",
  },
  {
    name: "Kiara Condong",
    x: 55,
    y: 45,
    status: "warning",
    ph: 6.9,
    turbidity: "Medium",
    district: "Bandung Tengah",
  },
]

const statusColors = {
  safe: { bg: "#22c55e", border: "#16a34a", label: "Safe" },
  warning: { bg: "#eab308", border: "#ca8a04", label: "Warning" },
  critical: { bg: "#ef4444", border: "#dc2626", label: "Critical" },
}

export function LeafletMap() {
  const [selectedPoint, setSelectedPoint] = useState<(typeof monitoringPoints)[0] | null>(null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Geographic Distribution - Bandung Water Quality Map</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
          <svg viewBox="0 0 100 100" className="w-full h-96" style={{ backgroundColor: "#f1f5f9" }}>
            {/* Bandung city boundary outline */}
            <path d="M 20 20 L 80 20 L 80 80 L 20 80 Z" fill="none" stroke="#cbd5e1" strokeWidth="0.5" />

            {/* District labels */}
            <text x="30" y="30" fontSize="2" fill="#94a3b8" textAnchor="start">
              Bandung Utara
            </text>
            <text x="25" y="65" fontSize="2" fill="#94a3b8" textAnchor="start">
              Bandung Barat
            </text>
            <text x="60" y="30" fontSize="2" fill="#94a3b8" textAnchor="start">
              Bandung Timur
            </text>
            <text x="55" y="65" fontSize="2" fill="#94a3b8" textAnchor="start">
              Bandung Tengah
            </text>

            {/* Monitoring points */}
            {monitoringPoints.map((point) => {
              const color = statusColors[point.status as keyof typeof statusColors]
              return (
                <g key={point.name}>
                  {/* Outer ring for emphasis */}
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="3.5"
                    fill="none"
                    stroke={color.border}
                    strokeWidth="0.3"
                    opacity="0.5"
                  />
                  {/* Main marker */}
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="2.5"
                    fill={color.bg}
                    stroke="white"
                    strokeWidth="0.4"
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedPoint(point)}
                  />
                  {/* Label */}
                  <text
                    x={point.x}
                    y={point.y - 4}
                    fontSize="1.2"
                    fill="#1e293b"
                    textAnchor="middle"
                    fontWeight="bold"
                    pointerEvents="none"
                  >
                    {point.name}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {selectedPoint && (
          <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-lg">{selectedPoint.name}</h3>
                <p className="text-sm text-slate-600 mb-3">{selectedPoint.district}</p>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-600">Status</p>
                    <p className="font-semibold flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor: statusColors[selectedPoint.status as keyof typeof statusColors].bg,
                        }}
                      ></span>
                      {statusColors[selectedPoint.status as keyof typeof statusColors].label}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-600">pH Level</p>
                    <p className="font-semibold">{selectedPoint.ph}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Turbidity</p>
                    <p className="font-semibold">{selectedPoint.turbidity}</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedPoint(null)} className="text-slate-400 hover:text-slate-600 text-lg">
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="grid grid-cols-3 gap-4 pt-2">
          {Object.entries(statusColors).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border-2"
                style={{
                  backgroundColor: value.bg,
                  borderColor: value.border,
                }}
              ></div>
              <span className="text-sm font-medium text-slate-700">{value.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
