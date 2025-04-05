"use client";

import { useState, useRef } from "react";
import { X } from "lucide-react";
import AuthService from "@/app/services/auth";
import Toast from "@/app/components/ui/Toast";

interface RoomFormData {
  roomNumber: string;
  type: string;
  price: number;
  capacity: number;
  status: "AVAILABLE" | "MAINTENANCE";
  description: string;
  amenities: string[];
  images: string[];
}

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoomAdded: () => void;
}

export default function AddRoomModal({
  isOpen,
  onClose,
  onRoomAdded,
}: AddRoomModalProps) {
  const [formData, setFormData] = useState<RoomFormData>({
    roomNumber: "",
    type: "STANDARD",
    price: 0,
    capacity: 1,
    status: "AVAILABLE",
    description: "",
    amenities: [],
    images: [],
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const roomNumberInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Clear form error when user starts typing
    if (name === 'roomNumber') {
      setFormError(null);
    }
    
    // Handle numeric inputs
    if (name === 'price' || name === 'capacity') {
      setFormData((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    } else {
      // Handle other inputs
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    if (!formData.roomNumber?.trim()) {
      setFormError("Room number is required");
      return false;
    }
    if (!formData.type) {
      setFormError("Room type is required");
      return false;
    }
    if (!formData.price || formData.price <= 0) {
      setFormError("Price must be greater than 0");
      return false;
    }
    if (!formData.capacity || formData.capacity < 1) {
      setFormError("Capacity must be at least 1");
      return false;
    }
    if (!formData.status) {
      setFormError("Status is required");
      return false;
    }
    if (!formData.description?.trim()) {
      setFormError("Description is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AuthService.getToken()}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error messages from the server
        if (data.error === "Room with this number already exists") {
          setFormError("This room number is already in use. Please choose a different number.");
          // Focus the room number input
          roomNumberInputRef.current?.focus();
        } else {
          setFormError(data.error || "Failed to create room");
        }
        setToast({
          message: "Failed to add room",
          type: "error",
        });
        return;
      }

      setToast({
        message: "Room added successfully",
        type: "success",
      });
      
      // Reset form
      setFormData({
        roomNumber: "",
        type: "STANDARD",
        price: 0,
        capacity: 1,
        status: "AVAILABLE",
        description: "",
        amenities: [],
        images: [],
      });
      
      // Close modal after delay
      setTimeout(() => {
        onClose();
        onRoomAdded();
      }, 1000);
    } catch (error) {
      console.error("Error creating room:", error);
      setFormError("An unexpected error occurred. Please try again.");
      setToast({
        message: "Failed to add room",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-white/30 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Add New Room</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600">{formError}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Room Number
                    </label>
                    <input
                      ref={roomNumberInputRef}
                      type="text"
                      name="roomNumber"
                      value={formData.roomNumber}
                      onChange={handleChange}
                      required
                      className={`w-full px-3 py-2 border rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-blue-500/20 
                               transition-all duration-200
                               ${formError?.includes("room number") ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter room number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Room Type
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-blue-500/20 
                               transition-all duration-200"
                    >
                      <option value="STANDARD">Standard</option>
                      <option value="DELUXE">Deluxe</option>
                      <option value="SUITE">Suite</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-blue-500/20 
                               transition-all duration-200"
                      placeholder="Enter room price"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacity
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleChange}
                      required
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-blue-500/20 
                               transition-all duration-200"
                      placeholder="Enter room capacity"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-blue-500/20 
                               transition-all duration-200"
                    >
                      <option value="AVAILABLE">Available</option>
                      <option value="MAINTENANCE">Maintenance</option>
                    </select>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-blue-500/20 
                               transition-all duration-200"
                      placeholder="Enter room description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amenities
                    </label>
                    <div className="space-y-2">
                      {["WIFI", "TV", "AC", "MINI_BAR", "JACUZZI"].map((amenity) => (
                        <label key={amenity} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.amenities.includes(amenity)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData((prev) => ({
                                  ...prev,
                                  amenities: [...prev.amenities, amenity],
                                }));
                              } else {
                                setFormData((prev) => ({
                                  ...prev,
                                  amenities: prev.amenities.filter((a) => a !== amenity),
                                }));
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 
                                     focus:ring-blue-500/20"
                          />
                          <span className="text-sm text-gray-700">
                            {amenity.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg 
                           hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg 
                           hover:bg-blue-700 transition-colors disabled:opacity-50 
                           disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Adding...
                    </>
                  ) : (
                    "Add Room"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
} 