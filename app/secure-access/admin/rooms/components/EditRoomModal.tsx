"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import AuthService from "@/app/services/auth";
import Toast from "@/app/components/ui/Toast";

interface Room {
  id: string;
  roomNumber: string;
  type: string;
  price: number;
  capacity: number;
  status: "AVAILABLE" | "MAINTENANCE";
  description: string;
  amenities: string[];
  images: string[];
}

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

interface EditRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoomUpdated: () => void;
  room: Room | null;
}

export default function EditRoomModal({
  isOpen,
  onClose,
  onRoomUpdated,
  room,
}: EditRoomModalProps) {
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
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (room) {
      setFormData({
        roomNumber: room.roomNumber,
        type: room.type,
        price: room.price,
        capacity: room.capacity,
        status: room.status,
        description: room.description,
        amenities: room.amenities,
        images: room.images,
      });
    }
  }, [room]);

  // Reset form and toast state when modal is closed
  useEffect(() => {
    if (!isOpen) {
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
      setFormError(null);
      setShowToast(false);
      setToastMessage("");
      setToastType("success");
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
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
    if (!room) return;

    if (!validateForm()) {
      return;
    }

    setIsUpdating(true);
    setFormError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/rooms/${room.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AuthService.getToken()}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update room");
      }

      setToastMessage("Room updated successfully");
      setToastType("success");
      setShowToast(true);

      // Wait for a moment to show the success message before closing
      setTimeout(() => {
        onRoomUpdated();
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error updating room:", error);
      setFormError(error instanceof Error ? error.message : "Failed to update room");
      setToastMessage("Failed to update room");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen || !room) return null;

  return (
    <>
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl relative">
          {/* Modal Header */}
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Edit Room
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Update room information
                </p>
              </div>
              <button
                onClick={onClose}
                disabled={isUpdating}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="px-6 py-5">
            <form onSubmit={handleSubmit} className="space-y-5">
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
                      type="text"
                      name="roomNumber"
                      value={formData.roomNumber}
                      onChange={handleChange}
                      required
                      disabled={isUpdating}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-blue-500/20 
                               transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
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
                      disabled={isUpdating}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-blue-500/20 
                               transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
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
                      disabled={isUpdating}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-blue-500/20 
                               transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
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
                      disabled={isUpdating}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-blue-500/20 
                               transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
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
                      disabled={isUpdating}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-blue-500/20 
                               transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
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
                      disabled={isUpdating}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-blue-500/20 
                               transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
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
                            disabled={isUpdating}
                            className="rounded border-gray-300 text-blue-600 
                                     focus:ring-blue-500/20 disabled:opacity-50"
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
                  disabled={isUpdating}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                           transition-all duration-200 focus:outline-none focus:ring-2 
                           focus:ring-blue-500/20 font-medium cursor-pointer disabled:opacity-50 
                           disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isUpdating ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    "Update Room"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
} 