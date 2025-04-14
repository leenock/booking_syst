"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import axios from "axios";
import Link from "next/link";

type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "CANCELLED";
type RoomType = "STANDARD" | "DELUXE" | "SUITE";
type paymentMethod = "CASH" | "MPESA" | "BANK_TRANSFER" | "Cash";

interface Booking {
  id: string;
  roomNumber: string;
  roomType: RoomType;
  paymentMethod: paymentMethod;
  adults: number;
  kids: number;
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string;
  checkIn: string;
  checkOut: string;
  status: BookingStatus;
  totalAmount: number;
  createdAt: string;
  specialRequest?: string;
}

export default function RecentBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buttonLoading, setButtonLoading] = useState(false); // Track button loading state

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/booking");
      if (response.data.success) {
        const transformedBookings = response.data.data.map((booking: any) => ({
          id: booking.id,
          roomNumber: booking.room?.roomNumber || "N/A",
          roomType: booking.roomType,
          adults: booking.adults,
          kids: booking.kids,
          visitorName: booking.fullName,
          visitorEmail: booking.email,
          visitorPhone: booking.phone || "N/A",
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          status: booking.status,
          totalAmount: booking.roomPrice,
          createdAt: booking.createdAt,
          paymentMethod: booking.paymentMethod,
          specialRequest: booking.specialRequest || "",
        }));

        // Show the latest 5 bookings (ordered by createdAt)
        const latestBookings = transformedBookings.slice(0, 5);
        setBookings(latestBookings);
      } else {
        setError("Failed to fetch bookings");
      }
    } catch (err) {
      setError("Error fetching bookings");
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
      setButtonLoading(false); // Ensure loading is turned off after the fetch
    }
  };

  // Status badge styling helper
  const getStatusBadgeClass = (status: BookingStatus) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "CHECKED_IN":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "CHECKED_OUT":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Room type badge styling helper
  const getRoomTypeBadgeClass = (roomType: RoomType) => {
    switch (roomType) {
      case "STANDARD":
        return "bg-slate-100 text-slate-800 border-slate-200";
      case "DELUXE":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "SUITE":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Payment method badge styling helper
  const getPaymentMethodBadgeClass = (paymentMethod: paymentMethod) => {
    switch (paymentMethod) {
      case "MPESA":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "BANK_TRANSFER":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "CASH":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Recent Bookings</h1>
        <button
          onClick={() => {
            setButtonLoading(true); // Set loading state when clicked
            fetchBookings();
          }}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors shadow-sm flex items-center justify-center disabled:opacity-50"
          disabled={buttonLoading} // Disable button while loading
        >
          {buttonLoading ? (
            <div className="animate-spin border-t-2 border-white w-5 h-5 rounded-full"></div>
          ) : (
            "Refresh"
          )}
        </button>
      </div>

      {/* Booking Table */}
      <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guest Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-gray-900">
                      {booking.roomNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getRoomTypeBadgeClass(
                        booking.roomType
                      )}`}
                    >
                      {booking.roomType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {format(new Date(booking.checkIn), "dd/MM/yyyy")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {format(new Date(booking.checkOut), "dd/MM/yyyy")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusBadgeClass(
                        booking.status
                      )}`}
                    >
                      {booking.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {booking.visitorName}
                    </div>
                    <div className="text-gray-500">{booking.visitorEmail}</div>
                    <div className="text-gray-500">{booking.visitorPhone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 text-xs font-extrabold">
                      {booking.totalAmount}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getPaymentMethodBadgeClass(
                        booking.paymentMethod
                      )}`}
                    >
                      {booking.paymentMethod}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
