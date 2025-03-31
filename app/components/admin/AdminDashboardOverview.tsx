"use client";

import { Calendar, Users, Hotel, Receipt, ArrowUp, ArrowDown, AlertCircle, Clock } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import AuthService from '@/app/services/auth';
import { useEffect, useState } from 'react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

export default function AdminDashboardOverview() {
  const [adminName, setAdminName] = useState<string>('Admin');

  useEffect(() => {
    const adminData = AuthService.getAdminData();
    if (adminData) {
      setAdminName(`${adminData.firstName} ${adminData.lastName}`);
    }
  }, []);

  const stats = [
    {
      label: 'Total Bookings',
      value: '156',
      change: '+12%',
      trend: 'up',
      icon: Calendar,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Active Users',
      value: '2,453',
      change: '+8%',
      trend: 'up',
      icon: Users,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Available Rooms',
      value: '45',
      change: '-3',
      trend: 'down',
      icon: Hotel,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      label: 'Revenue',
      value: 'Ksh 1.2M',
      change: '+15%',
      trend: 'up',
      icon: Receipt,
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  const recentBookings = [
    {
      id: 'BK001',
      guest: 'John Doe',
      room: 'Deluxe Suite',
      checkIn: '2024-03-20',
      checkOut: '2024-03-25',
      status: 'Confirmed',
      statusColor: 'bg-green-100 text-green-600',
      amount: 'Ksh 25,000',
    },
    {
      id: 'BK002',
      guest: 'Jane Smith',
      room: 'Standard Room',
      checkIn: '2024-03-21',
      checkOut: '2024-03-23',
      status: 'Pending',
      statusColor: 'bg-yellow-100 text-yellow-600',
      amount: 'Ksh 15,000',
    },
    {
      id: 'BK003',
      guest: 'Mike Johnson',
      room: 'Executive Suite',
      checkIn: '2024-03-22',
      checkOut: '2024-03-24',
      status: 'Cancelled',
      statusColor: 'bg-red-100 text-red-600',
      amount: 'Ksh 35,000',
    },
  ];

  const alerts = [
    {
      type: 'warning',
      message: '3 rooms require maintenance',
      icon: AlertCircle,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      type: 'info',
      message: '5 new bookings pending approval',
      icon: Clock,
      color: 'bg-blue-100 text-blue-600',
    },
  ];

  // Enhanced chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1f2937',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        usePointStyle: true,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'KES'
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: function(value: any) {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'KES',
              maximumFractionDigits: 0,
            }).format(value);
          },
        },
      },
    },
  };

  // Enhanced booking trends data
  const bookingTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Bookings',
        data: [65, 59, 80, 81, 56, 55],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Revenue',
        data: [45000, 52000, 68000, 72000, 48000, 42000],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Enhanced revenue data
  const revenueData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Room Revenue',
        data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderRadius: 6,
      },
      {
        label: 'Additional Services',
        data: [5000, 8000, 6000, 10000, 9000, 12000, 11000],
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderRadius: 6,
      },
    ],
  };

  // Enhanced room status data
  const roomStatusData = {
    labels: ['Occupied', 'Available', 'Maintenance', 'Reserved'],
    datasets: [
      {
        data: [65, 25, 10, 15],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(34, 197, 94, 0.7)',
          'rgba(234, 179, 8, 0.7)',
          'rgba(168, 85, 247, 0.7)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(234, 179, 8)',
          'rgb(168, 85, 247)',
        ],
        borderWidth: 1,
        hoverOffset: 4,
      },
    ],
  };

  // Doughnut chart specific options
  const doughnutOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        ...chartOptions.plugins.legend,
        position: 'right' as const,
      },
    },
    cutout: '70%',
  };

  // Add occupancy rate data
  const occupancyRateData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Occupancy Rate (%)',
        data: [75, 82, 68, 88],
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(168, 85, 247)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Target Rate (%)',
        data: [80, 80, 80, 80],
        borderColor: 'rgb(234, 179, 8)',
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
        borderDash: [5, 5],
        tension: 0,
        fill: false,
        pointRadius: 0,
      },
    ],
  };

  // Add occupancy rate specific options
  const occupancyOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: function(value: any) {
            return value + '%';
          },
        },
      },
    },
    plugins: {
      ...chartOptions.plugins,
      tooltip: {
        ...chartOptions.plugins.tooltip,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += context.parsed.y + '%';
            return label;
          }
        }
      },
    },
  };

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Message */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Welcome back, {adminName}!</h2>
        <p className="text-gray-600">Here's what's happening at Vicarage Resort today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl shadow-sm p-6 transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
                </div>
              </div>
              <div className={`flex items-center space-x-1 ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend === 'up' ? (
                  <ArrowUp className="w-4 h-4" />
                ) : (
                  <ArrowDown className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">{stat.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Trends Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Booking Trends</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Last 6 months</span>
            </div>
          </div>
          <div className="h-[300px]">
            <Line options={chartOptions} data={bookingTrendData} />
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Weekly Revenue</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">This week</span>
            </div>
          </div>
          <div className="h-[300px]">
            <Bar options={chartOptions} data={revenueData} />
          </div>
        </div>

        {/* Room Status Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Room Status</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Current</span>
            </div>
          </div>
          <div className="h-[300px]">
            <Doughnut options={doughnutOptions} data={roomStatusData} />
          </div>
        </div>

        {/* Occupancy Rate Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Occupancy Rate</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">This month</span>
            </div>
          </div>
          <div className="h-[300px]">
            <Line options={occupancyOptions} data={occupancyRateData} />
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {alerts.map((alert) => (
          <div
            key={alert.message}
            className="bg-white rounded-xl shadow-sm p-4 flex items-center space-x-3"
          >
            <div className={`p-2 rounded-lg ${alert.color}`}>
              <alert.icon className="w-5 h-5" />
            </div>
            <p className="text-gray-700">{alert.message}</p>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Bookings</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                <th className="pb-3 font-medium">Booking ID</th>
                <th className="pb-3 font-medium">Guest</th>
                <th className="pb-3 font-medium">Room</th>
                <th className="pb-3 font-medium">Check In</th>
                <th className="pb-3 font-medium">Check Out</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="text-sm">
                  <td className="py-4 font-medium text-gray-900">{booking.id}</td>
                  <td className="py-4 text-gray-600">{booking.guest}</td>
                  <td className="py-4 text-gray-600">{booking.room}</td>
                  <td className="py-4 text-gray-600">{booking.checkIn}</td>
                  <td className="py-4 text-gray-600">{booking.checkOut}</td>
                  <td className="py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs ${booking.statusColor}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-4 text-gray-900 font-medium">{booking.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 