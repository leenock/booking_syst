"use client";

import Sidebar from "@/app/components/user_dash/Sidebar";
import {
  CalendarDays,
  ArrowRight,
  Hotel,
  Users,
  User,
  Mail,
  Phone,
  MessageSquare,
  Wallet,
  Calendar,
} from "lucide-react";
import { useState, useEffect } from "react";
import AuthService from "@/app/services/auth";
import Toast from "@/app/components/ui/Toast";
import UserAuthService from "@/app/services/user_auth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

export default function BookRoom() {
  const [userData, setUserData] = useState<any>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhoneNumber] = useState("");

  // Load user data
  const loadUserData = () => {
    const user = UserAuthService.getUserData();
    if (user) {
      setUserData(user);
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setPhoneNumber(user.phone || "");
    }
  };
  useEffect(() => {
    loadUserData();
  }, []);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    if (!formData.phone) {
      setToast({
        message: "Phone number is required",
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
        // Make API request to create booking
        const response = await fetch("http://localhost:5000/api/booking", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AuthService.getToken()}`,
          },
          body: JSON.stringify(bookingData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create booking");
        }

        // Show success state
        setIsSuccess(true);
        setToast({
          message: "Booking created successfully!",
          type: "success",
        });

        // Show success popup

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

  // Function to calculate total amount
  const calculateTotalAmount = () => {
    if (!formData.checkIn || !formData.checkOut) return formData.roomPrice;

    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return formData.roomPrice * (nights > 0 ? nights : 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onOpenChange={setIsSidebarOpen} />

      {/* Main Content */}
      <div className="md:pl-64 min-h-screen transition-all duration-200">
        {/* Page Header */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4 flex items-center justify-center md:justify-start gap-3">
              <CalendarDays className="w-6 h-6 text-purple-500" />
              <h1 className="text-xl font-semibold text-gray-900">
                Book A Room
              </h1>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Room Booking Form
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Fill in the details below to book your room
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                      className="pl-10 w-full sm:w-[540px] md:w-[500px] lg:w-[560px] px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/90 shadow-[0_2px_8px_-1px_rgba(0,0,0,0.1)] backdrop-blur-sm transition-all duration-300 group-hover:border-purple-300 hover:bg-white hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.12)]"
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
                      className="pl-10 w-full sm:w-[540px] md:w-[500px] lg:w-[560px] px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/90 shadow-[0_2px_8px_-1px_rgba(0,0,0,0.1)] backdrop-blur-sm transition-all duration-300 group-hover:border-purple-300 hover:bg-white hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.12)]"
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
                      placeholder="johndoe@example.com"
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

              {/* Summary Section */}
              {formData.checkIn && formData.checkOut && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-md font-medium text-gray-700 mb-3">
                    Booking Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Room Type:</span>
                      <span className="font-medium">
                        {formData.roomType} Room
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price Per Night:</span>
                      <span className="font-medium">
                        Ksh {formData.roomPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-in Date:</span>
                      <span className="font-medium">
                        {new Date(formData.checkIn).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-out Date:</span>
                      <span className="font-medium">
                        {new Date(formData.checkOut).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Number of Nights:</span>
                      <span className="font-medium">
                        {Math.ceil(
                          (new Date(formData.checkOut).getTime() -
                            new Date(formData.checkIn).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total Amount:</span>
                        <span>
                          Ksh {calculateTotalAmount().toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? "Processing..." : "Book Now"}
                  {!isLoading && <ArrowRight className="h-4 w-4" />}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
