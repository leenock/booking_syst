"use client";

import { useEffect, useState } from "react";
import axios from "axios";

// Define the Stats interface for type checking
interface Stats {
  visitorAccounts: number;
  activeVisitorAccounts: number;
  inactiveVisitorAccounts: number;
  systemUsers: number;

  roomCount: number;
  totalRevenue: string;
}

interface Booking {
  checkIn: string;
  checkOut: string;
  roomPrice: string;
  status: string; // Assuming status is a string, adjust if necessary
}

const Stats = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch Visitor Accounts (including isActive field)
        const visitorRes = await axios.get(
          "http://localhost:5000/api/visitor-accounts"
        );
        const visitorAccounts = Array.isArray(visitorRes.data)
          ? visitorRes.data
          : [];

        // Calculate Active and Inactive Visitor Accounts based on isActive field
        const activeVisitorAccounts = visitorAccounts.filter(
          (account: any) => account.isActive === true
        ).length;
        const inactiveVisitorAccounts = visitorAccounts.filter(
          (account: any) => account.isActive === false
        ).length;

        // Fetch System Users (Admins)
        const adminRes = await axios.get("http://localhost:5000/api/admin");
        const systemUsers = Array.isArray(adminRes.data)
          ? adminRes.data.length
          : 0;

        // Fetch Rooms
        const roomRes = await axios.get("http://localhost:5000/api/rooms");
        const roomCount = Array.isArray(roomRes.data?.data)
          ? roomRes.data.data.length
          : 0;

        // Fetch Bookings and Calculate Revenue
        const bookingRes = await axios.get("http://localhost:5000/api/booking");
        const bookings = Array.isArray(bookingRes.data?.data)
          ? bookingRes.data.data
          : [];

      
        // Function to calculate stay duration in days
        const calculateStayDuration = (checkIn: string, checkOut: string) => {
          const startDate = new Date(checkIn);
          const endDate = new Date(checkOut);
          const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays;
        };

        // Calculate total revenue from checked-out bookings
        const checkedOutBooking = bookings.filter(
          (booking: Booking) => booking.status === "CHECKED_OUT"
        );

        const totalRevenue = checkedOutBooking.reduce(
          (sum: number, booking: Booking) => {
            const duration = calculateStayDuration(
              booking.checkIn,
              booking.checkOut
            );
            const pricePerNight = Number(booking.roomPrice);

            if (isNaN(pricePerNight) || pricePerNight <= 0 || duration <= 0) {
              return sum; // Skip invalid entries
            }

            return sum + pricePerNight * duration;
          },
          0
        );

        // Update stats
        setStats({
          visitorAccounts: visitorAccounts.length,
          activeVisitorAccounts,
          inactiveVisitorAccounts,
          systemUsers,
          roomCount,
          totalRevenue: `Ksh ${totalRevenue.toLocaleString()}`,
        });
      } catch (err: any) {
        console.error("Error fetching stats:", err.message || err);
        setError(
          "Failed to load statistics. Please check the server connection."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 max-w-[90%] mx-auto mt-6 backdrop-blur-md bg-opacity-60">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Resort Stats Overview
      </h3>

      {loading && (
        <div className="text-center text-gray-600 animate-pulse">
          Loading...
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 text-center">
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-black p-6 rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 ease-in-out hover:bg-blue-300 backdrop-blur-lg bg-opacity-60">
            <p className="text-sm text-white font-semibold">
              Total Visitor Accounts
            </p>
            <h4 className="text-xl font-semibold text-white">
              {stats.visitorAccounts}
            </h4>
          </div>
          <div className="bg-teal-200 p-6 rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 ease-in-out hover:bg-teal-300 backdrop-blur-lg bg-opacity-60">
            <p className="text-sm text-black-500 font-semibold">
              Active Visitor Accounts
            </p>
            <h4 className="text-xl font-semibold text-gray-800">
              {stats.activeVisitorAccounts}
            </h4>
          </div>
          <div className="bg-red-700 p-6 rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 ease-in-out hover:bg-black backdrop-blur-lg bg-opacity-60">
            <p className="text-sm text-white font-semibold">
              Inactive Visitor Accounts
            </p>
            <h4 className="text-xl font-semibold text-white">
              {stats.inactiveVisitorAccounts}
            </h4>
          </div>
          <div className="bg-green-200 p-6 rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 ease-in-out hover:bg-green-300 backdrop-blur-lg bg-opacity-60">
            <p className="text-sm text-black-500 font-semibold">System Users</p>
            <h4 className="text-xl font-semibold text-gray-800">
              {stats.systemUsers}
            </h4>
          </div>
          <div className="bg-yellow-200 p-6 rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 ease-in-out hover:bg-yellow-300 backdrop-blur-lg bg-opacity-60">
            <p className="text-sm text-black-500 font-semibold">Room Count</p>
            <h4 className="text-xl font-semibold text-gray-800">
              {stats.roomCount}
            </h4>
          </div>
          <div className="bg-purple-200 p-6 rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 ease-in-out hover:bg-purple-300 backdrop-blur-lg bg-opacity-60">
            <p className="text-sm text-black-500 font-semibold">
              Total Revenues
            </p>
            <h4 className="text-xl font-semibold text-gray-800">
              {stats.totalRevenue}
            </h4>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;
