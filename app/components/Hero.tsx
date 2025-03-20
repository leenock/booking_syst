'use client';

import { useState } from 'react';
import { CalendarIcon, UserGroupIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function Hero() {
  const router = useRouter();
  const [guests, setGuests] = useState(1);
  const [roomType, setRoomType] = useState('any');
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut) return;
    
    // Create query parameters
    const params = new URLSearchParams({
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      guests: guests.toString(),
      roomType
    });

    // Navigate to explore page with search parameters
    router.push(`/explore?${params.toString()}`);
  };

  // Custom input component to maintain our styling
  const CustomInput = ({ value, onClick, label }: { value: string; onClick: () => void; label: string }) => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onClick={onClick}
          readOnly
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
          placeholder="Select date"
        />
        <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );

  return (
    <section className="relative min-h-[85vh] flex items-center bg-gray-900">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/luxury-room.jpg"
          alt="Luxury Hotel Room"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4 animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-serif">
                Experience Luxury <br />
                <span className="text-amber-400">Like Never Before</span>
              </h1>
              <p className="text-lg text-gray-300 max-w-xl">
                Discover the perfect blend of comfort and elegance in our carefully curated selection of rooms and suites.
              </p>
            </div>

            {/* Stats */}
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

          {/* Right Column - Booking Form */}
          <div className="lg:justify-self-end w-full lg:max-w-md">
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-xl animate-fade-in-up animation-delay-150">
              <h2 className="text-2xl font-bold text-white mb-6">Book Your Stay</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Check-in & Check-out */}
                <div className="grid grid-cols-2 gap-4">
                  <DatePicker
                    selected={checkIn}
                    onChange={(date) => setCheckIn(date)}
                    selectsStart
                    startDate={checkIn}
                    endDate={checkOut}
                    minDate={new Date()}
                    required
                    customInput={<CustomInput label="Check-in" value="" onClick={() => {}} />}
                    wrapperClassName="w-full"
                    calendarClassName="!bg-gray-800 !text-white !border-gray-700"
                    dateFormat="MMM dd, yyyy"
                  />
                  <DatePicker
                    selected={checkOut}
                    onChange={(date) => setCheckOut(date)}
                    selectsEnd
                    startDate={checkIn}
                    endDate={checkOut}
                    minDate={checkIn || new Date()}
                    required
                    customInput={<CustomInput label="Check-out" value="" onClick={() => {}} />}
                    wrapperClassName="w-full"
                    calendarClassName="!bg-gray-800 !text-white !border-gray-700"
                    dateFormat="MMM dd, yyyy"
                  />
                </div>

                {/* Room Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Room Type</label>
                  <div className="relative">
                    <select
                      value={roomType}
                      onChange={(e) => setRoomType(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white appearance-none focus:outline-none focus:border-amber-400 transition-colors"
                    >
                      <option value="any" className="bg-gray-900">Any Room</option>
                      <option value="standard" className="bg-gray-900">Standard Room</option>
                      <option value="deluxe" className="bg-gray-900">Deluxe Room</option>
                      <option value="suite" className="bg-gray-900">Executive Suite</option>
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Guests */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Guests</label>
                  <div className="relative">
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white appearance-none focus:outline-none focus:border-amber-400 transition-colors"
                    >
                      {[1, 2, 3, 4].map((num) => (
                        <option key={num} value={num} className="bg-gray-900">
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                    <UserGroupIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Submit Button */}
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
      </div>

      {/* Add custom styles for the date picker */}
      <style jsx global>{`
        .react-datepicker {
          font-family: inherit;
          border-radius: 0.5rem;
          border: 1px solid rgb(75 85 99);
        }
        .react-datepicker__header {
          background-color: rgb(31 41 55);
          border-bottom: 1px solid rgb(75 85 99);
        }
        .react-datepicker__current-month,
        .react-datepicker__day-name {
          color: white;
        }
        .react-datepicker__day {
          color: rgb(209 213 219);
        }
        .react-datepicker__day:hover {
          background-color: rgb(55 65 81);
        }
        .react-datepicker__day--selected,
        .react-datepicker__day--in-range {
          background-color: rgb(245 158 11) !important;
          color: white !important;
        }
        .react-datepicker__day--keyboard-selected {
          background-color: rgb(245 158 11);
          color: white;
        }
        .react-datepicker__day--disabled {
          color: rgb(75 85 99);
        }
        .react-datepicker__navigation-icon::before {
          border-color: white;
        }
        .react-datepicker__navigation:hover *::before {
          border-color: rgb(245 158 11);
        }
      `}</style>
    </section>
  );
} 