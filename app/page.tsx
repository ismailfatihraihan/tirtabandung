"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { Dashboard } from "@/components/dashboard/dashboard"
import { MonitoringData } from "@/components/monitoring/monitoring-data"
import { ActionTracking } from "@/components/actions/action-tracking"
import { SettingsPage } from "@/components/settings/settings-page"

export default function Home() {
  const [currentView, setCurrentView] = useState<"admin" | "officer">("admin")
  const [activeTab, setActiveTab] = useState("dashboard")

  const renderContent = () => {
    if (currentView === "admin") {
      if (activeTab === "dashboard") return <Dashboard />
      if (activeTab === "monitoring") return <MonitoringData view="admin" />
      if (activeTab === "actions") return <ActionTracking />
      if (activeTab === "settings") return <SettingsPage />
    } else {
      if (activeTab === "monitoring") return <MonitoringData view="officer" />
      if (activeTab === "actions") return <ActionTracking />
    }
    return <Dashboard />
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        activeTab={activeTab}
        onActiveTabChange={setActiveTab}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar activeTab={activeTab} />
        <main className="flex-1 overflow-auto p-6">{renderContent()}</main>
      </div>
    </div>
  )
}
