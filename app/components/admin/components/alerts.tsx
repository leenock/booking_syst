"use client";

import { AlertCircle, Clock, RefreshCw } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";

interface Room {
  status: string;
  type?: string;
}

interface Booking {
  status: string;
}

const AlertCard = ({ icon: Icon, message, color, bgColor, borderColor }: any) => (
  <div className={`flex items-center p-4 rounded-lg shadow-sm ${bgColor} ${borderColor} border`}>
    <div className={`p-2 rounded-full ${color} mr-3 flex-shrink-0`}>
      <Icon className="w-5 h-5" />
    </div>
    <span className="text-sm font-medium text-gray-800 break-words">{message}</span>
  </div>
);

export default function Alerts() {
  const [maintenanceCount, setMaintenanceCount] = useState(0);
  const [maintenanceRoomTypes, setMaintenanceRoomTypes] = useState<string[]>([]);
  const [pendingBookingsCount, setPendingBookingsCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch rooms
      const roomRes = await axios.get("http://localhost:5000/api/rooms");
      const rooms: Room[] = Array.isArray(roomRes.data.data)
        ? roomRes.data.data
        : [];

      const maintenanceRooms = rooms.filter(
        (room) => room.status?.toUpperCase() === "MAINTENANCE"
      );

      setMaintenanceCount(maintenanceRooms.length);

      const uniqueTypes = Array.from(
        new Set(
          maintenanceRooms
            .map((room) => room.type?.trim())
            .filter((type): type is string => !!type)
        )
      );
      setMaintenanceRoomTypes(uniqueTypes);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setMaintenanceCount(0);
      setMaintenanceRoomTypes([]);
    }

    try {
      // Fetch bookings
      const bookingRes = await axios.get("http://localhost:5000/api/booking");
      const bookings: Booking[] = Array.isArray(bookingRes.data.data)
        ? bookingRes.data.data
        : [];
      const pendingBookings = bookings.filter(
        (booking) => booking.status?.toUpperCase() === "PENDING"
      );
      setPendingBookingsCount(pendingBookings.length);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setPendingBookingsCount(0);
    }
    setLoading(false);
  };

  // Format maintenance message to prevent overflow
  const getMaintenanceMessage = () => {
    if (maintenanceCount === 0) {
      return "No rooms currently require maintenance";
    }
    
    let roomTypes = "";
    if (maintenanceRoomTypes.length > 0) {
      // Limit to 3 room types to prevent overflow
      const displayTypes = maintenanceRoomTypes.slice(0, 3);
      roomTypes = displayTypes.join(", ");
      
      if (maintenanceRoomTypes.length > 3) {
        roomTypes += ` and ${maintenanceRoomTypes.length - 3} more`;
      }
    }
    
    return `${maintenanceCount} room${maintenanceCount > 1 ? 's' : ''} require maintenance${roomTypes ? ': ' + roomTypes : ''}`;
  };

  const alerts = [
    {
      type: "warning",
      message: getMaintenanceMessage(),
      icon: AlertCircle,
      color: "bg-yellow-100 text-yellow-700",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200"
    },
    {
      type: "info",
      message: `${pendingBookingsCount} booking${pendingBookingsCount !== 1 ? 's' : ''} pending approval`,
      icon: Clock,
      color: "bg-blue-100 text-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
  ];

  return (
    <div className="p-4 space-y-4 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800">Alerts</h3>
        <button 
          onClick={fetchData} 
          disabled={loading}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          title="Refresh alerts"
        >
          <RefreshCw className={`w-4 h-4 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <AlertCard key={index} {...alert} />
        ))}
      </div>
    </div>
  );
}