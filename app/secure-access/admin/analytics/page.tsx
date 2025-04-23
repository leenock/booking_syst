"use client";

import React, { useState, useEffect } from "react";
import { FileText, Download, Calendar, ChevronDown, Filter, Eye } from "lucide-react";

type ReportType = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactElement;
  availableFormats: string[];
  category: string;
};

export default function ReportsExportDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [bookingData, setBookingData] = useState<any[]>([]);
  const [visitorData, setVisitorData] = useState<any[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Fetch booking data
  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/booking`);
        if (response.ok) {
          const data = await response.json();
          setBookingData(data);
        } else {
          console.error('Failed to fetch booking data');
        }
      } catch (error) {
        console.error('Error fetching booking data:', error);
      }
    };

    fetchBookingData();
  }, []);

  // Fetch visitor data
  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/visitor-accounts`);
        if (response.ok) {
          const data = await response.json();
          setVisitorData(data);
        } else {
          console.error('Failed to fetch visitor data');
        }
      } catch (error) {
        console.error('Error fetching visitor data:', error);
      }
    };

    fetchVisitorData();
  }, []);

  const reportTypes: ReportType[] = [
    {
      id: "list-of-bookings",
      name: "List of Bookings",
      description: "Comprehensive list of all bookings with status and details",
      icon: <Calendar className="text-blue-600" size={20} />,
      availableFormats: [ "CSV", "Excel"],
      category: "Bookings"
    },
    {
      id: "list-of-visitors",
      name: "List of Visitors",
      description: "Comprehensive list of all visitors with their details",
      icon: <Eye className="text-green-600" size={20} />,
      availableFormats: ["CSV", "Excel"],
      category: "Visitors"
    }
  ];

  const filteredReports = reportTypes.filter((report) => {
    const matchesSearch = searchQuery
      ? report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesSearch;
  });

  // FIXED: Improved CSV conversion with better data handling
  const convertToCSV = (data: any[]) => {
    if (!data || data.length === 0) {
      // Return empty CSV with default headers for the report type
      return 'No data available';
    }
    
    // Make sure we have valid data with properties
    const firstItem = data[0];
    if (!firstItem || typeof firstItem !== 'object') {
      return 'Invalid data format';
    }
    
    const headers = Object.keys(firstItem);
    if (headers.length === 0) {
      return 'No properties found in data';
    }
    
    const csvRows = [];
    
    // Add header row
    csvRows.push(headers.join(','));
    
    // Add data rows
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        // Handle strings with commas by wrapping in quotes
        if (value === null || value === undefined) {
          return '';
        } else if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        } else {
          return String(value);
        }
      });
      csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
  };

  // Helper function to create default data if none exists
  const createDefaultData = (reportId: string) => {
    if (reportId === "list-of-bookings") {
      return [
        { 
          id: "sample-1", 
          visitorName: "Sample Visitor", 
          date: "2025-04-23", 
          status: "Confirmed" 
        }
      ];
    } else {
      return [
        { 
          id: "visitor-1", 
          name: "Sample User", 
          email: "sample@example.com", 
          status: "Active" 
        }
      ];
    }
  };

  // Helper function to convert data to Excel format (simplified as CSV for demo)
  const convertToExcel = (data: any[]) => {
    // In a real implementation, use a library like ExcelJS or XLSX
    // For this demo, we'll reuse the CSV conversion
    return convertToCSV(data);
  };

  // Function to trigger download of file
  const downloadFile = (content: string, fileName: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // FIXED: Improved export function with better debugging
  const handleExport = async (reportId: string, format: string) => {
    setIsExporting(true);
    setExportProgress(0);
    
    const report = reportTypes.find(r => r.id === reportId);
    if (!report) {
      setIsExporting(false);
      alert("Report not found");
      return;
    }
    
    // Simulate export progress
    const progressInterval = setInterval(() => {
      setExportProgress(prev => {
        const newProgress = prev + 10;
        return newProgress <= 90 ? newProgress : 90;
      });
    }, 300);
    
    // Get appropriate data based on report type
    let data = [];
    if (reportId === "list-of-bookings") {
      data = bookingData && bookingData.length > 0 ? bookingData : createDefaultData(reportId);
      console.log("Booking data for export:", data);
    } else {
      data = visitorData && visitorData.length > 0 ? visitorData : createDefaultData(reportId);
      console.log("Visitor data for export:", data);
    }
    
    let content = '';
    let fileName = '';
    
    // Process based on format
    try {
      switch (format.toLowerCase()) {
        case 'csv':
          content = convertToCSV(data);
          fileName = `${report.name.replace(/\s+/g, '-').toLowerCase()}.csv`;
          break;
        case 'excel':
          content = convertToExcel(data);
          fileName = `${report.name.replace(/\s+/g, '-').toLowerCase()}.xlsx`;
          break;
        
        default:
          throw new Error(`Unsupported format: ${format}`);
      }
      
      console.log(`Generated ${format} content:`, content.substring(0, 200) + (content.length > 200 ? '...' : ''));
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      clearInterval(progressInterval);
      setExportProgress(100);
      
      // Download the file
      downloadFile(content, fileName);
      
      // Reset progress after a short delay
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
      }, 1000);
      
    } catch (error) {
      console.error(`Error exporting ${report.name} as ${format}:`, error);
      clearInterval(progressInterval);
      setIsExporting(false);
      setExportProgress(0);
      alert(`Failed to export ${report.name} as ${format}. Please try again.`);
    }
  };

  // FIXED: Improved preview function with better debugging
  const handlePreview = (reportId: string) => {
    const report = reportTypes.find(r => r.id === reportId);
    let data = [];
    let previewContent = "";
    
    if (reportId === "list-of-bookings") {
      data = bookingData && bookingData.length > 0 ? bookingData : createDefaultData(reportId);
      console.log("Preview booking data:", data);
    } else {
      data = visitorData && visitorData.length > 0 ? visitorData : createDefaultData(reportId);
      console.log("Preview visitor data:", data);
    }
    
    if (data.length > 0) {
      // Format first item as preview
      const firstItem = data[0];
      previewContent = Object.entries(firstItem)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
    } else {
      previewContent = "No data available";
    }
    
    alert(`Preview of ${report?.name || 'report'}:\n\nFirst record:\n${previewContent}\n\nTotal records: ${data.length}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-dropdown="category"]')) {
        setCategoryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Reports & Exports</h2>
        <p className="text-sm text-gray-500 mt-2">Generate and download the basic reports you need</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex-grow max-w-md relative">
          <input
            type="text"
            placeholder="Search reports..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      {isExporting && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-700">Exporting report...</span>
            <span className="text-sm text-blue-700">{exportProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${exportProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReports.map((report) => (
          <div key={report.id} className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg">
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

              <div className="text-xs text-gray-500 mb-2 flex items-center">
                <FileText size={14} className="mr-1" />
                Available formats:
              </div>

              <div className="flex flex-wrap gap-2">
                {report.availableFormats.map(format => (
                  <button
                    key={format}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md text-xs font-medium flex items-center"
                    onClick={() => handleExport(report.id, format)}
                    disabled={isExporting}
                  >
                    <Download size={12} className="mr-1" />
                    {format}
                  </button>
                ))}
                <button
                  className="px-3 py-1.5 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-md text-xs font-medium flex items-center"
                  onClick={() => handlePreview(report.id)}
                  disabled={isExporting}
                >
                  <Eye size={12} className="mr-1" />
                  Preview
                </button>
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
            Try adjusting your search to find what you're looking for.
          </p>
          <button 
            className="mt-4 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => setSearchQuery("")}
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}