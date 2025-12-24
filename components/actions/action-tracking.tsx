"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, Loader } from "lucide-react"

interface Action {
  id: string
  title: string
  priority: "CRITICAL" | "HIGH" | "MEDIUM"
  status: "open" | "in-progress" | "resolved"
  location: string
  assignedTo: string
  createdDate: string
  dueDate: string
}

const actionData: Action[] = [
  {
    id: "ACT-001",
    title: "Kontaminasi E.Coli Tinggi - Dayeuhkolot",
    priority: "CRITICAL",
    status: "open",
    location: "Sumur Bor Komunal - Cibaduyut",
    assignedTo: "Tim Unit Reaksi Cepat",
    createdDate: "2025-12-23",
    dueDate: "2025-12-25",
  },
  {
    id: "ACT-002",
    title: "Kebocoran Pipa PDAM - Bojongsoang",
    priority: "HIGH",
    status: "in-progress",
    location: "Pipa PDAM - Bojongsoang",
    assignedTo: "Tim Maintenance PDAM",
    createdDate: "2025-12-21",
    dueDate: "2025-12-28",
  },
  {
    id: "ACT-003",
    title: "Perlu Maintenance - Pompa Komunal",
    priority: "MEDIUM",
    status: "in-progress",
    location: "Pompa Komunal - Kiara Condong",
    assignedTo: "Teknisi Lokal",
    createdDate: "2025-12-20",
    dueDate: "2025-12-30",
  },
  {
    id: "ACT-004",
    title: "Pembersihan Sumur Warga - Sekeloa",
    priority: "HIGH",
    status: "resolved",
    location: "Sumur Warga RT 05 - Sekeloa",
    assignedTo: "Tim Unit Reaksi Cepat",
    createdDate: "2025-12-15",
    dueDate: "2025-12-22",
  },
]

export function ActionTracking() {
  const [selectedTab, setSelectedTab] = useState<"open" | "in-progress" | "resolved">("open")

  const getPriorityColor = (priority: string) => {
    if (priority === "CRITICAL") return "#ef4444"
    if (priority === "HIGH") return "#f97316"
    return "#eab308"
  }

  const getPriorityBadge = (priority: string) => {
    if (priority === "CRITICAL") return <Badge variant="destructive">{priority}</Badge>
    if (priority === "HIGH") return <Badge variant="secondary">{priority}</Badge>
    return <Badge>{priority}</Badge>
  }

  const tabs = [
    { id: "open" as const, label: "Open/Dispatching", count: 1 },
    { id: "in-progress" as const, label: "In Progress", count: 2 },
    { id: "resolved" as const, label: "Resolved", count: 1 },
  ]

  const filteredActions = actionData.filter((action) => action.status === selectedTab)

  const getStatusIcon = (status: string) => {
    if (status === "open") return <AlertCircle className="w-5 h-5 text-red-500" />
    if (status === "in-progress") return <Loader className="w-5 h-5 text-yellow-500" />
    return <CheckCircle className="w-5 h-5 text-green-500" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Action Tracking System</h1>
        <p className="text-slate-600 mt-2">Monitor and manage water quality issues and maintenance tasks</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              selectedTab === tab.id
                ? "border-sky-500 text-sky-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab.label}
            <span className="ml-2 bg-slate-200 text-slate-700 px-2 py-1 rounded text-xs font-semibold">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Action Cards */}
      <div className="grid gap-4">
        {filteredActions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-slate-500">No actions in this status</p>
            </CardContent>
          </Card>
        ) : (
          filteredActions.map((action) => (
            <Card key={action.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Status Icon */}
                  <div className="flex-shrink-0 pt-1">{getStatusIcon(action.status)}</div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
                            {action.id}
                          </span>
                          {getPriorityBadge(action.priority)}
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 break-words">{action.title}</h3>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-slate-600 font-medium">Lokasi</p>
                        <p className="text-slate-900">{action.location}</p>
                      </div>
                      <div>
                        <p className="text-slate-600 font-medium">Ditugaskan Ke</p>
                        <p className="text-slate-900">{action.assignedTo}</p>
                      </div>
                      <div>
                        <p className="text-slate-600 font-medium">Dibuat</p>
                        <p className="text-slate-900">{action.createdDate}</p>
                      </div>
                      <div>
                        <p className="text-slate-600 font-medium">Target Selesai</p>
                        <p className="text-slate-900">{action.dueDate}</p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button variant="outline" size="sm" className="text-sky-600 hover:text-sky-700 bg-transparent">
                      Update Progress
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
