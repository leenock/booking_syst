"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Calendar,
  ChevronDown,
  Filter,
  Eye,
  User,
  Mail,
  Phone,
  Home,
  Users,
  Tag,
  AlertCircle,
  Clock,
} from "lucide-react";

type ReportType = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactElement;
  availableFormats: string[];
  category: string;
};

interface Booking {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  adults: number;
  kids: number;
  specialRequest: string;
  roomType: string;
  roomPrice: number;
  checkIn: string;
  checkOut: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
  room: {
    roomNumber: string;
    type: string;
    price: number;
    status: string;
    amenities: string[];
  };
}

export default function ReportsExportDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [bookingData, setBookingData] = useState<Booking[]>([]);
  const [visitorData, setVisitorData] = useState<any[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<"reports" | "bookings">("reports");

  // Fetch booking data
  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/booking`);
        if (response.ok) {
          const data = await response.json();
          setBookingData(data.data || []);
        } else {
          console.error("Failed to fetch booking data");
        }
      } catch (error) {
        console.error("Error fetching booking data:", error);
      }
    };

    fetchBookingData();
  }, []);

  // Fetch visitor data
  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/visitor-accounts`
        );
        if (response.ok) {
          const data = await response.json();
          setVisitorData(data);
        } else {
          console.error("Failed to fetch visitor data");
        }
      } catch (error) {
        console.error("Error fetching visitor data:", error);
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
      availableFormats: ["CSV", "Excel"],
      category: "Bookings",
    },
    {
      id: "list-of-visitors",
      name: "List of Visitors",
      description: "Comprehensive list of all visitors with their details",
      icon: <Eye className="text-green-600" size={20} />,
      availableFormats: ["CSV", "Excel"],
      category: "Visitors",
    },
  ];

  const filteredReports = reportTypes.filter((report) => {
    const matchesSearch = searchQuery
      ? report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesSearch;
  });

  // FIXED: Improved CSV conversion with better data handling
  // Improved CSV conversion function that handles nested objects properly
  const convertToCSV = (data: any[]) => {
    if (!data || data.length === 0) {
      return "No data available";
    }
    
    // Enrich data with calculated total booking amount before flattening
    const enrichedData = data.map(item => {
      // Check if this is booking data (has checkIn, checkOut and roomPrice properties)
      if (item.checkIn && item.checkOut && item.roomPrice) {
        // Calculate stay duration
        const startDate = new Date(item.checkIn);
        const endDate = new Date(item.checkOut);
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Calculate total price based on duration and room price
        const totalBookingAmount = item.roomPrice * diffDays;
        
        // Add total booking amount to item before flattening
        return {
          ...item,
          totalBookingAmount: parseFloat(totalBookingAmount.toFixed(2))
        };
      }
      return item;
    });

    // Flatten the data structure to handle nested objects
  const flattenedData = enrichedData.map((item) => {
    const flatItem: Record<string, any> = {};

    // Helper function to flatten nested objects
    const flatten = (obj: any, prefix = "") => {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const value = obj[key];
          const newKey = prefix ? `${prefix}_${key}` : key;

          // Skip null or undefined values
          if (value === null || value === undefined) {
            flatItem[newKey] = "";
          }
          // Handle arrays by joining values (e.g., for amenities)
          else if (Array.isArray(value)) {
            flatItem[newKey] = value.join(", ");
          }
          // Handle nested objects by recursively flattening
          else if (typeof value === "object" && value !== null) {
            flatten(value, newKey);
          }
          // Handle primitive values
          else {
            flatItem[newKey] = value;
          }
        }
      }
    };

    flatten(item);
    return flatItem;
  });

  // Get all unique headers from the flattened data
  const headers = Array.from(
    new Set(flattenedData.flatMap((item) => Object.keys(item)))
  );

  if (headers.length === 0) {
    return "No properties found in data";
  }

  const csvRows = [];

  // Add header row
  csvRows.push(headers.join(","));

  // Add data rows
  for (const row of flattenedData) {
    const values = headers.map((header) => {
      const value = row[header] || "";
      // Handle strings with commas by wrapping in quotes
      if (
        typeof value === "string" &&
        (value.includes(",") || value.includes('"') || value.includes("\n"))
      ) {
        // Escape any double quotes with two double quotes
        return `"${value.replace(/"/g, '""')}"`;
      } else {
        return String(value);
      }
    });
    csvRows.push(values.join(","));
  }

  return csvRows.join("\n");
};

  // Helper function to create default data if none exists
  const createDefaultData = (reportId: string) => {
    if (reportId === "list-of-bookings") {
      return [
        {
          id: "sample-1",
          visitorName: "Sample Visitor",
          date: "2025-04-23",
          status: "Confirmed",
        },
      ];
    } else {
      return [
        {
          id: "visitor-1",
          name: "Sample User",
          email: "sample@example.com",
          status: "Active",
        },
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
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
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

    const report = reportTypes.find((r) => r.id === reportId);
    if (!report) {
      setIsExporting(false);
      alert("Report not found");
      return;
    }

    // Simulate export progress
    const progressInterval = setInterval(() => {
      setExportProgress((prev) => {
        const newProgress = prev + 10;
        return newProgress <= 90 ? newProgress : 90;
      });
    }, 300);

    // Get appropriate data based on report type
    let data = [];
    if (reportId === "list-of-bookings") {
      data =
        bookingData && bookingData.length > 0
          ? bookingData
          : createDefaultData(reportId);
      console.log("Booking data for export:", data);
    } else {
      data =
        visitorData && visitorData.length > 0
          ? visitorData
          : createDefaultData(reportId);
      console.log("Visitor data for export:", data);
    }

    let content = "";
    let fileName = "";

    // Process based on format
    try {
      switch (format.toLowerCase()) {
        case "csv":
          content = convertToCSV(data);
          fileName = `${report.name.replace(/\s+/g, "-").toLowerCase()}.csv`;
          break;
        case "excel":
          content = convertToExcel(data);
          fileName = `${report.name.replace(/\s+/g, "-").toLowerCase()}.xlsx`;
          break;

        default:
          throw new Error(`Unsupported format: ${format}`);
      }

      console.log(
        `Generated ${format} content:`,
        content.substring(0, 200) + (content.length > 200 ? "..." : "")
      );

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

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
    const report = reportTypes.find((r) => r.id === reportId);
    let data = [];
    let previewContent = "";

    if (reportId === "list-of-bookings") {
      data =
        bookingData && bookingData.length > 0
          ? bookingData
          : createDefaultData(reportId);
      console.log("Preview booking data:", data);
    } else {
      data =
        visitorData && visitorData.length > 0
          ? visitorData
          : createDefaultData(reportId);
      console.log("Preview visitor data:", data);
    }

    if (data.length > 0) {
      // Format first item as preview
      const firstItem = data[0];
      previewContent = Object.entries(firstItem)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n");
    } else {
      previewContent = "No data available";
    }

    alert(
      `Preview of ${
        report?.name || "report"
      }:\n\nFirst record:\n${previewContent}\n\nTotal records: ${data.length}`
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-dropdown="category"]')) {
        setCategoryDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date nicely
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate stay duration
  const calculateStayDuration = (checkIn: string, checkOut: string) => {
    if (!checkIn || !checkOut) return 0;
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Reports & Exports</h2>
        <p className="text-sm text-gray-500 mt-2">
          Generate and download the basic reports you need
        </p>
      </div>

      <div className="mb-6 flex items-center border-b border-gray-200">
        <button
          className={`py-3 px-4 border-b-2 font-medium text-sm ${
            activeTab === "reports"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("reports")}
        >
          Reports
        </button>
        <button
          className={`py-3 px-4 border-b-2 font-medium text-sm ${
            activeTab === "bookings"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("bookings")}
        >
          All Bookings
        </button>
      </div>

      {activeTab === "reports" && (
        <>
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
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          {isExporting && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-700">
                  Exporting report...
                </span>
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
              <div
                key={report.id}
                className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center mb-3">
                      <div className="p-2 rounded-lg bg-gray-50 mr-3">
                        {report.icon}
                      </div>
                      <h3 className="font-semibold text-gray-800">
                        {report.name}
                      </h3>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {report.category}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    {report.description}
                  </p>

                  <div className="text-xs text-gray-500 mb-2 flex items-center">
                    <FileText size={14} className="mr-1" />
                    Available formats:
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {report.availableFormats.map((format) => (
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
              <h3 className="text-lg font-medium text-gray-900">
                No reports found
              </h3>
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
        </>
      )}

      {activeTab === "bookings" && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800">All Bookings</h3>
            </div>
            <div className="flex gap-2">
              <button
                className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md text-xs font-medium flex items-center"
                onClick={() => handleExport("list-of-bookings", "CSV")}
              >
                <Download size={12} className="mr-1" />
                Export CSV
              </button>
            </div>
          </div>

          {bookingData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700">
                    <th className="px-6 py-4 text-left font-medium text-sm uppercase tracking-wider w-1/5">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-500" />
                        <span>Guest Details</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left font-medium text-sm uppercase tracking-wider w-1/5">
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-blue-500" />
                        <span>Room</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left font-medium text-sm uppercase tracking-wider w-2/5">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span>Stay Period</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left font-medium text-sm uppercase tracking-wider w-1/12">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-blue-500" />
                        <span>Price</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left font-medium text-sm uppercase tracking-wider w-1/12">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-blue-500" />
                        <span>Status</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookingData.map((booking) => (
                    <tr
                      key={booking.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {booking.fullName}
                          </span>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Mail className="w-3 h-3 mr-1" />
                            {booking.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Phone className="w-3 h-3 mr-1" />
                            {booking.phone}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Users className="w-3 h-3 mr-1" />
                            {booking.adults} Adults, {booking.kids} Kids
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="font-medium text-gray-900">
                            {booking.room?.roomNumber || "Not Assigned"}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {booking.roomType}
                          </div>
                          {booking.specialRequest && (
                            <div className="mt-2 text-xs p-2 bg-amber-50 text-amber-700 rounded-md">
                              <span className="font-medium">
                                Special Request:
                              </span>{" "}
                              {booking.specialRequest}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex flex-col w-full">
                              <div className="flex items-center justify-between">
                                <span className="px-2 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium">
                                  Check-in
                                </span>
                                <span className="text-sm text-gray-900 font-medium">
                                  {formatDate(booking.checkIn)}
                                </span>
                              </div>
                              <div className="h-1 bg-gray-100 rounded-full mt-2 mb-2 relative">
                                <div
                                  className="absolute left-0 h-1 bg-blue-400 rounded-full"
                                  style={{ width: "20%" }}
                                ></div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="px-2 py-1 rounded-md bg-red-50 text-red-700 text-xs font-medium">
                                  Check-out
                                </span>
                                <span className="text-sm text-gray-900 font-medium">
                                  {formatDate(booking.checkOut)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="bg-indigo-50 rounded-md p-2 text-center mt-2">
                            <span className="text-indigo-700 font-medium">
                              {calculateStayDuration(
                                booking.checkIn,
                                booking.checkOut
                              )}{" "}
                              Nights
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          Ksh{" "}
                          {(
                            booking.roomPrice *
                            calculateStayDuration(
                              booking.checkIn,
                              booking.checkOut
                            )
                          ).toFixed(2)}
                        </div>

                        <div className="text-xs text-gray-500">
                          {booking.paymentMethod}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <Calendar className="w-16 h-16 text-blue-200 mb-4" />
              <p className="text-gray-700 font-medium text-lg">
                No booking data available
              </p>
              <p className="text-gray-500 mt-2">
                When bookings are created, they will appear here
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
