"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [currentView, setCurrentView] = useState<"admin" | "officer">("admin");
  
  // Determine active tab from pathname
  const getActiveTab = () => {
    if (pathname.startsWith('/water-points')) return 'water-points';
    if (pathname.startsWith('/inspections')) return 'inspections';
    if (pathname.startsWith('/issues')) return 'issues';
    if (pathname.startsWith('/actions')) return 'actions';
    if (pathname.startsWith('/users')) return 'users';
    return 'dashboard';
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        activeTab={getActiveTab()}
        onActiveTabChange={() => {}} // Navigation handled by Next.js router
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar activeTab={getActiveTab()} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
