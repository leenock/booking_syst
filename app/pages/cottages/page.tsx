'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { CalendarIcon, Users2, Bed, Bath, Home, Coffee } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Footer from '@/app/components/landingpage/Footer';


const cottages = [
  {
    id: 1,
    name: 'Standard Room',
    description: 'Serene cottage with stunning lake views, perfect for a romantic getaway.',
    price: 8000,
    image: '/images/bed1.webp',
    beds: 1,
    baths: 1,
    maxGuests: 2,
    amenities: ['High-speed WiFi', '4K Smart TV']
  },
  {
    id: 2,
    name: 'Deluxe Room',
    description: 'Spacious villa with multiple bedrooms, ideal for family vacations.',
    price: 10000,
    image: '/images/bed2.webp',
    beds: 3,
    baths: 2,
    maxGuests: 6,
    amenities: ['High-speed WiFi', '4K Smart TV', 'Premium Coffee Station', 'Mini Bar']
  },
  {
    id: 3,
    name: 'Executive Suite',
    description: 'Luxury cottage with modern amenities and private pool.',
    price: 12000,
    image: '/images/bed3.jpg',
    beds: 2,
    baths: 2,
    maxGuests: 4,
    amenities: ['High-speed WiFi', '4K Smart TV', 'Premium Coffee Station', 'Mini Bar']
  }
];

export default function CottagesPage() {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  const [selectedCottage, setSelectedCottage] = useState<number | null>(null);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkIn || !checkOut) return;

    const params = new URLSearchParams({
      checkIn: checkIn.toISOString().split('T')[0],
      checkOut: checkOut.toISOString().split('T')[0],
      adults: guests.toString(),
      children: '0',
      roomType: selectedCottage ? selectedCottage.toString() : 'any'
    });

    router.push(`/pages/booking?${params.toString()}`);
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
                Experience the perfect blend of comfort and nature in our exclusive cottages.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Booking Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-12 -mt-20 relative z-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Your Stay</h2>
            <form onSubmit={handleBooking} className="space-y-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                  <DatePicker
                    selected={checkIn}
                    onChange={(date) => setCheckIn(date)}
                    selectsStart
                    startDate={checkIn}
                    endDate={checkOut}
                    minDate={new Date()}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholderText="Select date"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                  <DatePicker
                    selected={checkOut}
                    onChange={(date) => setCheckOut(date)}
                    selectsEnd
                    startDate={checkIn}
                    endDate={checkOut}
                    minDate={checkIn || new Date()}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholderText="Select date"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cottage Type</label>
                  <select
                    value={selectedCottage || ''}
                    onChange={(e) => setSelectedCottage(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select a cottage</option>
                    {cottages.map((cottage) => (
                      <option key={cottage.id} value={cottage.id}>
                        {cottage.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-amber-600 to-amber-500 text-white px-12 py-4 rounded-lg
                    transform hover:scale-[1.02] hover:from-amber-700 hover:to-amber-600
                    transition-all duration-300 shadow-lg hover:shadow-xl
                    flex items-center justify-center space-x-3 font-medium text-lg
                    relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-300 opacity-0 
                    group-hover:opacity-20 transition-opacity duration-300"></div>
                  <CalendarIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  <span className="group-hover:tracking-wide transition-all duration-300">
                    Check Availability
                  </span>
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
                    <h3 className="text-2xl font-bold text-gray-900">{cottage.name}</h3>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-amber-600">ksh {cottage.price}</span>
                      <span className="text-gray-500 text-sm">/night</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6">{cottage.description}</p>
                  
                  {/* Features */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Bed className="w-5 h-5 mr-2 text-amber-600" />
                      {cottage.beds} {cottage.beds === 1 ? 'Bed' : 'Beds'}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Bath className="w-5 h-5 mr-2 text-amber-600" />
                      {cottage.baths} {cottage.baths === 1 ? 'Bath' : 'Baths'}
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
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {cottage.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm flex items-center"
                        >
                          <Coffee className="w-4 h-4 mr-1" />
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
