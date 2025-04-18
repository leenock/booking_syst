"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/app/components/user_dash/Sidebar";
import {
  CalendarDays,
  Clock,
  User,
  Mail,
  Phone,
  Home,
  Users,
  Tag,
  AlertCircle,
} from "lucide-react";
import UserAuthService, { UserData } from "@/app/services/user_auth";

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

export default function UserBookings() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const userData = UserAuthService.getUserData();

      if (
        userData &&
        userData.email &&
        userData.firstName &&
        userData.lastName
      ) {
        const email = userData.email;
        setUserName(email);

        const fullName = userData.firstName + " " + userData.lastName;
        setUserName(fullName);

        const url = `http://localhost:5000/api/booking/visitor/${email}`;

        try {
          const res = await fetch(url);
          const json = await res.json();

          if (!res.ok) {
            throw new Error(json.message || "Failed to fetch bookings");
          }

          setBookings(json.data);
        } catch (error: any) {
          console.error(
            "[Bookings] Error loading bookings:",
            error.message || error
          );
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date nicely
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate stay duration
  const calculateStayDuration = (checkIn: string, checkOut: string) => {
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  //calculate total amount on stay duration
  const calculateTotalAmount = (price: number, duration: number) => {
    return price * duration;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <Sidebar isOpen={isSidebarOpen} onOpenChange={setIsSidebarOpen} />

      <div className="md:pl-64 min-h-screen transition-all duration-200">
        <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4 flex items-center justify-center md:justify-start gap-3">
              <CalendarDays className="w-6 h-6 text-purple-600" />
              <h1 className="text-xl font-semibold text-gray-900">
                Your Bookings at Vicarage Resorts
                {userName ? `, ${userName}` : ""}
              </h1>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : bookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-50 to-indigo-50 text-gray-700">
                      <th className="px-6 py-4 text-left font-medium text-sm uppercase tracking-wider w-1/5">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-purple-500" />
                          <span>Guest Details</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left font-medium text-sm uppercase tracking-wider w-1/5">
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-purple-500" />
                          <span>Room</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left font-medium text-sm uppercase tracking-wider w-2/5">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-purple-500" />
                          <span>Stay Period</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left font-medium text-sm uppercase tracking-wider w-1/12">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-purple-500" />
                          <span>Price</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left font-medium text-sm uppercase tracking-wider w-1/12">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-purple-500" />
                          <span>Status</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">
                              {booking.fullName}
                            </span>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Mail className="w-3 h-3 mr-1" />
                              {booking.email}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Phone className="w-3 h-3 mr-1" />
                              {booking.phone}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Users className="w-3 h-3 mr-1" />
                              {booking.adults} Adults, {booking.kids} Kids
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <div className="font-medium text-gray-900">
                              {booking.room?.roomNumber || "Not Assigned"}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {booking.roomType}
                            </div>
                            {booking.specialRequest && (
                              <div className="mt-2 text-xs p-2 bg-amber-50 text-amber-700 rounded-md">
                                <span className="font-medium">
                                  Special Request:
                                </span>{" "}
                                {booking.specialRequest}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex flex-col w-full">
                                <div className="flex items-center justify-between">
                                  <span className="px-2 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium">
                                    Check-in
                                  </span>
                                  <span className="text-sm text-gray-900 font-medium">
                                    {formatDate(booking.checkIn)}
                                  </span>
                                </div>
                                <div className="h-1 bg-gray-100 rounded-full mt-2 mb-2 relative">
                                  <div
                                    className="absolute left-0 h-1 bg-purple-400 rounded-full"
                                    style={{ width: "20%" }}
                                  ></div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="px-2 py-1 rounded-md bg-red-50 text-red-700 text-xs font-medium">
                                    Check-out
                                  </span>
                                  <span className="text-sm text-gray-900 font-medium">
                                    {formatDate(booking.checkOut)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="bg-indigo-50 rounded-md p-2 text-center mt-2">
                              <span className="text-indigo-700 font-medium">
                                {calculateStayDuration(
                                  booking.checkIn,
                                  booking.checkOut
                                )}{" "}
                                Nights
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">
                            Ksh{" "}
                            {(
                              booking.roomPrice *
                              calculateStayDuration(
                                booking.checkIn,
                                booking.checkOut
                              )
                            ).toFixed(2)}
                          </div>

                          <div className="text-xs text-gray-500">
                            {booking.paymentMethod}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <CalendarDays className="w-16 h-16 text-purple-200 mb-4" />
                <p className="text-gray-700 font-medium text-lg">
                  You currently have no bookings
                </p>
                <p className="text-gray-500 mt-2">
                  Once you make a reservation, your booking details will appear
                  here
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
