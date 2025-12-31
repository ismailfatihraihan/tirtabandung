"use client"

import { AlertTriangle, CheckCircle, Droplets } from "lucide-react"
import { StatsCard } from "./stats-card"
import { WaterQualityChart } from "./water-quality-chart"
import { ContaminationChart } from "./contamination-chart"
import { MaintenanceTable } from "./maintenance-table"
import { LeafletMap } from "./leaflet-map"

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Decision Support System</h1>
        <p className="text-slate-600 mt-2">Real-time monitoring of water quality and sanitation infrastructure</p>
      </div>

      {/* Operational Panel - Stats Cards */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Operational Status</h2>
        <div className="grid grid-cols-3 gap-4">
          <StatsCard
            title="Total Titik Pantau"
            value="1,240"
            subtitle="Active monitoring points"
            icon={Droplets}
            color="blue"
          />
          <StatsCard
            title="Status KRITIS/UNSAFE"
            value="12"
            subtitle="Urgent action required"
            icon={AlertTriangle}
            color="red"
          />
          <StatsCard
            title="Laporan Masuk Hari Ini"
            value="5"
            subtitle="New reports today"
            icon={CheckCircle}
            color="green"
          />
        </div>
      </div>

      {/* Heatmap Card */}
      <div>
        <LeafletMap />
      </div>

      {/* Scientific & Health Panel */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Scientific & Health Analysis</h2>
        <div className="grid grid-cols-2 gap-4">
          <WaterQualityChart />
          <ContaminationChart />
        </div>
      </div>

      {/* Maintenance Panel */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Infrastructure Maintenance</h2>
        <MaintenanceTable />
      </div>
    </div>
  )
}

export default Dashboard
