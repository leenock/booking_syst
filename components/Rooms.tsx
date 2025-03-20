'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { WifiIcon, TvIcon, CoffeeIcon } from 'lucide-react';

export default function Rooms() {
  const router = useRouter();

  const rooms = [
    {
      id: 'standard',
      name: 'Standard Room',
      description: 'Perfect for solo travelers or couples, our Standard Room offers essential comfort with modern amenities.',
      price: 199,
      image: '/images/luxury.jpg',
      features: ['Queen-size bed', 'Smart TV', 'Free Wi-Fi'],
      amenities: [
        { icon: WifiIcon, label: 'High-speed WiFi' },
        { icon: TvIcon, label: '4K Smart TV' },
        { icon: CoffeeIcon, label: 'Coffee Maker' },
      ],
    },
    {
      id: 'deluxe',
      name: 'Deluxe Room',
      description: 'Spacious and elegant, our Deluxe Room provides extra comfort with premium furnishings and a city view.',
      price: 299,
      image: '/images/luxury.jpg',
      features: ['King-size bed', 'City view', 'Mini bar'],
      amenities: [
        { icon: WifiIcon, label: 'High-speed WiFi' },
        { icon: TvIcon, label: '4K Smart TV' },
        { icon: CoffeeIcon, label: 'Premium Coffee Station' },
      ],
    },
    {
      id: 'suite',
      name: 'Executive Suite',
      description: 'Experience ultimate luxury in our Executive Suite with separate living area and panoramic views.',
      price: 499,
      image: '/images/luxury.jpg',
      features: ['King-size bed', 'Living room', 'Jacuzzi'],
      amenities: [
        { icon: WifiIcon, label: 'High-speed WiFi' },
        { icon: TvIcon, label: '65" OLED TV' },
        { icon: CoffeeIcon, label: 'Espresso Machine' },
      ],
    },
  ];

  const handleRoomSelect = (roomType: string) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const params = new URLSearchParams({
      checkIn: today.toISOString(),
      checkOut: tomorrow.toISOString(),
      roomType,
      guests: '2',
    });

    router.push(`/explore?${params.toString()}`);
  };

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4 font-serif">
            Our Room Types
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Discover our carefully curated selection of rooms, each designed to provide
            the perfect blend of comfort and luxury for your stay.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02] duration-300 border border-gray-700"
            >
              <div className="relative h-64">
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-white">{room.name}</h3>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-amber-400">
                      ${room.price}
                    </span>
                    <span className="text-gray-400 text-sm">/night</span>
                  </div>
                </div>

                <p className="text-gray-300 mb-6">{room.description}</p>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {room.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-3 py-1 bg-gray-700 text-amber-400 rounded-full text-sm border border-gray-600"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex gap-4">
                      {room.amenities.map(({ icon: Icon, label }) => (
                        <div
                          key={label}
                          className="flex items-center text-gray-400 text-sm"
                        >
                          <Icon className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 