"use client";

import type { NextPage } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Rooms from "@/components/Rooms";
import Footer from "@/app/components/landingpage/Footer";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 relative transition-colors duration-300">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />
        {/* Rooms Section */}
        <Rooms /> 
      </main>
      <Footer />
    </div>
  );
};

export default Home;
