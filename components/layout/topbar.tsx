"use client"

import { Button } from "@/components/ui/button"
import { UserNav } from "./user-nav"
import { NotificationsDropdown } from "./notifications-dropdown"

interface TopbarProps {
  activeTab: string
}

const tabTitles: Record<string, string> = {
  dashboard: "Dashboard",
  monitoring: "Monitoring Data",
  actions: "Action Tracking",
  settings: "System Settings",
}

export function Topbar({ activeTab }: TopbarProps) {
  const title = tabTitles[activeTab] || "Dashboard"

  return (
    <div className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      </div>
      <div className="flex items-center gap-4">
        <NotificationsDropdown />
        <UserNav />
      </div>
    </div>
  )
}
