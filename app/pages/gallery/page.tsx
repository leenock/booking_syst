'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Search, MapPin, Star, Camera } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/app/components/landingpage/Footer';

const galleryImages = [
  {
    id: 1,
    title: 'Luxury Suite',
    location: 'Executive Floor',
    rating: 4.9,
    image: '/images/bed1.webp',
    category: 'rooms',
    description: 'Experience ultimate luxury in our Executive Suite with panoramic views.',
  },
  {
    id: 2,
    title: 'Deluxe Room',
    location: 'City View',
    rating: 4.8,
    image: '/images/bed2.webp',
    category: 'rooms',
    description: 'Spacious and elegant room with premium furnishings.',
  },
  {
    id: 3,
    title: 'Standard Room',
    location: 'Main Building',
    rating: 4.7,
    image: '/images/bed3.jpg',
    category: 'rooms',
    description: 'Comfortable and modern room with essential amenities.',
  },
  {
    id: 4,
    title: 'Hotel Lobby',
    location: 'Ground Floor',
    rating: 4.9,
    image: '/images/lobby.jpg',
    category: 'hotel',
    description: 'Grand entrance with elegant design and welcoming atmosphere.',
  },
  {
    id: 5,
    title: 'Swimming Pool',
    location: 'Outdoor Area',
    rating: 4.8,
    image: '/images/Picture2.png',
    category: 'amenities',
    description: 'Infinity pool overlooking the city skyline.',
  },
  {
    id: 6,
    title: 'Restaurant',
    location: 'First Floor',
    rating: 4.9,
    image: '/images/restarant.jpg',
    category: 'dining',
    description: 'Fine dining experience with international cuisine.',
  },
];

const categories = [
  { id: 'all', name: 'All' },
  { id: 'rooms', name: 'Rooms' },
  { id: 'hotel', name: 'Hotel' },
  { id: 'amenities', name: 'Amenities' },
  { id: 'dining', name: 'Dining' },
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredImages = galleryImages.filter((image) => {
    const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;
    const matchesSearch = image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         image.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif">
              Hotel Gallery
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Explore our collection of stunning images showcasing the luxury and elegance of Vicarage Resorts.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-amber-400 text-gray-900'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="group relative bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-amber-400 transition-all duration-300"
              >
                <div className="relative h-64">
                  <Image
                    src={image.image}
                    alt={image.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">{image.title}</h3>
                    <div className="flex items-center text-amber-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="ml-1">{image.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-400 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {image.location}
                  </div>

                  <p className="text-gray-300 text-sm">{image.description}</p>
                </div>

                <div className="absolute bottom-4 right-4 bg-amber-400 text-gray-900 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Camera className="w-5 h-5" />
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredImages.length === 0 && (
            <div className="text-center py-12">
              <Camera className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Images Found</h3>
              <p className="text-gray-400">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
