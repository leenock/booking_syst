"use client";

import { useState } from "react";
import AdminSidebar from "@/app/components/admin/AdminSidebar";
import AdminDashboardOverview from "@/app/components/admin/AdminDashboardOverview";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar isOpen={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
      
      {/* Main Content */}
      <main className="md:ml-64 transition-all duration-300">
        <div className="min-h-screen">
          {children || <AdminDashboardOverview />}
        </div>
      </main>
    </div>
  );
} 