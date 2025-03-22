'use client';
import Link from "next/link";


import { 
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/solid';

export default function Footer() {
  return (
    <footer id="contact" className="py-12 bg-gradient-to-r from-[#211313] to-[#211313] text-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-serif text-xl font-bold mb-4 text-white"> Vicarage Resorts</h3>
            <p className="text-sm mb-6 opacity-80">
              Experience luxury like never before in our meticulously designed spaces and attentive service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="h-8 w-8 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/30 transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.378 14.192 5 15.115 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z" />
                </svg>
              </a>
              <a href="#" className="h-8 w-8 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/30 transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a href="#" className="h-8 w-8 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/30 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:opacity-75 transition-opacity">About Us</Link></li>
              <li><Link href="/pages/cottages" className="hover:opacity-75 transition-opacity">Our Rooms</Link>    </li>          
              <li><Link href="/" className="hover:opacity-75 transition-opacity">Services</Link></li>
              <li><Link href="/pages/contact_us" className="hover:opacity-75 transition-opacity">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-lg mb-4">Contact Info</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <MapPinIcon className="h-5 w-5 mr-2 opacity-75" />
                Vicarage Resorts,Kanyuambora, Mate, Kanyuambora
              </li>
              <li className="flex items-center">
                <PhoneIcon className="h-5 w-5 mr-2 opacity-75" />
                +254 (074) 3 666 333
              </li>
              <li className="flex items-center">
                <EnvelopeIcon className="h-5 w-5 mr-2 opacity-75" />
                reservations@vicarageresorts.com
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-lg mb-4">Newsletter</h4>
            <p className="text-sm mb-4 opacity-80">
              Subscribe to our newsletter for exclusive offers and updates.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 rounded-l-lg text-gray-900 placeholder-gray-500 focus:outline-none bg-white/90"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-r-lg font-medium bg-gradient-to-r from-[#654222] to-[#654222] text-white transition-colors hover:opacity-90"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm opacity-60">
          <p>&copy; {new Date().getFullYear()} Vicarage Resorts. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 