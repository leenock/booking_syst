'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarIcon, UserGroupIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function Hero() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: '1',
    roomType: 'any'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams({
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      adults: formData.guests,
      children: '0',
      roomType: formData.roomType
    });

    router.push(`/pages/booking?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[85vh] flex items-center bg-gray-900">
      {/* Background Image with Overlay */}
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
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-xl animate-fade-in-up animation-delay-150">
            <h2 className="text-2xl font-bold text-white mb-6">Book Your Stay</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Check-in & Check-out */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Check-in</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="checkIn"
                      value={formData.checkIn}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
                      required
                      onFocus={(e) => e.target.showPicker()}
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Check-out</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="checkOut"
                      value={formData.checkOut}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
                      required
                      onFocus={(e) => e.target.showPicker()}
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Room Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Room Type</label>
                <div className="relative">
                  <select
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleInputChange}
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
                    name="guests"
                    value={formData.guests}
                    onChange={handleInputChange}
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
    </section>
  );
}
