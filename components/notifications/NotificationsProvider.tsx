"use client"

import React from "react"

type Notification = {
  id: string
  title: string
  description?: string
  createdAt: string
  read?: boolean
}

type ContextValue = {
  notifications: Notification[]
  addNotification: (n: { title: string; description?: string }) => void
  markRead: (id: string) => void
  clearAll: () => void
  unreadCount: number
}

const NotificationsContext = React.createContext<ContextValue | null>(null)

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = React.useState<Notification[]>([])

  const addNotification = (payload: { title: string; description?: string }) => {
    const n: Notification = {
      id: genId(),
      title: payload.title,
      description: payload.description,
      createdAt: new Date().toISOString(),
      read: false,
    }
    setNotifications((s) => [n, ...s].slice(0, 50))
  }

  const markRead = (id: string) => {
    setNotifications((s) => s.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const clearAll = () => setNotifications([])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationsContext.Provider value={{ notifications, addNotification, markRead, clearAll, unreadCount }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const ctx = React.useContext(NotificationsContext)
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider")
  return ctx
}

export type { Notification }
