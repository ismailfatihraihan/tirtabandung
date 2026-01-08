"use client"

import React from "react"
import { Bell, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu"
import { useNotifications } from "@/components/notifications/NotificationsProvider"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"

export function NotificationsDropdown() {
  const { notifications, unreadCount, markRead, clearAll } = useNotifications()
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-slate-600" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 -mt-0.5 -mr-0.5 w-3 h-3 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-2">
        <div className="flex items-center justify-between px-2 py-1">
          <strong>Notifikasi</strong>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => clearAll()}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="max-h-64 overflow-auto">
          {notifications.length === 0 && (
            <div className="p-4 text-sm text-muted-foreground">Belum ada notifikasi</div>
          )}

          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-2 rounded-md cursor-pointer hover:bg-slate-50 flex items-start gap-2 ${n.read ? '' : 'bg-slate-50'}`}
              onClick={() => {
                markRead(n.id)
                // Optionally navigate - here we just close dropdown by routing to current page
                // If notification should link, include url in payload in future
              }}
            >
              <div className="flex-shrink-0 mt-1">
                <Check className="w-4 h-4 text-slate-500" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{n.title}</div>
                {n.description && <div className="text-xs text-muted-foreground">{n.description}</div>}
                <div className="text-[11px] text-muted-foreground mt-1">{formatDistanceToNow(new Date(n.createdAt))} ago</div>
              </div>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
