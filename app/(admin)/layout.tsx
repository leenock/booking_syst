'use client';

import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Admin Navigation */}
      <nav className="bg-[#654222] text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="font-serif text-xl font-bold">
                Vicarage Admin
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-white hover:text-amber-300 transition-colors">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
