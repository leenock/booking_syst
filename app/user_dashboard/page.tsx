"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/app/components/user_dash/Sidebar";
import DashboardOverview from "@/app/components/user_dash/DashboardOverview";
import NotificationsList from "@/app/components/user_dash/NotificationsList";
import UserSettings from "@/app/components/user_dash/UserSettings";
import {
  CalendarDays,
  CreditCard,
  Hotel,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";
import UserAuthService from "@/app/services/user_auth";

interface Booking {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  adults: number;
  kids: number;
  specialRequest: string;
  roomType: string;
  roomPrice: number;
  checkIn: string;
  checkOut: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
  room: {
    roomNumber: string;
    type: string;
    price: number;
    status: string;
    amenities: string[];
  };
}

export default function DashboardPage() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    const fetchBookings = async () => {
      const userData = UserAuthService.getUserData();

      if (userData && userData.email) {
        const email = userData.email;
        const url = `http://localhost:5000/api/booking/visitor/${email}`;

        try {
          const res = await fetch(url);
          const json = await res.json();

          if (!res.ok) {
            throw new Error(json.message || "Failed to fetch bookings");
          }

          setBookings(json.data);
        } catch (error: any) {
          console.error("Error loading bookings:", error.message || error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    const userData = UserAuthService.getUserData();
    if (userData?.firstName && userData?.lastName) {
      setUserName(`${userData.firstName} ${userData.lastName}`);
    }
  }, []);

  const getFilteredBookings = () => {
    if (dateFilter === "all") return bookings;

    const now = new Date();
    const pastDate = new Date();

    if (dateFilter === "month") {
      pastDate.setMonth(now.getMonth() - 1);
    } else if (dateFilter === "quarter") {
      pastDate.setMonth(now.getMonth() - 3);
    } else if (dateFilter === "year") {
      pastDate.setFullYear(now.getFullYear() - 1);
    }

    return bookings.filter(
      (booking) => new Date(booking.createdAt) >= pastDate
    );
  };

  const calculateStayDuration = (checkIn: string, checkOut: string) => {
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const checkedOutBookings = getFilteredBookings().filter(
    (booking) =>
      booking.status === "CHECKED_OUT" ||
      new Date(booking.checkOut) < new Date()
  );

  const totalSpent = checkedOutBookings.reduce(
    (sum, booking) =>
      sum + booking.roomPrice * calculateStayDuration(booking.checkIn, booking.checkOut),
    0
  );

  const avgSpent =
    checkedOutBookings.length > 0
      ? (
          totalSpent / checkedOutBookings.length
        ).toFixed(2)
      : "0.00";

  useEffect(() => {
    const userData = UserAuthService.getUserData();
    if (userData?.firstName && userData?.lastName) {
      setUserName(`${userData.firstName} ${userData.lastName}`);
    }
  }, []);

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
        className={`flex-1 transition-all duration-300 ease-in-out md:ml-64 relative w-full ${
          isMobileMenuOpen
            ? "opacity-50 blur-sm pointer-events-none scale-98"
            : "scale-100"
        }`}
      >
        {/* Mobile Header */}
        <header className="sticky top-0 z-40 md:hidden">
          <div className="bg-white/70 backdrop-blur-md border-b border-gray-100/50 shadow-sm">
            <div className="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-purple-50/30 to-pink-50/30">
              <h1 className="text-xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                Vicarage Resorts
              </h1>
            </div>
          </div>
        </header>

        <main className="min-h-screen p-3 md:p-6 animate-fadeIn">
          <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl md:rounded-2xl p-4 md:p-6 text-white shadow-lg">
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-base md:text-lg font-semibold">
                    {userName ? userName.charAt(0) : "U"}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold">
                    Welcome back, {userName ?? "User"}
                  </h2>
                  <p className="text-sm md:text-base text-white/80">
                    Here's what's happening with your bookings
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Bookings
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">
                      {getFilteredBookings().length}
                    </h3>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <CalendarDays className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Pending Bookings
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">
                      {
                        getFilteredBookings().filter(
                          (booking) => booking.status === "PENDING"
                        ).length
                      }
                    </h3>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Checked Out
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">
                      {
                        getFilteredBookings().filter(
                          (booking) =>
                            booking.status === "CHECKED_OUT" ||
                            new Date(booking.checkOut) < new Date()
                        ).length
                      }
                    </h3>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Confirmed
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">
                      {
                        getFilteredBookings().filter(
                          (booking) => booking.status === "CONFIRMED"
                        ).length
                      }
                    </h3>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Amount Spents
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">
                      Ksh {totalSpent.toFixed(2)}
                    </h3>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <CreditCard className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Average Amount Spent
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">
                      Ksh {avgSpent}
                    </h3>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
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
