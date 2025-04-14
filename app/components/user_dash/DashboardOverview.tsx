import { Calendar, Bell, Clock, CreditCard } from "lucide-react";

export default function DashboardOverview() {
  const stats = [
    {
      label: "Active Bookings",
      value: "2",
      icon: Calendar,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Notifications",
      value: "5",
      icon: Bell,
      color: "bg-pink-100 text-pink-600",
    },
    {
      label: "Pending Requests",
      value: "1",
      icon: Clock,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Total Spent",
      value: "Ksh 25,000",
      icon: CreditCard,
      color: "bg-green-100 text-green-600",
    },
  ];

  const recentActivity = [
    {
      type: "booking",
      title: "Deluxe Room Booked",
      date: "2024-03-15",
      status: "Confirmed",
      statusColor: "bg-green-100 text-green-600",
    },
    {
      type: "notification",
      title: "Special Offer Available",
      date: "2024-03-14",
      status: "New",
      statusColor: "bg-blue-100 text-blue-600",
    },
    {
      type: "booking",
      title: "Standard Room Checkout",
      date: "2024-03-10",
      status: "Completed",
      statusColor: "bg-gray-100 text-gray-600",
    },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl shadow-sm p-6 transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-800">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 md:mb-4">
          Recent Activitys
        </h3>
        <div className="space-y-3 md:space-y-4">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200 gap-2 sm:gap-4"
            >
              <div className="flex items-start sm:items-center space-x-3 md:space-x-4">
                <div
                  className={`p-2 rounded-lg shrink-0 ${
                    activity.type === "booking"
                      ? "bg-purple-100 text-purple-600"
                      : "bg-pink-100 text-pink-600"
                  }`}
                >
                  {activity.type === "booking" ? (
                    <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                  ) : (
                    <Bell className="w-4 h-4 md:w-5 md:h-5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-800 text-sm md:text-base truncate">
                    {activity.title}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600">
                    {activity.date}
                  </p>
                </div>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-xs md:text-sm ${activity.statusColor} self-start sm:self-center shrink-0`}
              >
                {activity.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
