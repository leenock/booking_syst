"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Phone,
  Mail,
  User,
  Hotel,
  Users,
  CreditCard,
  MessageSquare,
  X,
  Wallet,
  CheckCircle,
} from "lucide-react";
import AuthService from "@/app/services/auth";
import Toast from "@/app/components/ui/Toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


interface AddBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bookingData: BookingFormData) => Promise<void>;
}

type RoomType = "STANDARD" | "DELUXE" | "SUITE";

interface Room {
  id: string;
  roomNumber: string;
  type: string;
  status: string;
  bookings?: {
    checkIn: string;
    checkOut: string;
  }[];
}

interface BookingFormData {
  fullName: string;
  email: string;
  phone: string;
  adults: number;
  kids: number;
  specialRequest: string;
  roomType: string;
  roomPrice: number;
  roomId: string;
  checkIn: string;
  checkOut: string;
  paymentMethod: string;
}

interface ConflictingBooking {
  roomNumber: string;
  checkIn: string;
  checkOut: string;
}

const ROOM_PRICES: Record<RoomType, number> = {
  STANDARD: 8000,
  DELUXE: 10000,
  SUITE: 12000,
};

export default function AddBookingModal({
  isOpen,
  onClose,
  onSubmit,
}: AddBookingModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [formData, setFormData] = useState<BookingFormData>({
    fullName: "",
    email: "",
    phone: "",
    adults: 1,
    kids: 0,
    specialRequest: "",
    roomType: "STANDARD",
    roomPrice: ROOM_PRICES.STANDARD,
    roomId: "",
    checkIn: "",
    checkOut: "",
    paymentMethod: "CASH",
  });

  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const today = new Date(); // Get today's date

  useEffect(() => {
    // Fetch unavailable dates from API
    const fetchUnavailableDates = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/booking/booked_dates"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch unavailable dates");
        }
        const data = await response.json();

        // Handle different response formats
        let parsedDates: Date[] = [];

        if (Array.isArray(data)) {
          // If data is directly an array of dates
          parsedDates = data.map((dateString: string) => new Date(dateString));
        } else if (data && typeof data === "object") {
          // If data is an object with a dates property or similar
          const datesArray =
            data.dates || data.bookedDates || data.unavailableDates || [];
          if (Array.isArray(datesArray)) {
            parsedDates = datesArray.map(
              (dateString: string) => new Date(dateString)
            );
          }
        }

        // Log for debugging
        console.log("API Response:", data);
        console.log("Parsed Dates:", parsedDates);

        setUnavailableDates(parsedDates);
      } catch (error) {
        console.error("Error fetching unavailable dates:", error);
        // Fallback to default dates in case of error
        setUnavailableDates([new Date("2025-04-20"), new Date("2025-04-29")]);
      }
    };

    fetchUnavailableDates();
  }, []);

  // Reset toast state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setToast(null);
      setIsSuccess(false);
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "roomType") {
      setFormData((prev) => ({
        ...prev,
        roomType: value,
        roomPrice: ROOM_PRICES[value as RoomType],
        roomId: "",
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

  const validateForm = () => {
    if (!formData.fullName) {
      setToast({
        message: "Full name is required",
        type: "error",
      });
      return false;
    }
    if (!formData.email) {
      setToast({
        message: "Email is required",
        type: "error",
      });
      return false;
    }
    if (!formData.phone?.trim()) {
      setToast({
        message: "Phone number is required",
        type: "error",
      });
      return false;
    } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone)) {
      setToast({
        message: "Please enter a valid phone number (e.g. +254712345678)",
        type: "error",
      });
      return false;
    }
    
    if (!formData.checkIn) {
      setToast({
        message: "Check-in date is required",
        type: "error",
      });
      return false;
    }
    if (!formData.checkOut) {
      setToast({
        message: "Check-out date is required",
        type: "error",
      });
      return false;
    }

    // Validate dates
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      setToast({
        message: "Check-in date cannot be in the past",
        type: "error",
      });
      return false;
    }

    if (checkOutDate <= checkInDate) {
      setToast({
        message: "Check-out date must be after check-in date",
        type: "error",
      });
      return false;
    }

    // Validate number of guests
    if (formData.adults < 1) {
      setToast({
        message: "At least one adult is required",
        type: "error",
      });
      return false;
    }

    if (formData.kids < 0) {
      setToast({
        message: "Number of kids cannot be negative",
        type: "error",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // First, get all rooms of the selected type
      let roomsResponse;
      let roomsData;

      try {
        roomsResponse = await fetch(
          `http://localhost:5000/api/rooms?type=${formData.roomType}`,
          {
            headers: {
              Authorization: `Bearer ${AuthService.getToken()}`,
            },
          }
        );

        roomsData = await roomsResponse.json();
      } catch (fetchError) {
        // Handle network errors or JSON parsing errors
        setToast({
          message:
            "Failed to connect to the server. Please check your connection and try again.",
          type: "error",
        });
        setIsLoading(false);
        return;
      }

      if (!roomsResponse.ok) {
        setToast({
          message: roomsData.error || "Failed to fetch rooms",
          type: "error",
        });
        setIsLoading(false);
        return;
      }

      // Filter to get only rooms of the selected type
      const roomsOfType = roomsData.data.filter(
        (room: Room) => room.type === formData.roomType
      );

      if (roomsOfType.length === 0) {
        setToast({
          message: `No ${formData.roomType.toLowerCase()} rooms exist in the system.`,
          type: "error",
        });
        setIsLoading(false);
        return;
      }

      // Filter rooms to find one that's available
      const availableRooms = roomsOfType.filter((room: Room) => {
        // Check if room is available
        if (room.status !== "AVAILABLE") {
          return false;
        }

        // If room has no bookings, it's available
        if (!room.bookings || room.bookings.length === 0) {
          return true;
        }

        // Check if any existing booking overlaps with the requested dates
        const checkInDate = new Date(formData.checkIn);
        const checkOutDate = new Date(formData.checkOut);

        return !room.bookings.some(
          (booking: { checkIn: string; checkOut: string }) => {
            const bookingCheckIn = new Date(booking.checkIn);
            const bookingCheckOut = new Date(booking.checkOut);

            // Check for date overlap
            return (
              (checkInDate >= bookingCheckIn &&
                checkInDate < bookingCheckOut) ||
              (checkOutDate > bookingCheckIn &&
                checkOutDate <= bookingCheckOut) ||
              (checkInDate <= bookingCheckIn && checkOutDate >= bookingCheckOut)
            );
          }
        );
      });

      if (availableRooms.length === 0) {
        // Find conflicting bookings to show more specific error
        const conflictingBookings = roomsOfType.flatMap((room: Room) => {
          if (!room.bookings || room.bookings.length === 0) return [];

          const checkInDate = new Date(formData.checkIn);
          const checkOutDate = new Date(formData.checkOut);

          return room.bookings
            .filter((booking: { checkIn: string; checkOut: string }) => {
              const bookingCheckIn = new Date(booking.checkIn);
              const bookingCheckOut = new Date(booking.checkOut);

              return (
                (checkInDate >= bookingCheckIn &&
                  checkInDate < bookingCheckOut) ||
                (checkOutDate > bookingCheckIn &&
                  checkOutDate <= bookingCheckOut) ||
                (checkInDate <= bookingCheckIn &&
                  checkOutDate >= bookingCheckOut)
              );
            })
            .map((booking: { checkIn: string; checkOut: string }) => ({
              roomNumber: room.roomNumber,
              checkIn: new Date(booking.checkIn).toLocaleDateString(),
              checkOut: new Date(booking.checkOut).toLocaleDateString(),
            }));
        });

        if (conflictingBookings.length > 0) {
          // Format the conflicting bookings for display
          const conflictingDates = conflictingBookings
            .map(
              (booking: ConflictingBooking) =>
                `Room ${booking.roomNumber}: ${booking.checkIn} to ${booking.checkOut}`
            )
            .join(", ");

          setToast({
            message: `No ${formData.roomType.toLowerCase()} rooms are available for the selected dates. The following dates are already booked: ${conflictingDates}. Please try different dates or room type.`,
            type: "error",
          });
        } else {
          setToast({
            message: `No ${formData.roomType.toLowerCase()} rooms are available for the selected dates. Please try different dates or room type.`,
            type: "error",
          });
        }

        setIsLoading(false);
        return;
      }

      // Get the first available room
      const availableRoom = availableRooms[0];

      // Create the booking data
      const bookingData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        adults: formData.adults,
        kids: formData.kids,
        specialRequest: formData.specialRequest,
        roomType: formData.roomType,
        roomPrice: formData.roomPrice,
        roomId: availableRoom.id,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        paymentMethod: formData.paymentMethod,
        status: "PENDING",
      };

      try {
        // Pass the data to the parent component
        await onSubmit(bookingData);

        // Show success state
        setIsSuccess(true);
        setToast({
          message: "Booking created successfully!",
          type: "success",
        });

        // Show success popup
        const successPopup = document.createElement("div");
        successPopup.className =
          "fixed inset-0 flex items-center justify-center z-[100] bg-black/30 backdrop-blur-sm";
        successPopup.innerHTML = `
          <div class="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4 flex flex-col items-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Booking Created Successfully!</h3>
            <p class="text-gray-600 text-center mb-4">Your booking has been saved and is now in the system.</p>
            <button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Continue
            </button>
          </div>
        `;
        document.body.appendChild(successPopup);

        // Add click event to close the popup
        successPopup.addEventListener("click", (e) => {
          if (e.target === successPopup) {
            document.body.removeChild(successPopup);
            onClose();
          }
        });

        // Auto-close the popup after 3 seconds
        setTimeout(() => {
          if (document.body.contains(successPopup)) {
            document.body.removeChild(successPopup);
          }
          onClose();
        }, 3000);

        // Reset form
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          adults: 1,
          kids: 0,
          specialRequest: "",
          roomType: "STANDARD",
          roomPrice: ROOM_PRICES.STANDARD,
          roomId: "",
          checkIn: "",
          checkOut: "",
          paymentMethod: "CASH",
        });
      } catch (error) {
        // Check if the error is related to date availability
        if (error instanceof Error) {
          setToast({
            message: error.message,
            type: "error",
          });
        } else {
          // Handle other booking creation errors
          setToast({
            message: "Failed to create booking. Please try again.",
            type: "error",
          });
        }
      }
    } catch (error) {
      // Handle any unexpected errors
      setToast({
        message: "An unexpected error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">
                Add New Booking
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {isSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Booking created successfully!
              </div>
            )}

            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Type
              </label>
              <div className="relative">
                <Hotel className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-500" />
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  required
                  className="pl-10 w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                >
                  <option value="STANDARD">Standard Room - Ksh 8,000</option>
                  <option value="DELUXE">Deluxe Room - Ksh 10,000</option>
                  <option value="SUITE">Executive Suite - Ksh 12,000</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        checkIn: date ? date.toLocaleDateString("en-CA") : "",
                        checkOut: "", // Reset checkout when checkin changes
                      }))
                    }
                    excludeDates={unavailableDates}
                    minDate={new Date()}
                    dateFormat="yyyy-MM-dd"
                    className="pl-10 w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/90 shadow-[0_2px_8px_-1px_rgba(0,0,0,0.1)] backdrop-blur-sm transition-all duration-300 group-hover:border-purple-300 hover:bg-white hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.12)]"
                    placeholderText="Select check-in date"
                    required
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        checkOut: date ? date.toLocaleDateString("en-CA") : "",
                      }))
                    }
                    excludeDates={unavailableDates}
                    minDate={
                      formData.checkIn ? new Date(formData.checkIn) : new Date()
                    }
                    dateFormat="yyyy-MM-dd"
                    className="pl-10 w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/90 shadow-[0_2px_8px_-1px_rgba(0,0,0,0.1)] backdrop-blur-sm transition-all duration-300 group-hover:border-purple-300 hover:bg-white hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.12)]"
                    placeholderText="Select check-out date"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adults
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-500" />
                  <input
                    type="number"
                    name="adults"
                    min="1"
                    value={formData.adults}
                    onChange={handleChange}
                    required
                    className="pl-10 w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kids
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-500" />
                  <input
                    type="number"
                    name="kids"
                    min="0"
                    value={formData.kids}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-500" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="pl-10 w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="pl-10 w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-500" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="pl-10 w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    placeholder="+254 XXX XXX XXX"
                  />
                </div>
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requests
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-purple-500" />
                <textarea
                  name="specialRequest"
                  value={formData.specialRequest}
                  onChange={handleChange}
                  rows={3}
                  className="pl-10 w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  placeholder="Any special requests or requirements?"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <div className="relative">
                <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-500" />
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  required
                  className="pl-10 w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                >
                  <option value="CASH">Cash</option>
                  <option value="MPESA">M-PESA</option>
                  <option value="BANK_TRANSFER">Card</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating..." : "Create Booking"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
