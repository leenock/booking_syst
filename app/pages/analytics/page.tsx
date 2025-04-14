"use client";

import Sidebar from '@/app/components/user_dash/Sidebar';
import { BarChart2 } from 'lucide-react';
import { useState } from 'react';

export default function UserAnalytics() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onOpenChange={setIsSidebarOpen} />

      {/* Main Content */}
      <div className="md:pl-64 min-h-screen transition-all duration-200">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4 flex items-center justify-center md:justify-start gap-3">
              <BarChart2 className="w-6 h-6 text-purple-600" />
              <h1 className="text-xl font-semibold text-gray-900">Analytics</h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md p-6">
            <p className="text-gray-700 text-center text-lg">Reports appear here</p>
          </div>
        </main>
      </div>
    </div>
  );
}
