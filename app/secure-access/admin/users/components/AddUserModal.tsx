import { useState, useEffect } from "react";
import { X } from "lucide-react";
import AuthService from "@/app/services/auth";
import { NewUserFormData } from "../types";
import Toast from "@/app/components/ui/Toast";

type AddUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: () => void;
};

export default function AddUserModal({
  isOpen,
  onClose,
  onUserAdded,
}: AddUserModalProps) {
  const [formData, setFormData] = useState<NewUserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "MODERATOR",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [isCreating, setIsCreating] = useState(false);

  // Reset toast state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setShowToast(false);
      setToastMessage("");
      setToastType("success");
    }
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsCreating(true);

    try {
      const response = await fetch("http://localhost:5000/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AuthService.getToken()}`,
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: formData.role || 'MODERATOR'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle server error response
        setFormError(data.error || "Failed to create user");
        setToastMessage("Failed to create user account");
        setToastType("error");
        setShowToast(true);
        return;
      }

      // Show success toast
      setToastMessage("User account created successfully");
      setToastType("success");
      setShowToast(true);

      // Reset form and close modal on success
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "MODERATOR"
      });
      
      // Wait for a moment to show the toast before closing
      setTimeout(() => {
        onUserAdded();
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error creating user:", error);
      setFormError("Failed to create user. Please try again.");
      setToastMessage("Failed to create user account");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

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
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md relative">
          {/* Modal Header */}
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Add New User
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Create a new system user
                </p>
              </div>
              <button
                onClick={onClose}
                disabled={isCreating}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="px-6 py-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    disabled={isCreating}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200
                             placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    disabled={isCreating}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200
                             placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isCreating}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200
                           placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isCreating}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200
                           placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  User Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  disabled={isCreating}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200
                           appearance-none bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.5em_1.5em] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236B7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M10%203a1%201%200%2001.707.293l3%203a1%201%200%2001-1.414%201.414L10%205.414%207.707%207.707a1%201%200%2001-1.414-1.414l3-3A1%201%200%200110%203zm-3.707%209.293a1%201%200%20011.414%200L10%2014.586l2.293-2.293a1%201%200%20011.414%201.414l-3%203a1%201%200%2001-1.414%200l-3-3a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="MODERATOR">Moderator</option>
                  <option value="SUPER_ADMIN">Super Administrator</option>
                </select>
              </div>

              {formError && (
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                  {formError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isCreating}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                           transition-all duration-200 focus:outline-none focus:ring-2 
                           focus:ring-blue-500/20 font-medium cursor-pointer disabled:opacity-50 
                           disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    'Create User'
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
