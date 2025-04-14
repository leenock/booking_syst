"use client";

import AuthService from "@/app/services/auth";
import { useEffect, useState } from "react";
import RecentBookings from "./components/recentbookings"; // Import the RecentBookings component
import Alerts from "./components/alerts"; // Import the Alerts component
import Stats from "./components/stats"; // Correctly import the default export

export default function AdminDashboardOverview() {
  const [adminName, setAdminName] = useState<string>("Admin");

  useEffect(() => {
    const adminData = AuthService.getAdminData();
    if (adminData) {
      setAdminName(`${adminData.firstName} ${adminData.lastName}`);
    }
  }, []);

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Message */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome back, {adminName}!
        </h2>
        <p className="text-gray-600">
          Here's what's happening at Vicarage Resort today.
        </p>
      </div>
      {/* Stats Grid */}
      <Stats /> {/* Stats component rendering */}
      {/* Recent Bookings Section */}
      <RecentBookings /> {/* Component for displaying bookings */}
      {/* Alerts Section */}
      <Alerts /> {/* Component for displaying alerts */}
    </div>
  );
}
