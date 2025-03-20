'use client';

import { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

interface NavLinkProps {
  text: string;
  href: string;
  isActive?: boolean;
  onClick?: () => void;
}

const NavLink = ({ text, href, isActive, onClick }: NavLinkProps) => {
  return (
    <Link
      href={href}
      onClick={onClick}
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
    </Link>
  );
};

export default function Navbar() {
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
          } fixed top-0 left-0 h-full w-64 bg-[#101727] border-r border-gray-700 shadow-lg z-50 transform lg:hidden transition-transform duration-300 ease-in-out`}
        >
          <div className="p-4 flex items-center justify-between border-b border-gray-700">
            <div className="flex items-center">
              <span className="font-serif text-xl font-bold text-white">
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
            <NavLink text="Home" href="/" onClick={closeSidebarOnMobile} />
            <NavLink text="Resort Cottages" href="/rooms" onClick={closeSidebarOnMobile} />
            <NavLink text="Gallery" href="/gallery" onClick={closeSidebarOnMobile} />
            <NavLink text="Meetings & Events" href="/events" onClick={closeSidebarOnMobile} />
            <NavLink text="Contact Us" href="/Contact" onClick={closeSidebarOnMobile}/>
          </div>

          {/* Mobile Create Account Button */}
          <div className="absolute bottom-0 w-full p-4">
            <Link href="/register" className="block w-full">
              <button className="w-full relative inline-flex items-center justify-center px-6 py-2 overflow-hidden text-sm font-medium text-white rounded-lg group bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 transition-all duration-300">
                <span className="relative flex items-center">
                  Create Account
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </button>
            </Link>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      {renderMobileSidebar()}

      {/* Header */}
      <header className="bg-gradient-to-r from-[#101727] to-[#101727] text-white sticky top-0 z-40 shadow-[0_4px_6px_-1px_rgba(255,255,255,0.1)] transition-colors duration-300">
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
              <Link href="/" className="flex items-center">
                <span className="font-serif text-xl md:text-2xl font-bold text-white">
                  Vicarage Resorts
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              <NavLink text="Resort Cottages" href="/rooms" />
              <NavLink text="Gallery" href="/gallery" />
              <NavLink text="Meetings & Events" href="/events" />
              <NavLink text="Contact Us" href="/Contact" />
            </nav>

            {/* Create Account Button */}
            <div className="hidden lg:block">
              <Link href="/register">
                <button className="relative inline-flex items-center px-6 py-2 overflow-hidden text-sm font-medium text-white rounded-lg group bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  <span className="relative flex items-center">
                    Create Account
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
} 