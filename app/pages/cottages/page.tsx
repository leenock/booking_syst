"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/app/components/landingpage/Footer";
import { Home, Users2, Bath, Bed, Coffee, CalendarIcon } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";

const cottages = [
  {
    id: "standard",
    name: "Standard Room",
    description:
      "Standard size room with stunning view, perfect for a romantic getaway.",
    price: 8000,
    image: "/images/bed1.webp",
    beds: "Single Occupancy",
    baths: 1,
    maxGuests: 2,
    amenities: ["High-speed WiFi"],
  },
  {
    id: "deluxe",
    name: "Deluxe Room",
    description:
      "Spacious cottage, ideal for family vacations.",
    price: 10000,
    image: "/images/bed2.webp",
    beds: "Single Occupancy",
    baths: 1,
    maxGuests: 2,
    amenities: [
      "High-speed WiFi",
      "Premium Coffee Station",
      
    ],
  },
  {
    id: "suite",
    name: "Executive Suite",
    description: "Luxury cottage with modern amenities.",
    price: 12000,
    image: "/images/bed3.jpg",
    beds: "Double Occupancy",
    baths: 1,
    maxGuests: 2,
    amenities: [
      "High-speed WiFi",
      "4K Smart TV",
      "Premium Coffee Station",
      "Mini Bar",
    ],
  },
];

type RoomType = "STANDARD" | "DELUXE" | "SUITE";

export default function Hero() {
  const router = useRouter();
  const today = new Date();

  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [isLoadingDates, setIsLoadingDates] = useState(false);
  const [formData, setFormData] = useState<{
    checkIn: Date | null;
    checkOut: Date | null;
    roomType: RoomType;
  }>({
    checkIn: null,
    checkOut: null,
    roomType: "STANDARD",
  });

  useEffect(() => {
    const fetchUnavailableDates = async () => {
      setIsLoadingDates(true);
      try {
        const endpoint = `http://localhost:5000/api/booking/booked_dates/${formData.roomType}`;
        const response = await fetch(endpoint);

        if (!response.ok) throw new Error("Failed to fetch unavailable dates");

        const data = await response.json();
        let parsedDates: Date[] = [];

        if (Array.isArray(data)) {
          parsedDates = data.map((dateString: string) => new Date(dateString));
        } else if (data && typeof data === "object") {
          const datesArray =
            data.dates || data.bookedDates || data.unavailableDates || [];
          if (Array.isArray(datesArray)) {
            parsedDates = datesArray.map(
              (dateString: string) => new Date(dateString)
            );
          }
        }

        setUnavailableDates(parsedDates);
      } catch (error) {
        console.error("Error fetching unavailable dates:", error);
        setUnavailableDates([new Date("2025-04-20"), new Date("2025-04-29")]);
      } finally {
        setIsLoadingDates(false);
      }
    };

    fetchUnavailableDates();
  }, [formData.roomType]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "roomType") {
      setFormData((prev) => ({
        ...prev,
        roomType: value.toUpperCase() as RoomType,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.checkIn || !formData.checkOut) {
      toast.error("Please select both check-in and check-out dates.");
      return;
    }

    const params = new URLSearchParams({
      checkIn: formData.checkIn.toLocaleDateString("en-CA"),
      checkOut: formData.checkOut.toLocaleDateString("en-CA"),
      roomType: formData.roomType,
    });

    toast.success("Room is available!", {
      duration: 2000,
      style: {
        background: "#1f2937",
        color: "#fff",
      },
    });

    setTimeout(() => {
      router.push(`/pages/booking?${params.toString()}`);
    }, 2100);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-amber-50">
        {/* Hero Section */}
        <div className="relative h-[40vh] bg-gray-900">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30" />
          <Image
            src="/images/luxury.jpg"
            alt="Cottages Hero"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-serif drop-shadow-lg">
                Luxury Cottages
              </h1>
              <p className="text-xl text-white max-w-2xl mx-auto px-4 drop-shadow-lg">
                Experience the perfect blend of comfort and nature in our
                exclusive cottages.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Booking Section */}
          <div className="bg-black rounded-2xl shadow-lg p-8 mb-12 -mt-20 relative z-10">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Book Your Stay
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-3 gap-2">
                {/* Room Type */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Room Type
                  </label>
                  <div className="relative">
                    <select
                      name="roomType"
                      value={formData.roomType}
                      onChange={handleInputChange}
                      className="w-[325px] sm:w-[300px] md:w-[350px] bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                    >
                      <option value="STANDARD" className="bg-gray-900">
                        Standard Room - Ksh 8000
                      </option>
                      <option value="DELUXE" className="bg-gray-900">
                        Deluxe Room - Ksh 10000
                      </option>
                      <option value="SUITE" className="bg-gray-900">
                        Executive Suite - Ksh 12000
                      </option>
                    </select>
                    <Home className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Check-in Date */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Check-in
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={formData.checkIn}
                      onChange={(date) => {
                        setFormData((prev) => ({
                          ...prev,
                          checkIn: date,
                          checkOut:
                            date && prev.checkOut && prev.checkOut < date
                              ? null
                              : prev.checkOut,
                        }));
                      }}
                      excludeDates={unavailableDates}
                      minDate={today}
                      placeholderText="Select check-in date"
                      selectsStart
                      startDate={formData.checkIn}
                      endDate={formData.checkOut}
                      className="w-[325px] sm:w-[300px] md:w-[350px] bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                      disabled={isLoadingDates}
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white pointer-events-none" />
                  </div>
                </div>

                {/* Check-out Date */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Check-out
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={formData.checkOut}
                      onChange={(date) =>
                        setFormData((prev) => ({
                          ...prev,
                          checkOut: date,
                        }))
                      }
                      excludeDates={unavailableDates}
                      minDate={formData.checkIn || today}
                      placeholderText="Select check-out date"
                      selectsEnd
                      startDate={formData.checkIn}
                      endDate={formData.checkOut}
                      className="w-[325px] sm:w-[300px] md:w-[350px] bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                      disabled={isLoadingDates}
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full sm:w-[300px] md:w-[350px] flex justify-center items-center  bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                  disabled={isLoadingDates}
                >
                  {isLoadingDates ? "Loading..." : "Check Availability"}
                </button>
              </div>
            </form>
          </div>

          {/* Cottages Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cottages.map((cottage) => (
              <div
                key={cottage.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-64">
                  <Image
                    src={cottage.image}
                    alt={cottage.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {cottage.name}
                    </h3>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-amber-600">
                        ksh {cottage.price}
                      </span>
                      <span className="text-gray-500 text-sm">/night</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6">{cottage.description}</p>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Bed className="w-5 h-5 mr-2 text-amber-600" />
                      {cottage.beds}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Bath className="w-5 h-5 mr-2 text-amber-600" />
                      {cottage.baths} {cottage.baths === 1 ? "Bath" : "Baths"}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users2 className="w-5 h-5 mr-2 text-amber-600" />
                      Up to {cottage.maxGuests} guests
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Home className="w-5 h-5 mr-2 text-amber-600" />
                      Private Cottage
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      Amenities
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {cottage.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm flex items-center"
                        >
                          <span className="w-4 h-4 mr-1" />
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
