import { useState, useEffect } from "react";
import { X } from "lucide-react";
import AuthService from "@/app/services/auth";
import { User } from "../types";
import Toast from "@/app/components/ui/Toast";

type EditUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: () => void;
  user: User | null;
};

export default function EditUserModal({
  isOpen,
  onClose,
  onUserUpdated,
  user,
}: EditUserModalProps) {
  const [formData, setFormData] = useState<Partial<User>>({
    firstName: "",
    lastName: "",
    email: "",
    role: "MODERATOR",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

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
    if (!formData) return;
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev!,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setFormError(null);
    setIsUpdating(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AuthService.getToken()}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update user");
      }

      // Check if the updated user is the current admin
      const currentAdmin = AuthService.getAdminData();
      if (currentAdmin && currentAdmin.id === user.id) {
        // Update the admin data in local storage
        const updatedAdmin = {
          ...currentAdmin,
          ...formData,
        };
        AuthService.setAdminData(updatedAdmin);
      }

      setToastMessage("User information updated successfully");
      setToastType("success");
      setShowToast(true);

      // Wait for a moment to show the success message before closing
      setTimeout(() => {
        onUserUpdated();
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error updating user:", error);
      setFormError(error instanceof Error ? error.message : "Failed to update user");
      setToastMessage("Failed to update user information");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen || !formData) return null;

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
                  Edit User
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Update user information
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
                    disabled={isUpdating}
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
                    disabled={isUpdating}
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
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                           bg-gray-50 text-gray-500 cursor-not-allowed
                           focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Email address cannot be changed
                </p>
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
                  disabled={isUpdating}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200
                           appearance-none bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.5em_1.5em] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236B7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M10%203a1%201%200%2001.707.293l3%203a1%201%200%2001-1.414%201.414L10%205.414%207.707%207.707a1%201%200%2001-1.414-1.414l3-3A1%201%200%200110%203zm-3.707%209.293a1%201%200%20011.414%200L10%2014.586l2.293-2.293a1%201%200%20011.414%201.414l-3%203a1%201%200%2001-1.414%200l-3-3a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="MODERATOR">MODERATOR</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN</option>
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
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    "Update User"
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
