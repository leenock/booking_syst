"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Plus, Search, Filter, X, Trash2, Edit2 } from "lucide-react";
import AddBookingModal from "./components/AddBookingModal";
import DeleteBookingModal from "./components/DeleteBookingModal";
import EditBookingModal from "./components/EditBookingModal";
import axios from "axios";
import AuthService from "@/app/services/auth";

type BookingStatus = "PENDING" | "CONFIRMED" | "CHECKED_IN" | "CHECKED_OUT" | "CANCELLED";
type RoomType = "STANDARD" | "DELUXE" | "SUITE";

interface Booking {
  id: string;
  roomNumber: string;
  roomType: RoomType;
  adults: number;
  kids: number;
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string;
  roomPrice: number;
  checkIn: string;
  checkOut: string;
  status: BookingStatus;
  totalAmount: number;
  createdAt: string;
  specialRequest?: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);
  const [bookingToEdit, setBookingToEdit] = useState<Booking | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | "ALL">("ALL");
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | "ALL">("ALL");

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, selectedRoomType, selectedStatus]);

  const filterBookings = () => {
    let filtered = [...bookings];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.visitorName.toLowerCase().includes(term) ||
          booking.visitorEmail.toLowerCase().includes(term) ||
          booking.visitorPhone.toLowerCase().includes(term) ||
          booking.roomNumber.toLowerCase().includes(term)
      );
    }

    // Filter by room type
    if (selectedRoomType !== "ALL") {
      filtered = filtered.filter((booking) => booking.roomType === selectedRoomType);
    }

    // Filter by status
    if (selectedStatus !== "ALL") {
      filtered = filtered.filter((booking) => booking.status === selectedStatus);
    }

    setFilteredBookings(filtered);
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/booking');
      if (response.data.success) {
        // Transform the API data to match our Booking type
        const transformedBookings = response.data.data.map((booking: any) => ({
          id: booking.id,
          roomNumber: booking.room?.roomNumber || 'N/A',
          roomType: booking.roomType,
          adults: booking.adults,
          kids: booking.kids,
          visitorName: booking.fullName,
          visitorEmail: booking.email,
          visitorPhone: booking.phone || 'N/A',
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          status: booking.status,
          totalAmount: booking.roomPrice,
          createdAt: booking.createdAt,
          specialRequest: booking.specialRequest || ''
        }));
        setBookings(transformedBookings);
      } else {
        setError('Failed to fetch bookings');
      }
    } catch (err) {
      setError('Error fetching bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

   // Calculate stay duration
   const calculateStayDuration = (checkIn: string, checkOut: string) => {
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CHECKED_IN":
        return "bg-blue-100 text-blue-800";
      case "CHECKED_OUT":
        return "bg-gray-100 text-gray-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleAddBooking = async (bookingData: any) => {
    try {
      const response = await axios.post('http://localhost:5000/api/booking', bookingData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AuthService.getToken()}`
        }
      });
      
      if (response.data.success) {
        // Refresh the bookings list
        fetchBookings();
        setIsAddModalOpen(false);
      } else {
        throw new Error(response.data.error || 'Failed to create booking');
      }
    } catch (err: any) {
      // Don't log to console, just throw the error to be handled by the modal
      throw new Error(err.response?.data?.error || 'Error creating booking');
    }
  };

  const handleEditClick = (booking: Booking) => {
    setBookingToEdit(booking);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = (bookingId: string, updatedData: any) => {
    // Update the booking in the state
    setBookings(bookings.map(booking => 
      booking.id === bookingId 
        ? {
            ...booking,
            visitorName: updatedData.fullName,
            visitorEmail: updatedData.email,
            visitorPhone: updatedData.phone,
            adults: updatedData.adults,
            kids: updatedData.kids,
            roomType: updatedData.roomType,
            totalAmount: updatedData.roomPrice,
            checkIn: updatedData.checkIn,
            checkOut: updatedData.checkOut,
            status: updatedData.status,
            specialRequest: updatedData.specialRequest
          }
        : booking
    ));
    
    // Close the modal
    setIsEditModalOpen(false);
    setBookingToEdit(null);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setBookingToEdit(null);
  };

  const handleDeleteClick = (booking: Booking) => {
    setBookingToDelete(booking);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSuccess = (bookingId: string) => {
    // Remove the deleted booking from the state
    setBookings(bookings.filter(booking => booking.id !== bookingId));
    setFilteredBookings(filteredBookings.filter(booking => booking.id !== bookingId));
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setBookingToDelete(null);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedRoomType("ALL");
    setSelectedStatus("ALL");
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
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Booking
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone or room number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedRoomType}
                onChange={(e) => setSelectedRoomType(e.target.value as RoomType | "ALL")}
                className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg appearance-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              >
                <option value="ALL">All Room Types</option>
                <option value="STANDARD">Standard</option>
                <option value="DELUXE">Deluxe</option>
                <option value="SUITE">Suite</option>
              </select>
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as BookingStatus | "ALL")}
                className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg appearance-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="CHECKED_IN">Checked In</option>
                <option value="CHECKED_OUT">Checked Out</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            {(searchTerm || selectedRoomType !== "ALL" || selectedStatus !== "ALL") && (
              <button
                onClick={clearFilters}
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Guest
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Room
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Check-in
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Check-out
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Guests
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Special Request
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.visitorName}
                      </div>
                      <div className="text-sm text-gray-500">{booking.visitorEmail}</div>
                      <div className="text-sm text-gray-500">{booking.visitorPhone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Room {booking.roomNumber}</div>
                      <div className="text-sm text-gray-500">{booking.roomType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(new Date(booking.checkIn), "MMM dd, yyyy")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(new Date(booking.checkOut), "MMM dd, yyyy")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <span className="font-medium">{booking.adults}</span> Adults
                        {booking.kids > 0 && (
                          <span className="ml-1">
                            + <span className="font-medium">{booking.kids}</span> Kids
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Ksh{" "}
                            {(
                              booking.totalAmount *
                              calculateStayDuration(
                                booking.checkIn,
                                booking.checkOut
                              )
                            ).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {booking.specialRequest || "No special requests"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditClick(booking)}
                          className="text-purple-600 hover:text-purple-900 flex items-center"
                        >
                          <Edit2 className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(booking)}
                          className="text-red-600 hover:text-red-900 flex items-center"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Booking Modal */}
      <AddBookingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddBooking}
      />

      {/* Delete Booking Modal */}
      <DeleteBookingModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onSuccess={handleDeleteSuccess}
        booking={bookingToDelete}
      />

      {/* Edit Booking Modal */}
      <EditBookingModal
        isOpen={isEditModalOpen}
        onClose={handleEditCancel}
        onSuccess={handleEditSuccess}
        booking={bookingToEdit}
      />
    </div>
  );
}
