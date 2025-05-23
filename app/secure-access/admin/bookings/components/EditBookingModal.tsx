"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, Calendar } from "lucide-react";
import AuthService from "@/app/services/auth";
import axios from "axios";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";

interface EditBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (bookingId: string, updatedData: any) => void;
  booking: {
    id: string;
    visitorName: string;
    visitorEmail: string;
    visitorPhone: string;
    adults: number;
    kids: number;
    specialRequest?: string;
    roomType: string;
    totalAmount: number;
    checkIn: string;
    checkOut: string;
    status: string;
    paymentMethod?: string;
  } | null;
}

type RoomType = "STANDARD" | "DELUXE" | "SUITE";

const ROOM_PRICES: Record<RoomType, number> = {
  STANDARD: 8000,
  DELUXE: 10000,
  SUITE: 12000,
};

export default function EditBookingModal({
  isOpen,
  onClose,
  onSuccess,
  booking,
}: EditBookingModalProps) {
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [isLoadingDates, setIsLoadingDates] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    adults: 1,
    kids: 0,
    specialRequest: "",
    roomType: "STANDARD" as RoomType,
    roomPrice: ROOM_PRICES.STANDARD,
    checkIn: "",
    checkOut: "",
    status: "PENDING",
    paymentMethod: "CASH",
  });

  // Initialize form data when booking changes
  useEffect(() => {
    if (booking) {
      setFormData({
        fullName: booking.visitorName,
        email: booking.visitorEmail,
        phone: booking.visitorPhone,
        adults: booking.adults,
        kids: booking.kids,
        specialRequest: booking.specialRequest || "",
        roomType: booking.roomType as RoomType,
        roomPrice: booking.totalAmount,
        checkIn: booking.checkIn.split("T")[0], // Format date for input
        checkOut: booking.checkOut.split("T")[0], // Format date for input
        status: booking.status,
        paymentMethod: booking.paymentMethod || "CASH",
      });
    }
  }, [booking]);

  // Reset state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setShowSuccessToast(false);
      setError(null);
    }
  }, [isOpen]);

  // Fetch unavailable dates based on roomType
  useEffect(() => {
    const fetchUnavailableDates = async () => {
      setIsLoadingDates(true);
      try {
        // Reset dates when changing room type
        setFormData((prev) => ({
          ...prev,
          checkIn: "",
          checkOut: "",
        }));

        // Call API with roomType as a parameter
        const response = await fetch(
          `http://localhost:5000/api/booking/booked_dates/${formData.roomType}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch unavailable dates");
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.bookedDates)) {
          const parsedDates = data.bookedDates.map(
            (dateString: string) => new Date(dateString)
          );

          // Log for debugging
          console.log("Booked dates for", formData.roomType, ":", parsedDates);

          setUnavailableDates(parsedDates);
        } else {
          console.error("Unexpected API response format:", data);
          // Set empty array if no dates found
          setUnavailableDates([]);
        }
      } catch (error) {
        console.error("Error fetching unavailable dates:", error);
        // Fallback to default dates in case of error
        setUnavailableDates([]);
        setToast({
          message:
            "Could not fetch availability information. Please try again.",
          type: "error",
        });
      } finally {
        setIsLoadingDates(false);
      }
    };

    fetchUnavailableDates();
  }, [formData.roomType]); // Re-fetch when roomType changes

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "roomType") {
      setFormData((prev) => ({
        ...prev,
        roomType: value as RoomType,
        roomPrice: ROOM_PRICES[value as RoomType],
      }));
    } else if (name === "adults" || name === "kids") {
      setFormData((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleClose = () => {
    setError(null);
    setShowSuccessToast(false);
    onClose();
  };

  const validateForm = () => {
    if (!formData.fullName) {
      setError("Full name is required");
      return false;
    }
    if (!formData.email) {
      setError("Email is required");
      return false;
    }
    if (!formData.phone) {
      setError("Phone number is required");
      return false;
    }
    if (!formData.checkIn) {
      setError("Check-in date is required");
      return false;
    }
    if (!formData.checkOut) {
      setError("Check-out date is required");
      return false;
    }

    // Validate dates
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);

    if (checkOutDate <= checkInDate) {
      setError("Check-out date must be after check-in date");
      return false;
    }

    // Validate number of guests
    if (formData.adults < 1) {
      setError("At least one adult is required");
      return false;
    }

    if (formData.kids < 0) {
      setError("Number of kids cannot be negative");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !booking) return;

    setIsLoading(true);
    setError(null);

    try {
      // Prepare the data for the API
      const updateData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        adults: parseInt(formData.adults.toString()),
        kids: parseInt(formData.kids.toString()),
        specialRequest: formData.specialRequest.trim(),
        roomType: formData.roomType.toUpperCase(),
        roomPrice: parseFloat(formData.roomPrice.toString()),
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        status: formData.status.toUpperCase(),
        paymentMethod: formData.paymentMethod.toUpperCase(),
      };

      // Send the update request
      const response = await axios.put(
        `http://localhost:5000/api/booking/${booking.id}`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AuthService.getToken()}`,
          },
        }
      );

      // Check if the update was successful (assuming 2xx response means success)
      if (response.status >= 200 && response.status < 300) {
        setShowSuccessToast(true);

        // Notify parent component
        onSuccess(booking.id, response.data?.data);

        // Close the modal after short delay
        setTimeout(() => {
          onClose(); // use handleClose() if your component requires it
        }, 1500);
      } else {
        throw new Error("Failed to update booking");
      }
    } catch (err: any) {
      let errorMessage = "Error updating booking";

      if (err.response) {
        errorMessage =
          err.response.data?.error ||
          err.response.data?.message ||
          err.response.data?.details ||
          `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else {
        errorMessage = `Request error: ${err.message}`;
      }

      setToast({
        message: "An unexpected error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !booking) return null;

  return (
    <>
      <div className="fixed inset-0 bg-white/30 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Edit Booking
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-blue-500/20 
                               transition-all duration-200"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-blue-500/20 
                               transition-all duration-200"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-blue-500/20 
                               transition-all duration-200"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Room Type
                    </label>
                    <select
                      name="roomType"
                      value={formData.roomType}
                      onChange={handleChange}
                      required
                      className="pl-10 w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    >
                      <option value="STANDARD">
                        Standard Room - Ksh 8,000
                      </option>
                      <option value="DELUXE">Deluxe Room - Ksh 10,000</option>
                      <option value="SUITE">
                        Executive Suite - Ksh 12,000
                      </option>
                    </select>
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-in Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-500 z-10" />
                      <DatePicker
                        selected={
                          formData.checkIn ? new Date(formData.checkIn) : null
                        }
                        onChange={(date: Date | null) =>
                          setFormData((prev) => ({
                            ...prev,
                            checkIn: date
                              ? date.toLocaleDateString("en-CA")
                              : "",
                            checkOut: "", // Reset checkout when checkin changes
                          }))
                        }
                        excludeDates={unavailableDates}
                        minDate={new Date()}
                        dateFormat="yyyy-MM-dd"
                        className={`pl-10 w-full sm:w-[350px] px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/90 shadow-[0_2px_8px_-1px_rgba(0,0,0,0.1)] backdrop-blur-sm transition-all duration-300 group-hover:border-purple-300 hover:bg-white hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.12)] 
                          ${
                            isLoadingDates
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        placeholderText={
                          isLoadingDates
                            ? "Loading available dates..."
                            : "Select check-in date"
                        }
                        required
                        disabled={isLoadingDates}
                      />
                      {isLoadingDates && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-out Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-500 z-10" />
                      <DatePicker
                        selected={
                          formData.checkOut ? new Date(formData.checkOut) : null
                        }
                        onChange={(date: Date | null) =>
                          setFormData((prev) => ({
                            ...prev,
                            checkOut: date
                              ? date.toLocaleDateString("en-CA")
                              : "",
                          }))
                        }
                        excludeDates={unavailableDates}
                        minDate={
                          formData.checkIn
                            ? new Date(formData.checkIn)
                            : new Date()
                        }
                        dateFormat="yyyy-MM-dd"
                        className={`pl-10 w-full sm:w-[350px] px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/90 shadow-[0_2px_8px_-1px_rgba(0,0,0,0.1)] backdrop-blur-sm transition-all duration-300 group-hover:border-purple-300 hover:bg-white hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.12)] ${
                          isLoadingDates || !formData.checkIn
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        placeholderText={
                          isLoadingDates
                            ? "Loading available dates..."
                            : "Select check-out date"
                        }
                        required
                        disabled={isLoadingDates || !formData.checkIn}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adults
                    </label>
                    <input
                      type="number"
                      name="adults"
                      min="1"
                      max="2"
                      value={formData.adults}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-blue-500/20 
                               transition-all duration-200"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kids
                    </label>
                    <input
                      type="number"
                      name="kids"
                      min="0"
                      value={formData.kids}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-blue-500/20 
                               transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Requests
                </label>
                <textarea
                  name="specialRequest"
                  value={formData.specialRequest}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500/20 
                           transition-all duration-200"
                  placeholder="Any special requests or requirements?"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Booking Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500/20 
                           transition-all duration-200"
                >
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="CHECKED_IN">Checked In</option>
                  <option value="CHECKED_OUT">Checked Out</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500/20 
                           transition-all duration-200"
                >
                  <option>Select payment method</option>
                  <option value="CASH">Cash</option>
                  <option value="MPESA">M-Pesa</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                </select>
              </div>

              {/* Footer */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg 
                           hover:bg-gray-200 transition-colors font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg 
                           hover:bg-blue-700 transition-colors disabled:opacity-50 
                           disabled:cursor-not-allowed flex items-center gap-2 font-medium cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    "Update Booking"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Success Toast Notification for Booking Edit */}
      {showSuccessToast && (
        <div className="fixed bottom-4 right-4 z-[100] bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center animate-fade-in-up">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span>Booking updated successfully</span>
        </div>
      )}
    </>
  );
}
