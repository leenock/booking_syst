"use client";
import { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell 
} from "recharts";
import { 
  CalendarDays, DownloadCloud, Users, CreditCard, PieChart as PieChartIcon, 
  BarChart as BarChartIcon, Filter
} from "lucide-react";
import Sidebar from "@/app/components/user_dash/Sidebar";
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

export default function BookingAnalytics() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [dateFilter, setDateFilter] = useState("all");

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

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
          console.error("[Analytics] Error loading bookings:", error.message || error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Filter bookings based on date range
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
    
    return bookings.filter(booking => new Date(booking.createdAt) >= pastDate);
  };

// Calculate total spent (only for checked out bookings)
const totalSpent = getFilteredBookings()
  .filter(booking => booking.status === 'CHECKED_OUT' || 
                    new Date(booking.checkOut) < new Date())
  .reduce((sum, booking) => sum + booking.roomPrice, 0);

// Calculate average price per night (only for checked out bookings)
const checkedOutBookings = getFilteredBookings()
  .filter(booking => booking.status === 'CHECKED_OUT' || 
                    new Date(booking.checkOut) < new Date());
  
const avgPrice = checkedOutBookings.length > 0 ? 
  (checkedOutBookings.reduce((sum, booking) => sum + booking.roomPrice, 0) / 
   checkedOutBookings.length).toFixed(2) : 0;

  // Group by room type
  const roomTypeData = getFilteredBookings().reduce((acc: any[], booking) => {
    const existingType = acc.find(item => item.name === booking.roomType);
    if (existingType) {
      existingType.value += 1;
    } else {
      acc.push({ name: booking.roomType, value: 1 });
    }
    return acc;
  }, []);

  // Group by status
  const statusData = getFilteredBookings().reduce((acc: any[], booking) => {
    const existingStatus = acc.find(item => item.name === booking.status);
    if (existingStatus) {
      existingStatus.value += 1;
    } else {
      acc.push({ name: booking.status, value: 1 });
    }
    return acc;
  }, []);

  // Group bookings by month for the bar chart
  const getMonthlyBookings = () => {
    const monthlyData: Record<string, number> = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    getFilteredBookings().forEach(booking => {
      const date = new Date(booking.checkIn);
      const monthYear = `${months[date.getMonth()]} ${date.getFullYear()}`;
      
      if (monthlyData[monthYear]) {
        monthlyData[monthYear] += booking.roomPrice;
      } else {
        monthlyData[monthYear] = booking.roomPrice;
      }
    });
    
    return Object.keys(monthlyData).map(key => ({
      month: key,
      amount: monthlyData[key]
    }));
  };

  // Handle export
  const exportBookings = () => {
    // Create CSV content
    const headers = "ID,Name,Email,Phone,adults,Kids,Room Type,Room Number,Check In,Check Out,Price,Status\n";
    const rows = getFilteredBookings().map(b => 
      `${b.id},"${b.fullName}","${b.email}","${b.phone}","${b.adults}","${b.kids}","${b.roomType}",` +
      `"${b.room?.roomNumber || 'N/A'}","${b.checkIn}","${b.checkOut}",${b.roomPrice},"${b.status}"`
    ).join("\n");
    
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    
    // Create download link and trigger download
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bookings_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <Sidebar isOpen={isSidebarOpen} onOpenChange={setIsSidebarOpen} />

      <div className="md:pl-64 min-h-screen transition-all duration-200">
        <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BarChartIcon className="w-6 h-6 text-purple-600" />
                <h1 className="text-xl font-semibold text-gray-900">
                  Booking Analytics
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select 
                    className="text-sm border rounded-md px-2 py-1"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  >
                    <option value="all">All Time</option>
                    <option value="month">Last Month</option>
                    <option value="quarter">Last Quarter</option>
                    <option value="year">Last Year</option>
                  </select>
                </div>
                <button 
                onClick={exportBookings}
                className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm sm:text-base w-full sm:w-auto transition-colors"
              >
                <DownloadCloud className="w-4 h-4" />
                <span className="hidden xs:inline">Export Report</span>
              </button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">{getFilteredBookings().length}</h3>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <CalendarDays className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Spent</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">Ksh{totalSpent.toFixed(2)}</h3>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <CreditCard className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Average Price</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">Ksh{avgPrice}</h3>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChartIcon className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-800">Monthly Spending</h3>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getMonthlyBookings()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                        <Legend />
                        <Bar dataKey="amount" fill="#8884d8" name="Spending" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <div className="flex items-center gap-2 mb-4">
                    <PieChartIcon className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-800">Bookings by Room Type</h3>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={roomTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {roomTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name, props) => [`${value} bookings`, props.payload.name]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Booking Status */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <PieChartIcon className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-800">Booking Status Distribution</h3>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name, props) => [`${value} bookings`, props.payload.name]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}