"use client";

import { useState, useEffect } from "react";
import { X, AlertTriangle, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import axios from "axios";
import AuthService from "@/app/services/auth";

interface DeleteBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (bookingId: string) => void;
  booking: {
    id: string;
    visitorName: string;
    visitorEmail?: string;
    visitorPhone?: string;
    adults?: number;
    kids?: number;
    specialRequest?: string;
    checkIn: string;
    checkOut: string;
    roomType: string;
    status: string;
  } | null;
}

export default function DeleteBookingModal({
  isOpen,
  onClose,
  onSuccess,
  booking,
}: DeleteBookingModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Reset states when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setShowSuccessToast(false);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen || !booking) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      
      // Use the correct API endpoint for deleting a booking
      const response = await axios.delete(
        `http://localhost:5000/api/booking/${booking.id}`,
        {
          headers: {
            Authorization: `Bearer ${AuthService.getToken()}`,
            'Content-Type': 'application/json'
          },
        }
      );

      // Check if the deletion was successful
      // The server returns 204 No Content on successful deletion
      if (response.status === 204) {
        // Show success toast
        setShowSuccessToast(true);
        
        // Notify parent component of successful deletion
        onSuccess(booking.id);
        
        // Close the modal after a short delay to allow the toast to be seen
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        throw new Error("Failed to delete booking");
      }
    } catch (err: any) {
      // Improved error handling
      let errorMessage = "Error deleting booking";
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = err.response.data?.error || `Server error: ${err.response.status}`;
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage = "No response from server. Please check your connection.";
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = `Request error: ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Delete Booking</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors"
                disabled={isDeleting}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 rounded-full p-2 mr-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <p className="text-gray-700 font-medium">
                Are you sure you want to delete this booking?
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-2">{booking.visitorName}</h3>
              <div className="space-y-1 text-sm text-gray-600">
                {booking.visitorEmail && (
                  <p>
                    <span className="font-medium">Email:</span> {booking.visitorEmail}
                  </p>
                )}
                {booking.visitorPhone && (
                  <p>
                    <span className="font-medium">Phone:</span> {booking.visitorPhone}
                  </p>
                )}
                <p>
                  <span className="font-medium">Check-in:</span>{" "}
                  {format(new Date(booking.checkIn), "MMM dd, yyyy")}
                </p>
                <p>
                  <span className="font-medium">Check-out:</span>{" "}
                  {format(new Date(booking.checkOut), "MMM dd, yyyy")}
                </p>
                <p>
                  <span className="font-medium">Room Type:</span> {booking.roomType}
                </p>
                {booking.adults !== undefined && (
                  <p>
                    <span className="font-medium">Guests:</span> {booking.adults} Adults
                    {booking.kids && booking.kids > 0 && ` + ${booking.kids} Kids`}
                  </p>
                )}
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  {booking.status.replace("_", " ")}
                </p>
                {booking.specialRequest && (
                  <p>
                    <span className="font-medium">Special Request:</span>{" "}
                    {booking.specialRequest}
                  </p>
                )}
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone. The booking will be permanently removed from the system.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </div>
                ) : (
                  "Delete Booking"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast Notification */}
      {showSuccessToast && (
        <div className="fixed bottom-4 right-4 z-[100] bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center animate-fade-in-up">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span>Booking deleted successfully</span>
        </div>
      )}
    </>
  );
} 