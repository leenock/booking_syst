'use client';

import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/app/components/landingpage/Footer';

const meetingSpaces = [
  {
    id: 1,
    title: 'Grand Boardroom',
    image: '/images/meet3.jpg',
  },
  {
    id: 2,
    title: 'Executive Meeting Room',
    image: '/images/meet4.jpg',
  },
  {
    id: 3,
    title: 'Conference Hall',
    image: '/images/meet8.jpg',
  },
  {
    id: 4,
    title: 'Dining Room',
    image: '/images/dining.jpg',
  },
  {
    id: 5,
    title: 'Training Room',
    image: '/images/training.jpg',
  },
  {
    id: 6,
    title: 'Family Lobby',
    image: '/images/family.jpg',
  },
];

export default function MeetingEventsPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-amber-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-serif">
              Meeting & Event Spaces
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our sophisticated venues designed for your business needs and special occasions.
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meetingSpaces.map((space) => (
              <div
                key={space.id}
                className="group relative aspect-square rounded-xl overflow-hidden"
              >
                <Image
                  src={space.image}
                  alt={space.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-xl font-bold text-white">
                      {space.title}
                    </h3>
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
