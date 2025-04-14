"use client";

import React, { useState } from "react";
import { 
  FileText, 
  Download, 
  Calendar, 
  Users, 
  User, 
  CreditCard, 
  Home, 
  Sliders, 
  ChevronDown,
  Filter,
  Eye
} from "lucide-react";

type ReportType = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactElement;
  availableFormats: string[];
  category: string;
};

export default function ReportsExportDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const reportTypes: ReportType[] = [
    {
      id: "booking-summary",
      name: "Booking Summary",
      description: "Overview of all bookings with status, dates, and revenue",
      icon: <Calendar className="text-blue-600" size={20} />,
      availableFormats: ["PDF", "CSV", "Excel"],
      category: "Bookings"
    },
    {
      id: "booking-detailed",
      name: "Detailed Booking Report",
      description: "In-depth analysis of bookings with customer data and preferences",
      icon: <Calendar className="text-blue-600" size={20} />,
      availableFormats: ["PDF", "Excel"],
      category: "Bookings"
    },
    {
      id: "visitor-list",
      name: "Visitors List",
      description: "Complete list of all visitors with contact information",
      icon: <Users className="text-green-600" size={20} />,
      availableFormats: ["PDF", "CSV", "Excel"],
      category: "Visitors"
    },
    {
      id: "visitor-activity",
      name: "Visitor Activity",
      description: "Tracking of visitor interactions and frequency of visits",
      icon: <Users className="text-green-600" size={20} />,
      availableFormats: ["PDF", "Excel"],
      category: "Visitors"
    },
    {
      id: "user-accounts",
      name: "System Users Report",
      description: "List of all system users with roles and permissions",
      icon: <User className="text-purple-600" size={20} />,
      availableFormats: ["PDF", "CSV"],
      category: "Users"
    },
    {
      id: "user-activity",
      name: "User Activity Log",
      description: "Audit trail of user actions within the system",
      icon: <User className="text-purple-600" size={20} />,
      availableFormats: ["PDF", "CSV", "Excel"],
      category: "Users"
    },
    {
      id: "payment-methods",
      name: "Payment Methods Analysis",
      description: "Distribution and usage of different payment methods",
      icon: <CreditCard className="text-amber-600" size={20} />,
      availableFormats: ["PDF", "Excel"],
      category: "Payments"
    },
    {
      id: "payment-transactions",
      name: "Payment Transactions",
      description: "Detailed log of all payment transactions with status",
      icon: <CreditCard className="text-amber-600" size={20} />,
      availableFormats: ["PDF", "CSV", "Excel"],
      category: "Payments"
    },
    {
      id: "rooms-inventory",
      name: "Rooms Inventory",
      description: "Current status and availability of all rooms",
      icon: <Home className="text-red-600" size={20} />,
      availableFormats: ["PDF", "CSV", "Excel"],
      category: "Rooms"
    },
    {
      id: "rooms-occupancy",
      name: "Room Occupancy Rate",
      description: "Analysis of room occupancy rates over time",
      icon: <Home className="text-red-600" size={20} />,
      availableFormats: ["PDF", "Excel"],
      category: "Rooms"
    }
  ];
  
  const categories = Array.from(new Set(reportTypes.map(report => report.category)));
  
  const filteredReports = reportTypes.filter(report => {
    const matchesCategory = selectedCategory ? report.category === selectedCategory : true;
    const matchesSearch = searchQuery 
      ? report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  const handleExport = (reportId: string, format: string) => {
    // In a real application, this would trigger the actual report generation
    console.log(`Exporting report ${reportId} in ${format} format`);
    // Here you would call your API endpoint to generate the report
    alert(`Preparing ${format} export for ${reportTypes.find(r => r.id === reportId)?.name}. The download will begin shortly.`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Reports & Exports</h2>
            <p className="text-sm text-gray-500 mt-2">Generate and download reports from your data</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex-grow max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search reports..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="relative inline-block text-left">
            <div>
              <button 
                type="button" 
                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                id="category-menu"
                aria-expanded="true"
                aria-haspopup="true"
                onClick={() => document.getElementById('dropdown-menu')?.classList.toggle('hidden')}
              >
                {selectedCategory || 'All Categories'}
                <ChevronDown className="ml-2 h-5 w-5" />
              </button>
            </div>

            <div 
              className="hidden origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10" 
              role="menu" 
              aria-orientation="vertical" 
              aria-labelledby="category-menu" 
              id="dropdown-menu"
            >
              <div className="py-1" role="none">
                <button
                  className={`block w-full text-left px-4 py-2 text-sm ${!selectedCategory ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} hover:bg-gray-100`}
                  role="menuitem"
                  onClick={() => {
                    setSelectedCategory(null);
                    document.getElementById('dropdown-menu')?.classList.add('hidden');
                  }}
                >
                  All Categories
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    className={`block w-full text-left px-4 py-2 text-sm ${selectedCategory === category ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} hover:bg-gray-100`}
                    role="menuitem"
                    onClick={() => {
                      setSelectedCategory(category);
                      document.getElementById('dropdown-menu')?.classList.add('hidden');
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {selectedCategory && (
            <button 
              className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={() => setSelectedCategory(null)}
            >
              <Filter size={16} className="text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReports.map((report) => (
          <div key={report.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center mb-3">
                  <div className="p-2 rounded-lg bg-gray-50 mr-3">
                    {report.icon}
                  </div>
                  <h3 className="font-semibold text-gray-800">{report.name}</h3>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{report.category}</span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{report.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500 flex items-center">
                  <FileText size={14} className="mr-1" />
                  Available formats: {report.availableFormats.join(", ")}
                </div>
                
                <div className="relative inline-block text-left">
                  <div>
                    <button 
                      type="button" 
                      className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                      id={`export-menu-${report.id}`}
                      aria-expanded="true"
                      aria-haspopup="true"
                      onClick={() => document.getElementById(`dropdown-formats-${report.id}`)?.classList.toggle('hidden')}
                    >
                      <Download size={14} className="mr-1" />
                      Export
                    </button>
                  </div>

                  <div 
                    className="hidden origin-top-right absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10" 
                    role="menu" 
                    aria-orientation="vertical" 
                    aria-labelledby={`export-menu-${report.id}`} 
                    id={`dropdown-formats-${report.id}`}
                  >
                    <div className="py-1" role="none">
                      {report.availableFormats.map(format => (
                        <button
                          key={format}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                          onClick={() => {
                            handleExport(report.id, format);
                            document.getElementById(`dropdown-formats-${report.id}`)?.classList.add('hidden');
                          }}
                        >
                          Export as {format}
                        </button>
                      ))}
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-100"
                        role="menuitem"
                        onClick={() => {
                          document.getElementById(`dropdown-formats-${report.id}`)?.classList.add('hidden');
                          // In a real app, this would open a preview modal or page
                          alert(`Preview of ${report.name} would open here`);
                        }}
                      >
                        <Eye size={14} className="inline mr-1" /> Preview
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <FileText className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No reports found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter to find what you're looking for.
          </p>
          <button 
            className="mt-4 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => {
              setSelectedCategory(null);
              setSearchQuery("");
            }}
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Advanced Options */}
      <div className="mt-8 bg-gray-50 rounded-lg p-5 border border-gray-200">
        <div className="flex items-center mb-4">
          <Sliders className="text-gray-700 mr-2" size={18} />
          <h3 className="font-medium text-gray-800">Advanced Report Options</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Custom Date Range
            </label>
            <div className="flex gap-2">
              <input 
                type="date" 
                className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm"
                placeholder="Start Date"
              />
              <input 
                type="date" 
                className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm"
                placeholder="End Date"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Schedule Report
            </label>
            <div className="flex gap-2">
              <select className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm">
                <option value="">Select frequency</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <input 
                type="email" 
                className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm"
                placeholder="Email to"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
            Create Custom Report
          </button>
        </div>
      </div>
    </div>
  );
}