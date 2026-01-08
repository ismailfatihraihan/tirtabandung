"use client"

import { cn } from "@/lib/utils"
import { 
  BarChart3, 
  Droplet, 
  AlertCircle, 
  Activity,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Sidebar() {
  const pathname = usePathname()

  const adminItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, href: "/dashboard" },
    { id: "issues", label: "Laporan Masalah", icon: AlertCircle, href: "/issues" },
    { id: "water-points", label: "Titik Air", icon: Droplet, href: "/water-points" },
    { id: "inspections", label: "Inspeksi", icon: Activity, href: "/inspections" },
  ]

  const items = adminItems

  return (
    <aside className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center">
            <Droplet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">TirtaBandung</h1>
            <p className="text-xs text-slate-500">
              Admin Panel
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

      {/* Admin Badge */}
      <div className="p-4 border-t border-slate-200">
        <div className="px-3 py-2 rounded-lg text-center text-xs font-semibold bg-purple-100 text-purple-700">
          ADMIN PANEL
        </div>
      </div>
    </aside>
  )
}
  