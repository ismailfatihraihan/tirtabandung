"use client"
import { cn } from "@/lib/utils"
import { BarChart3, Droplet, AlertCircle, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  currentView: "admin" | "officer"
  onViewChange: (view: "admin" | "officer") => void
  activeTab: string
  onActiveTabChange: (tab: string) => void
}

export function Sidebar({ currentView, onViewChange, activeTab, onActiveTabChange }: SidebarProps) {
  const adminItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "monitoring", label: "Monitoring Data", icon: Droplet },
    { id: "actions", label: "Action Tracking", icon: AlertCircle },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const officerItems = [
    { id: "monitoring", label: "Input Data", icon: Droplet },
    { id: "actions", label: "My Actions", icon: AlertCircle },
  ]

  const items = currentView === "admin" ? adminItems : officerItems

  return (
    <aside className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center">
            <Droplet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">TirtaBandung</h1>
            <p className="text-xs text-slate-500">Water Quality System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onActiveTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-colors",
                activeTab === item.id ? "bg-sky-500 text-white" : "text-slate-700 hover:bg-slate-200",
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Role Switcher */}
      <div className="p-4 border-t border-slate-200 space-y-3">
        <p className="text-xs font-semibold text-slate-600 uppercase">View as</p>
        <div className="flex gap-2">
          <Button
            variant={currentView === "admin" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              onViewChange("admin")
              onActiveTabChange("dashboard")
            }}
            className="flex-1 text-xs"
          >
            Admin
          </Button>
          <Button
            variant={currentView === "officer" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              onViewChange("officer")
              onActiveTabChange("monitoring")
            }}
            className="flex-1 text-xs"
          >
            Officer
          </Button>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-200 mb-3">
          <div className="w-10 h-10 bg-sky-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-sky-700">KB</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">Kader Budi</p>
            <p className="text-xs text-slate-500">{currentView === "admin" ? "Admin" : "Field Officer"}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="w-full justify-start text-slate-700 hover:text-slate-900">
          <LogOut className="w-4 h-4 mr-2" />
          <span className="text-xs">Logout</span>
        </Button>
      </div>
    </aside>
  )
}
