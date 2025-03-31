"use client";

import { useState } from "react";
import { X } from "lucide-react";
import AuthService from "@/app/services/auth";
import Toast from "@/app/components/ui/Toast";

interface VisitorFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  isActive: boolean;
}

interface AddVisitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVisitorAdded: () => void;
}

export default function AddVisitorModal({
  isOpen,
  onClose,
  onVisitorAdded,
}: AddVisitorModalProps) {
  const [formData, setFormData] = useState<VisitorFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    isActive: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" 
        ? (e.target as HTMLInputElement).checked 
        : type === "select-one"
        ? value === "true"
        : value,
    }));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName) {
      setError("First name and last name are required");
      setToast({
        message: "First name and last name are required",
        type: "error",
      });
      return false;
    }

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      setToast({
        message: "Email and password are required",
        type: "error",
      });
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      setToast({
        message: "Please enter a valid email address",
        type: "error",
      });
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setToast({
        message: "Password must be at least 6 characters long",
        type: "error",
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setToast({
        message: "Passwords do not match",
        type: "error",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const requestPayload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        isActive: formData.isActive,
      };
      console.log('Sending request with payload:', requestPayload);

      const response = await fetch("http://localhost:5000/api/visitor-accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AuthService.getToken()}`,
        },
        body: JSON.stringify(requestPayload),
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (!response.ok) {
        throw new Error(data.error || `Failed to add visitor account: ${response.status} ${response.statusText}`);
      }

      setToast({
        message: "Visitor account added successfully",
        type: "success",
      });

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        isActive: true,
      });

      // Close modal after delay
      setTimeout(() => {
        onClose();
        onVisitorAdded();
      }, 1000);
    } catch (error) {
      console.error("Error details:", error);
      setError(error instanceof Error ? error.message : "Failed to add visitor account");
      setToast({
        message: error instanceof Error ? error.message : "Failed to add visitor account",
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
        <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Add New Visitor Account</h2>
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
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-blue-500/20 
                               transition-all duration-200"
                      placeholder="Enter first name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-blue-500/20 
                               transition-all duration-200"
                      placeholder="Enter last name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-blue-500/20 
                               transition-all duration-200"
                      placeholder="Enter email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-blue-500/20 
                               transition-all duration-200"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-blue-500/20 
                               transition-all duration-200"
                      placeholder="Enter password"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      minLength={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-blue-500/20 
                               transition-all duration-200"
                      placeholder="Confirm password"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Status
                    </label>
                    <select
                      name="isActive"
                      value={formData.isActive.toString()}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-blue-500/20 
                               transition-all duration-200"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
              )}

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg 
                           hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg 
                           hover:bg-blue-700 transition-colors disabled:opacity-50 
                           disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Adding...
                    </>
                  ) : (
                    "Add Visitor Account"
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