"use client"

import { useEffect, useMemo, useState } from "react"
import { AlertTriangle, CheckCircle, Droplets } from "lucide-react"
import { StatsCard } from "./stats-card"
import { WaterQualityChart } from "./water-quality-chart"
import { ContaminationChart } from "./contamination-chart"
import { MaintenanceTable } from "./maintenance-table"
import { GoogleMapComponent } from "./google-map"

type WaterPointStatus = "Active" | "Under Maintenance" | "Inactive"
type IssueSeverity = "Rendah" | "Sedang" | "Tinggi" | "Kritis"

type WaterPointSummary = {
  total: number
  maintenance: number
  inactive: number
}

type IssueSummary = {
  today: number
  critical: number
}

function formatNumber(n: number) {
  return n.toLocaleString("id-ID")
}

export function Dashboard() {
  const [wpSummary, setWpSummary] = useState<WaterPointSummary>({ total: 0, maintenance: 0, inactive: 0 })
  const [issueSummary, setIssueSummary] = useState<IssueSummary>({ today: 0, critical: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [wpRes, issueRes] = await Promise.all([
          fetch("/api/water-points?includeInactive=true", { cache: "no-store" }),
          fetch("/api/issues", { cache: "no-store" })
        ])

        if (!wpRes.ok || !issueRes.ok) throw new Error("Failed to load stats")

        const wpJson = await wpRes.json()
        const issueJson = await issueRes.json()

        const waterPoints = Array.isArray(wpJson?.data) ? wpJson.data : []
        const issues = Array.isArray(issueJson?.data) ? issueJson.data : []

        const wpTotals = waterPoints.reduce<WaterPointSummary>(
          (acc, wp) => {
            acc.total += 1
            if (wp.status === "Under Maintenance") acc.maintenance += 1
            if (wp.status === "Inactive") acc.inactive += 1
            return acc
          },
          { total: 0, maintenance: 0, inactive: 0 }
        )

        const todayStr = new Date().toISOString().slice(0, 10)
        const issueTotals = issues.reduce<IssueSummary>(
          (acc, issue) => {
            const created = issue.created_at ? new Date(issue.created_at).toISOString().slice(0, 10) : null
            if (created === todayStr) acc.today += 1
            if (issue.severity === "Kritis") acc.critical += 1
            return acc
          },
          { today: 0, critical: 0 }
        )

        setWpSummary(wpTotals)
        setIssueSummary(issueTotals)
      } catch (err) {
        console.error("dashboard stats error", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = useMemo(() => {
    return [
      {
        title: "Total Titik Pantau",
        value: loading ? "..." : formatNumber(wpSummary.total),
        subtitle: "Monitoring points terdaftar",
        icon: Droplets,
        color: "blue" as const
      },
      {
        title: "Isu Kritis (Severity)",
        value: loading ? "..." : formatNumber(issueSummary.critical),
        subtitle: "Butuh respons cepat",
        icon: AlertTriangle,
        color: "red" as const
      },
      {
        title: "Titik Non-Aktif/Maint.",
        value: loading ? "..." : formatNumber(wpSummary.inactive + wpSummary.maintenance),
        subtitle: "Offline atau sedang perawatan",
        icon: Droplets,
        color: "blue" as const
      },
      {
        title: "Laporan Masuk Hari Ini",
        value: loading ? "..." : formatNumber(issueSummary.today),
        subtitle: "Laporan baru (24 jam)",
        icon: CheckCircle,
        color: "green" as const
      }
    ]
  }, [issueSummary.critical, issueSummary.today, loading, wpSummary.inactive, wpSummary.maintenance, wpSummary.total])

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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <StatsCard
              key={card.title}
              title={card.title}
              value={card.value}
              subtitle={card.subtitle}
              icon={card.icon}
              color={card.color}
            />
          ))}
        </div>
      </div>

      {/* Google Maps Card */}
      <div>
        <GoogleMapComponent />
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
