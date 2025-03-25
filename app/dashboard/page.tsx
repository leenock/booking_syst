"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/app/components/user/Sidebar";
import DashboardOverview from "@/app/components/user/DashboardOverview";
import NotificationsList from "@/app/components/user/NotificationsList";
import UserSettings from "@/app/components/user/UserSettings";
import { CalendarDays, CreditCard, Hotel, Users } from "lucide-react";

export default function DashboardPage() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock data for statistics
  const stats = [
    {
      label: "Active Bookings",
      value: "3",
      icon: CalendarDays,
      change: "+2 from last month",
      trend: "up",
    },
    {
      label: "Total Spent",
      value: "$2,850",
      icon: CreditCard,
      change: "+$1,200 from last month",
      trend: "up",
    },
    {
      label: "Nights Stayed",
      value: "12",
      icon: Hotel,
      change: "+5 from last month",
      trend: "up",
    },
    {
      label: "Guest Count",
      value: "8",
      icon: Users,
      change: "+3 from last month",
      trend: "up",
    },
  ];

  const renderContent = () => {
    switch (pathname) {
      case "/dashboard/notifications":
        return <NotificationsList />;
      case "/dashboard/settings":
        return <UserSettings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50 flex">
      <Sidebar isOpen={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen} />

      <div
        className={`
        flex-1 transition-all duration-300 ease-in-out
        md:ml-64 relative w-full
        ${
          isMobileMenuOpen
            ? "opacity-50 blur-sm pointer-events-none scale-98"
            : "scale-100"
        }
      `}
      >
        {/* Sticky Mobile Header */}
        <header className="sticky top-0 z-40 md:hidden">
          <div className="bg-white/70 backdrop-blur-md border-b border-gray-100/50 shadow-sm">
            <div className="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-purple-50/30 to-pink-50/30">
              <h1 className="text-xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                Vicarage Resort
              </h1>
            </div>
          </div>
        </header>

        <main className="min-h-screen p-3 md:p-6 animate-fadeIn">
          <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl md:rounded-2xl p-4 md:p-6 text-white shadow-lg">
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-base md:text-lg font-semibold">JD</span>
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold">
                    Welcome back, John
                  </h2>
                  <p className="text-sm md:text-base text-white/80">
                    Here's what's happening with your bookings
                  </p>
                </div>
              </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 shadow-sm border border-gray-100/50 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="p-1.5 md:p-2 rounded-lg bg-purple-50">
                      <stat.icon className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                    </div>
                    <span
                      className={`text-xs font-medium px-1.5 py-0.5 md:px-2 md:py-1 rounded-full ${
                        stat.trend === "up"
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                  <div className="mt-2 md:mt-3">
                    <h3 className="text-xs md:text-sm font-medium text-gray-500">
                      {stat.label}
                    </h3>
                    <p className="text-xl md:text-2xl font-semibold text-gray-900 mt-0.5 md:mt-1">
                      {stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Content */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-sm border border-gray-100/50 p-4 md:p-6 transition-all duration-300 hover:shadow-md">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
