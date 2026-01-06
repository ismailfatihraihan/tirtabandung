"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const getActiveTab = () => {
    if (pathname.startsWith('/water-points')) return 'water-points';
    if (pathname.startsWith('/inspections')) return 'inspections';
    if (pathname.startsWith('/issues')) return 'issues';
    if (pathname.startsWith('/actions')) return 'actions';
    return 'dashboard';
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar activeTab={getActiveTab()} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
