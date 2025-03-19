'use client';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-lg font-medium text-white mb-2">Total Bookings</h3>
          <p className="text-3xl font-bold text-amber-400">0</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-lg font-medium text-white mb-2">Active Rooms</h3>
          <p className="text-3xl font-bold text-amber-400">0</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-lg font-medium text-white mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-amber-400">KSH 0</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 p-6 rounded-xl">
        <h2 className="text-xl font-medium text-white mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <p className="text-gray-400">No recent activity to display</p>
        </div>
      </div>
    </div>
  );
} 