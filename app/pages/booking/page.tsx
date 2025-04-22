"use client";

import {
  ArrowRight,
  Hotel,
  Users,
  User,
  Mail,
  Phone,
  MessageSquare,
  ClipboardCheck,
  Loader2,
  Wallet,
  Calendar,
} from "lucide-react";
import { useState, useEffect } from "react";
import AuthService from "@/app/services/auth";
import Toast from "@/app/components/ui/Toast";
import UserAuthService from "@/app/services/user_auth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import Navbar from "@/components/Navbar";
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
    else if (!/^\+[1-9]\d{1,14}$/.test(formData.phone)) {
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
    <div className="min-h-screen relative overflow-visible bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/luxury.jpg"
          alt="Background"
          fill
          className="object-cover object-center opacity-15"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/90 via-purple-50/90 to-pink-50/90"></div>
      </div>

      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8 pt-24 relative">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden border border-gray-100">
          {/* Improved decorative elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-purple-200/40 to-pink-200/40 rounded-full blur-3xl -mr-40 -mt-40 opacity-70"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-blue-200/40 to-purple-200/40 rounded-full blur-3xl -ml-40 -mb-40 opacity-70"></div>

          {/* Enhanced corner accents */}
          <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-purple-500/30 rounded-tl-3xl"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-pink-500/30 rounded-br-3xl"></div>

          {/* Enhanced animated dots */}
          <div className="absolute top-12 right-12 w-24 h-24">
            <div className="absolute w-3 h-3 bg-purple-500/70 rounded-full animate-ping"></div>
            <div className="absolute w-3 h-3 bg-purple-500/50 rounded-full"></div>
          </div>
          <div className="absolute bottom-12 left-12 w-24 h-24">
            <div className="absolute w-3 h-3 bg-pink-500/70 rounded-full animate-ping delay-300"></div>
            <div className="absolute w-3 h-3 bg-pink-500/50 rounded-full"></div>
          </div>

          <div className="relative">
            <div className="text-center mb-10">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-transparent bg-clip-text mb-3">
                Complete Your Booking
              </h1>
              <p className="text-gray-600 text-lg max-w-xl mx-auto">
                Fill in the details below to secure your reservation at our
                luxury accommodations
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-purple-700 mb-4 flex items-center">
                  <Hotel className="mr-2 h-5 w-5" />
                  Room Selection
                </h3>

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
                      className="pl-10 w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 hover:border-purple-300 bg-white/90"
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
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-purple-700 mb-4 flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Stay Details
                </h3>

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
                            checkIn: date
                              ? date.toLocaleDateString("en-CA")
                              : "",
                            checkOut: "", // Reset checkout when checkin changes
                          }))
                        }
                        excludeDates={unavailableDates}
                        minDate={new Date()}
                        dateFormat="yyyy-MM-dd"
                        className="pl-10 w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/90 shadow-sm transition-all duration-300 group-hover:border-purple-300 hover:bg-white hover:shadow-md"
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
                        className="pl-10 w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/90 shadow-sm transition-all duration-300 group-hover:border-purple-300 hover:bg-white hover:shadow-md"
                        placeholderText="Select check-out date"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
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
                        className="pl-10 w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 hover:border-purple-300 bg-white/90"
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
                        className="pl-10 w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 hover:border-purple-300 bg-white/90"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-purple-700 mb-4 flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Personal Information
                </h3>

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
                        className="pl-10 w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 hover:border-purple-300 bg-white/90"
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
                        className="pl-10 w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 hover:border-purple-300 bg-white/90"
                        placeholder="johndoe@example.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
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
                        className="pl-10 w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 hover:border-purple-300 bg-white/90"
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
                        className="pl-10 w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 hover:border-purple-300 bg-white/90"
                      >
                        <option value="CASH">Cash</option>
                        <option value="MPESA">M-PESA</option>
                        <option value="BANK_TRANSFER">Card</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
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
                      className="pl-10 w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 hover:border-purple-300 bg-white/90"
                      placeholder="Any special requests or requirements?"
                    />
                  </div>
                </div>
              </div>

              {/* Enhanced Summary Section */}
              {formData.checkIn && formData.checkOut && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 border border-purple-100">
                  <h3 className="text-xl font-semibold text-purple-700 mb-4 flex items-center">
                    <ClipboardCheck className="mr-2 h-5 w-5" />
                    Booking Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-purple-100">
                      <span className="text-gray-600">Room Type:</span>
                      <span className="font-medium text-purple-800">
                        {formData.roomType} Room
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-purple-100">
                      <span className="text-gray-600">Price Per Night:</span>
                      <span className="font-medium text-purple-800">
                        Ksh {formData.roomPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-purple-100">
                      <span className="text-gray-600">Check-in Date:</span>
                      <span className="font-medium text-purple-800">
                        {new Date(formData.checkIn).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-purple-100">
                      <span className="text-gray-600">Check-out Date:</span>
                      <span className="font-medium text-purple-800">
                        {new Date(formData.checkOut).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-purple-100">
                      <span className="text-gray-600">Number of Nights:</span>
                      <span className="font-medium text-purple-800">
                        {Math.ceil(
                          (new Date(formData.checkOut).getTime() -
                            new Date(formData.checkIn).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}
                      </span>
                    </div>
                    <div className="pt-3 mt-2">
                      <div className="flex justify-between items-center font-bold text-lg">
                        <span className="text-purple-900">Total Amount:</span>
                        <span className="text-purple-900 bg-purple-100 px-4 py-2 rounded-lg">
                          Ksh {calculateTotalAmount().toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3 text-base font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 border border-transparent rounded-xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg transition-all duration-300 hover:shadow-xl"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Book Now
                      <ArrowRight className="h-5 w-5 ml-1" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
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
