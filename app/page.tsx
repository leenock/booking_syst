"use client";

import Services from "./components/landingpage/Services";
import About from "./components/landingpage/About";
import Testimonials from "./components/landingpage/Testimonials";
import Hero from "./components/landingpage/Hero";
import type { NextPage } from "next";
import Header from "./components/landingpage/Header";
const Home: NextPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 relative transition-colors duration-300">
      <main className="flex-grow">
        {/* Header Section */}
        <Header />
        {/* Hero Section */}
        <Hero />

        {/* Services Section */}
        <Services />

        {/* About Section */}
        <About />

        {/* Testimonials Section */}
        <Testimonials />
      </main>
    </div>
  );
};

export default Home;
