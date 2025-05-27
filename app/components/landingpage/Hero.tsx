"use client";
import Link from "next/link";

import { PrimaryButton, SecondaryButton } from "../ui/buttons";

const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 h-full">
          {/* Left Content */}
          <div className="relative z-10 order-2 lg:order-1 mt-8 lg:mt-0">
            <div className="absolute -left-4 top-0 w-24 h-24 rounded-full bg-amber-400/10 blur-2xl hidden lg:block"></div>
            <div className="absolute -right-4 bottom-0 w-32 h-32 rounded-full bg-amber-500/10 blur-3xl hidden lg:block"></div>

            <div className="relative">
              <span className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 md:mb-6 bg-amber-900/50 text-amber-300 animate-fade-in-up">
                Discover the gem
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight mb-4 md:mb-6 animate-fade-in-up animation-delay-150">
                Vicarage <span className="text-amber-400">Resorts</span>
              </h1>
              <p className="text-base sm:text-lg md:text-base text-gray-300 max-w-xl mb-6 md:mb-8 animate-fade-in-up animation-delay-300">
                Haven of relaxation and rejuvenation that climaxes with
                beautiful mountain views from the hotel rooftop restaurant. A
                friendly, warm swimming pool and children play facilities
                complete the Hotel's family offering of leisure and pleasure.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-450 ">
                <Link href="/pages/explore">
                  <PrimaryButton fullWidth>Book Your Stay</PrimaryButton>
                </Link>
                <Link href="/pages/explore">
                  <SecondaryButton fullWidth>Explore Rooms</SecondaryButton>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-8 sm:mt-12 pt-8 sm:pt-12 border-t border-gray-700 animate-fade-in-up animation-delay-600">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-amber-400">
                    4+
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400">
                    Luxury Rooms
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-amber-400">
                    2+
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400">
                    Years Experience
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-amber-400">
                    4.9
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400">
                    Guest Rating
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative order-1 lg:order-2 h-[300px] sm:h-[400px] md:h-[500px] lg:h-[700px] animate-float">
            <div className="absolute inset-0 rounded-2xl sm:rounded-[3rem] overflow-hidden shadow-2xl shadow-amber-500/10">
              <img
                src="/images/heroimage.jpg"                alt="Luxury hotel room"
                className="w-full h-full object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gray-800 shadow-xl shadow-amber-500/5 backdrop-blur-sm animate-bounce-slow">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-amber-900/50">
                  <span className="text-xl sm:text-2xl text-amber-400">★</span>
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-medium text-white">
                    Excellent
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-400">
                    70+ Reviews
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
