"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "./data-table"
import { InputFormDialog } from "./input-form-dialog"

interface MonitoringDataProps {
  view: "admin" | "officer"
}

export function MonitoringData({ view }: MonitoringDataProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleFormSubmit = () => {
    setDialogOpen(false)
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{view === "admin" ? "Monitoring Data" : "Input Data"}</h1>
          <p className="text-slate-600 mt-2">
            {view === "admin" ? "View all water quality inspections" : "Submit new water quality inspection reports"}
          </p>
        </div>
        {view === "officer" && (
          <Button onClick={() => setDialogOpen(true)} className="gap-2 bg-sky-500 hover:bg-sky-600">
            <Plus className="w-4 h-4" />
            Input Laporan Baru
          </Button>
        )}
      </div>

      {/* Data Table */}
      <DataTable view={view} key={refreshTrigger} />

      {/* Input Form Dialog */}
      {view === "officer" && (
        <InputFormDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleFormSubmit} />
      )}
    </div>
  )
}
