"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {

  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";

export default function Hero() {
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const router = useRouter();
  const today = new Date();

  const [formData, setFormData] = useState({
    checkIn: null as Date | null,
    checkOut: null as Date | null,
    roomType: "any",
  });

  useEffect(() => {
    const fetchUnavailableDates = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/booking/booked_dates"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch unavailable dates");
        }
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
      }
    };

    fetchUnavailableDates();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    <section className="relative min-h-[85vh] flex items-center bg-gray-900">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/luxury.jpg"
          alt="Luxury Hotel Room"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4 animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-serif">
                Experience Luxury <br />
                <span className="text-amber-400">Like Never Before</span>
              </h1>
              <p className="text-lg text-gray-300 max-w-xl">
                Discover the perfect blend of comfort and elegance in our
                carefully curated selection of rooms and suites.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-8 py-8 border-t border-white/10 animate-fade-in-up animation-delay-300">
              <div>
                <h3 className="text-3xl font-bold text-amber-400">20+</h3>
                <p className="text-sm text-gray-400">Luxury Rooms</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-amber-400">4.9</h3>
                <p className="text-sm text-gray-400">Guest Rating</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-amber-400">24/7</h3>
                <p className="text-sm text-gray-400">Room Service</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-xl animate-fade-in-up animation-delay-150">
            <h2 className="text-2xl font-bold text-white mb-6">
              Book Your Stays
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Check-in
                  </label>
                  <DatePicker
                    selected={formData.checkIn}
                    onChange={(date) => {
                      setFormData({
                        ...formData,
                        checkIn: date,
                        checkOut:
                          formData.checkOut && date && formData.checkOut < date
                            ? null
                            : formData.checkOut,
                      });
                    }}
                    excludeDates={unavailableDates}
                    minDate={today}
                    placeholderText="Select check-in date"
                    selectsStart
                    startDate={formData.checkIn}
                    endDate={formData.checkOut}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Check-out
                  </label>
                  <DatePicker
                    selected={formData.checkOut}
                    onChange={(date) =>
                      setFormData({ ...formData, checkOut: date })
                    }
                    excludeDates={unavailableDates}
                    minDate={formData.checkIn || today}
                    placeholderText="Select check-out date"
                    selectsEnd
                    startDate={formData.checkIn}
                    endDate={formData.checkOut}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Room Type
                </label>
                <div className="relative">
                  <select
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white appearance-none focus:outline-none focus:border-amber-400 transition-colors"
                  >
                    <option value="any" className="bg-gray-900">
                      Any Room
                    </option>
                    <option value="standard" className="bg-gray-900">
                      Standard Room
                    </option>
                    <option value="deluxe" className="bg-gray-900">
                      Deluxe Room
                    </option>
                    <option value="suite" className="bg-gray-900">
                      Executive Suite
                    </option>
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg mt-6"
              >
                Check Availability
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
