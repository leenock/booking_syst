"use client";

import { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

interface NavLinkProps {
  text: string;
  href: string;
  isActive?: boolean;
  onClick?: () => void;
}

const NavLink = ({ text, href, isActive, onClick }: NavLinkProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    if (onClick) onClick();
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 group
        ${isActive 
          ? 'text-amber-400' 
          : 'text-gray-300 hover:text-amber-400'
        }`}
    >
      <span className="relative inline-block transform transition-transform duration-300 group-hover:scale-110">
        {text}
      </span>
      <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-amber-400 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${isActive ? 'scale-x-100' : ''}`} />
    </a>
  );
};

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebarOnMobile = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  // Only render the mobile sidebar after client-side hydration
  const renderMobileSidebar = () => {
    if (!mounted) return null;

    return (
      <>
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 lg:hidden"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Mobile Sidebar */}
        <div
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed top-0 left-0 h-full w-64 bg-gray-900 border-gray-700 shadow-lg z-50 transform lg:hidden transition-transform duration-300 ease-in-out`}
        >
          <div className="p-4 flex items-center justify-between border-b border-amber-200">
            <div className="flex items-center">
              <span className="font-serif text-xl font-bold text-amber-400">
                Vicarage Resorts
              </span>
            </div>
            <button
              className="text-gray-400 hover:bg-gray-800 focus:outline-none p-2 rounded-full"
              onClick={toggleSidebar}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="py-4 flex flex-col">
            <NavLink
              text="Home"
              href="#hero"
              isActive={true}
              onClick={closeSidebarOnMobile}
            />
            <NavLink
              text="Our Services"
              href="#services"
              onClick={closeSidebarOnMobile}
            />
            <NavLink
              text="About Us"
              href="#about"
              onClick={closeSidebarOnMobile}
            />
            <NavLink
              text="Contact"
              href="#contact"
              onClick={closeSidebarOnMobile}
            />
          </div>

          <div className="absolute bottom-0 w-full p-4">
            <button className="w-full py-2 px-6 bg-transparent border-2 border-amber-400 text-amber-400 rounded-lg font-medium transition-all duration-300 hover:bg-amber-400/10 hover:border-amber-300 hover:text-amber-300 transform hover:scale-105">
              Book Now
            </button>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      {renderMobileSidebar()}

      {/* Header */}
      <header className="bg-gradient-to-r from-[#654222] to-[#654222] text-white sticky top-0 z-40 shadow-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button
                className="lg:hidden mr-2 p-2 rounded-md focus:outline-none"
                onClick={toggleSidebar}
              >
                <Bars3Icon className="h-6 w-6 text-white" />
              </button>
              <a href="#" className="flex items-center">
                <span className="font-serif text-xl md:text-2xl font-bold text-white">
                Vicarage Resorts
                </span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              <NavLink text="Home" href="#hero" isActive={true} />
              <NavLink text="Our Services" href="#services" />
              <NavLink text="About Us" href="#about" />
              <NavLink text="Contact" href="#contact" />
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              <button className="hidden md:block py-2 px-6 bg-transparent border-2 border-amber-400 text-amber-400 rounded-lg font-medium transition-all duration-300 hover:bg-amber-400/10 hover:border-amber-300 hover:text-amber-300 transform hover:scale-105">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
