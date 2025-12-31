"use client"

import { Bell, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserNav } from "./user-nav"

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
        <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
          <Clock className="w-4 h-4" />
          Last updated: Today at 14:32
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
        <UserNav />
      </div>
    </div>
  )
}
