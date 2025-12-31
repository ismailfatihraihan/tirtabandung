"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function ActionsLayout({ children }: { children: React.ReactNode }) {
  const [currentView, setCurrentView] = useState<"admin" | "officer">("admin");
  const [activeTab, setActiveTab] = useState("actions");

  return (
    <div className="flex h-screen">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        activeTab={activeTab}
        onActiveTabChange={setActiveTab}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar currentView={currentView} />
        <main className="flex-1 overflow-y-auto bg-slate-50">{children}</main>
      </div>
    </div>
  );
}
