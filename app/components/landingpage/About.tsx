'use client';

import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function About() {
  return (
    <section id="about" className="py-16 md:py-24 overflow-hidden bg-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 relative">
            {/* Decorative elements */}
            <div className="absolute -left-8 top-0 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl"></div>
            <div className="absolute -right-8 bottom-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"></div>
            
            <div className="relative space-y-8">
              <div className="animate-fade-in-up">
                <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-amber-900/50 text-amber-300">About Us</span>
                <h2 className="font-serif text-4xl md:text-5xl font-bold mt-4 text-white">
                  A Heritage of <span className="text-amber-400">Excellence</span>
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4 my-8 animate-fade-in-up animation-delay-150">
                <div className="p-4 rounded-2xl bg-gray-700/50 backdrop-blur-sm">
                  <h3 className="text-3xl font-bold text-amber-400">2+</h3>
                  <p className="text-sm text-gray-300">Years of Excellence</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-700/50 backdrop-blur-sm">
                  <h3 className="text-3xl font-bold text-amber-400">2+</h3>
                  <p className="text-sm text-gray-300">Awards Won</p>
                </div>
              </div>

              <div className="space-y-6 animate-fade-in-up animation-delay-300">
                <p className="text-lg text-gray-300">
                  Founded in 2022, Vicarage Resorts has redefined luxury hospitality. Our commitment to excellence has earned us numerous accolades and the trust of distinguished guests worldwide.
                </p>
                <div className="p-4 border-l-4 border-amber-400 bg-gray-700/30 rounded-r-xl">
                  <p className="text-sm italic text-gray-300">
                    "Every detail in our service is crafted with precision and care, ensuring an unforgettable experience for our guests."
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 items-center animate-fade-in-up animation-delay-450">
                <button className="group flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium transition-colors">
                  <span>Discover Our Story</span>
                  <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Team member" className="w-8 h-8 rounded-full border-2 border-white" />
                    <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Team member" className="w-8 h-8 rounded-full border-2 border-white" />
                    <img src="https://randomuser.me/api/portraits/men/55.jpg" alt="Team member" className="w-8 h-8 rounded-full border-2 border-white" />
                  </div>
                  <span className="text-sm text-gray-400">Meet our team</span>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative animate-float">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-xl shadow-amber-500/10">
              <img 
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="Hotel exterior" 
                className="w-full h-auto rounded-[2.5rem] transform transition-transform hover:scale-105 duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
            </div>

            {/* Achievement Cards */}
            <div className="absolute -bottom-6 -left-6 p-4 rounded-2xl z-20 bg-gray-700 shadow-lg shadow-amber-500/5 backdrop-blur-sm animate-bounce-slow max-w-[200px]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-900/50">
                  <span className="text-2xl text-amber-400">🏆</span>
                </div>
                <div>
                  <h4 className="font-medium text-white">Best Luxury Resort</h4>
                  <p className="text-xs text-gray-400">Embu County</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 p-4 rounded-2xl z-20 bg-gray-700 shadow-lg shadow-amber-500/5 backdrop-blur-sm animate-bounce-slow animation-delay-300 max-w-[200px]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-900/50">
                  <span className="text-2xl text-amber-400">⭐</span>
                </div>
                <div>
                  <h4 className="font-medium text-white">4-Star Rating</h4>
                  <p className="text-xs text-gray-400">Forbes Travel Guide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 