'use client';

import { 
  HomeIcon, 
  CalendarIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  icon, 
  title, 
  description
}) => {
  return (
    <div className="bg-gray-800 hover:bg-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden p-6">
      <div className="w-12 h-12 rounded-full bg-amber-900 flex items-center justify-center mb-4">
        <div className="h-6 w-6 text-amber-300">{icon}</div>
      </div>
      <h3 className="font-medium text-lg mb-2 text-white">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
};

export default function Services() {
  return (
    <section id="services" className="py-16 md:py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 text-xs font-medium rounded-full mb-3 bg-amber-900/50 text-amber-300">Our Services</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-white">Experience Luxury Services</h2>
          <p className="max-w-2xl mx-auto text-gray-400">
            We offer a wide range of services to make your stay memorable and comfortable..
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ServiceCard 
            icon={<HomeIcon />} 
            title="Resort Cottage" 
            description="Experience the charm and comfort of our resort cottages at Vicarage Resorts. Nestled in a picturesque setting, each cottage offers a unique blend of luxury and rustic elegance."
          />
          <ServiceCard 
            icon={<CalendarIcon />} 
            title="Restaurant & Bar" 
            description="Indulge in the culinary delights at Vicarage Resorts’ exceptional restaurants and bars. Our diverse dining options feature gourmet dishes prepared by expert chefs"
          />
          <ServiceCard 
            icon={<MapPinIcon />} 
            title="swimming pool" 
            description="Dive into relaxation at Vicarage Resorts’ stunning swimming pool. Whether you’re looking to take a refreshing dip, swim some laps, or simply lounge by the water"
          />
        </div>
      </div>
    </section>
  );
} 