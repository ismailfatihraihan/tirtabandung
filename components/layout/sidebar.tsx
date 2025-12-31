"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { 
  BarChart3, 
  Droplet, 
  AlertCircle, 
  Settings, 
  Users, 
  FileText, 
  Activity,
  ClipboardCheck,
  MapPin
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Sidebar() {
  const pathname = usePathname()
  const [userRole, setUserRole] = useState<"admin" | "officer">("officer")

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      setUserRole(user.role)
    }
  }, [])

  const adminItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, href: "/dashboard" },
    { id: "water-points", label: "Titik Sumber Air", icon: Droplet, href: "/water-points" },
    { id: "inspections", label: "Data Inspeksi", icon: Activity, href: "/inspections" },
    { id: "issues", label: "Laporan Masalah", icon: AlertCircle, href: "/issues" },
    { id: "actions", label: "Action Tracking", icon: FileText, href: "/actions" },
    { id: "users", label: "Manajemen User", icon: Users, href: "/users" },
  ]

  const officerItems = [
    { id: "my-tasks", label: "Tugas Saya", icon: ClipboardCheck, href: "/my-tasks" },
    { id: "water-points", label: "Lokasi Saya", icon: MapPin, href: "/water-points" },
    { id: "inspections", label: "Input Inspeksi", icon: Activity, href: "/inspections/new" },
    { id: "issues", label: "Lapor Masalah", icon: AlertCircle, href: "/issues/new" },
  ]

  const items = userRole === "admin" ? adminItems : officerItems

  return (
    <aside className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200">
        <Link href={userRole === "admin" ? "/dashboard" : "/my-tasks"} className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center">
            <Droplet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">TirtaBandung</h1>
            <p className="text-xs text-slate-500">
              {userRole === "admin" ? "Admin Panel" : "Officer Portal"}
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-colors",
                isActive 
                  ? "bg-sky-500 text-white shadow-md" 
                  : "text-slate-700 hover:bg-slate-200 hover:text-slate-900",
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Role Badge */}
      <div className="p-4 border-t border-slate-200">
        <div className={cn(
          "px-3 py-2 rounded-lg text-center text-xs font-semibold",
          userRole === "admin" 
            ? "bg-purple-100 text-purple-700" 
            : "bg-blue-100 text-blue-700"
        )}>
          {userRole === "admin" ? "🛡️ ADMIN PUSAT" : "👷 PETUGAS LAPANGAN"}
        </div>
      </div>
    </aside>
  )
}
  