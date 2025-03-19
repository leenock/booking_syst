'use client';

interface TestimonialCardProps {
  name: string;
  location: string;
  quote: string;
  image: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  name, 
  location, 
  quote, 
  image
}) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-sm p-6 relative">
      <div className="flex items-center mb-4">
        <img 
          src={image} 
          alt={name} 
          className="w-12 h-12 rounded-full object-cover mr-4" 
        />
        <div>
          <h4 className="font-medium text-white">{name}</h4>
          <p className="text-xs text-gray-400">{location}</p>
        </div>
      </div>
      <p className="text-sm italic text-gray-300">"{quote}"</p>
    </div>
  );
};

export default function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 text-xs font-medium rounded-full mb-3 bg-amber-900/50 text-amber-300">Testimonials</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-white">What Our Guests Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TestimonialCard 
            name="Emily Johnson"
            location="New York, USA"
            quote="Vicarage Resorts exceeded all my expectations. The staff were incredibly attentive, and the amenities were top-notch. I'll definitely be returning!"
            image="https://randomuser.me/api/portraits/women/17.jpg"
          />
          <TestimonialCard 
            name="Thomas Chen"
            location="Nairobi, Kenya"
            quote="A truly outstanding experience from check-in to check-out. The room was immaculate, and the restaurant offerings were exceptional."
            image="https://randomuser.me/api/portraits/men/54.jpg"
          />
          <TestimonialCard 
            name="Sophie Miller"
            location="London, UK"
            quote="The perfect blend of luxury and comfort. The spa facilities were particularly remarkable, and the staff made our anniversary truly special."
            image="https://randomuser.me/api/portraits/women/63.jpg"
          />
        </div>
      </div>
    </section>
  );
} 