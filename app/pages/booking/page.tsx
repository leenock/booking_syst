'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { Calendar, Phone, Mail, User, Hotel, Users, CreditCard, MessageSquare, Tag } from 'lucide-react';

export default function BookingPage() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    adults: searchParams.get('adults') || '1',
    children: searchParams.get('children') || '0',
    roomType: searchParams.get('roomType') || '',
    fullName: '',
    email: '',
    phone: '',
    specialRequests: '',
    promoCode: '',
    paymentMethod: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const roomTypes = [
    { id: 'standard', name: 'Standard Room', price: 150 },
    { id: 'deluxe', name: 'Deluxe Room', price: 250 },
    { id: 'suite', name: 'Executive Suite', price: 350 },
    { id: 'presidential', name: 'Presidential Suite', price: 500 },
  ];

  const paymentMethods = [
    { id: 'mpesa', name: 'M-Pesa' },
    { id: 'card', name: 'Credit/Debit Card' },
    { id: 'bank', name: 'Bank Transfer' },
    { id: 'cash', name: 'Cash on Arrival' },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Here you would typically make an API call to your backend
      console.log('Booking submitted:', formData);
      // Redirect to confirmation page
      window.location.href = '/booking/confirmation';
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
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
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-10 relative overflow-hidden border-2 border-gray-100">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100/30 to-pink-100/30 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl -ml-32 -mb-32"></div>

          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 w-24 h-24 border-t-3 border-l-3 border-purple-400 rounded-tl-3xl"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 border-b-3 border-r-3 border-pink-400 rounded-br-3xl"></div>

          {/* Animated dots */}
          <div className="absolute top-10 right-10 w-20 h-20">
            <div className="absolute w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
            <div className="absolute w-2 h-2 bg-purple-400 rounded-full"></div>
          </div>
          <div className="absolute bottom-10 left-10 w-20 h-20">
            <div className="absolute w-2 h-2 bg-pink-400 rounded-full animate-ping delay-300"></div>
            <div className="absolute w-2 h-2 bg-pink-400 rounded-full"></div>
          </div>

          <div className="relative">
            <div className={`transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text mb-2">Complete Your Booking</h1>
              <p className="text-gray-600 mb-8">Fill in the details below to secure your reservation</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Dates and Guests */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-500" />
                    <input
                      type="date"
                      name="checkIn"
                      value={formData.checkIn}
                      onChange={handleInputChange}
                      required
                      className="pl-10 w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/90 shadow-[0_2px_8px_-1px_rgba(0,0,0,0.1)] backdrop-blur-sm transition-all duration-300 group-hover:border-purple-300 hover:bg-white hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.12)]"
                    />
                  </div>
                </div>
                
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-500" />
                    <input
                      type="date"
                      name="checkOut"
                      value={formData.checkOut}
                      onChange={handleInputChange}
                      required
                      className="pl-10 w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/90 shadow-[0_2px_8px_-1px_rgba(0,0,0,0.1)] backdrop-blur-sm transition-all duration-300 group-hover:border-purple-300 hover:bg-white hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.12)]"
                    />
                  </div>
                </div>
              </div>

              {/* Guests Count */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adults</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-500" />
                    <input
                      type="number"
                      name="adults"
                      min="1"
                      value={formData.adults}
                      onChange={handleInputChange}
                      required
                      className="pl-10 w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/90 shadow-[0_2px_8px_-1px_rgba(0,0,0,0.1)] backdrop-blur-sm transition-all duration-300 group-hover:border-purple-300 hover:bg-white hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.12)]"
                    />
                  </div>
                </div>
                
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Children</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-500" />
                    <input
                      type="number"
                      name="children"
                      min="0"
                      value={formData.children}
                      onChange={handleInputChange}
                      className="pl-10 w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/90 shadow-[0_2px_8px_-1px_rgba(0,0,0,0.1)] backdrop-blur-sm transition-all duration-300 group-hover:border-purple-300 hover:bg-white hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.12)]"
                    />
                  </div>
                </div>
              </div>

              {/* Room Type */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                <div className="relative">
                  <Hotel className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-500" />
                  <select
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleInputChange}
                    required
                    className="pl-10 w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/90 shadow-[0_2px_8px_-1px_rgba(0,0,0,0.1)] backdrop-blur-sm transition-all duration-300 group-hover:border-purple-300 hover:bg-white hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.12)]"
                  >
                    <option value="">Select a room type</option>
                    {roomTypes.map(room => (
                      <option key={room.id} value={room.id}>
                        {room.name} - ${room.price}/night
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-500" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="pl-10 w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/90 shadow-[0_2px_8px_-1px_rgba(0,0,0,0.1)] backdrop-blur-sm transition-all duration-300 group-hover:border-purple-300 hover:bg-white hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.12)]"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-500" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="pl-10 w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/90 shadow-[0_2px_8px_-1px_rgba(0,0,0,0.1)] backdrop-blur-sm transition-all duration-300 group-hover:border-purple-300 hover:bg-white hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.12)]"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Phone Number */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-500" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="pl-10 w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/90 shadow-[0_2px_8px_-1px_rgba(0,0,0,0.1)] backdrop-blur-sm transition-all duration-300 group-hover:border-purple-300 hover:bg-white hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.12)]"
                    placeholder="+254 XXX XXX XXX"
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-purple-500" />
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    rows={3}
                    className="pl-10 w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/90 shadow-[0_2px_8px_-1px_rgba(0,0,0,0.1)] backdrop-blur-sm transition-all duration-300 group-hover:border-purple-300 hover:bg-white hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.12)]"
                    placeholder="Any special requests or requirements?"
                  />
                </div>
              </div>

              {/* Promo Code */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-500" />
                  <input
                    type="text"
                    name="promoCode"
                    value={formData.promoCode}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/90 shadow-[0_2px_8px_-1px_rgba(0,0,0,0.1)] backdrop-blur-sm transition-all duration-300 group-hover:border-purple-300 hover:bg-white hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.12)]"
                    placeholder="Enter promo code if available"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-500" />
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    required
                    className="pl-10 w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/90 shadow-[0_2px_8px_-1px_rgba(0,0,0,0.1)] backdrop-blur-sm transition-all duration-300 group-hover:border-purple-300 hover:bg-white hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.12)]"
                  >
                    <option value="">Select payment method</option>
                    {paymentMethods.map(method => (
                      <option key={method.id} value={method.id}>
                        {method.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-base font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Complete Booking'
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
} 