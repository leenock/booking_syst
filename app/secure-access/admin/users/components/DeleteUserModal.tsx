import { X, CheckCircle, AlertTriangle } from "lucide-react";
import AuthService from "@/app/services/auth";
import { useState, useEffect } from "react";
import { User } from "../types";
import Toast from "@/app/components/ui/Toast";

type DeleteUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUserDeleted: () => void;
  user: User | null;
}

export default function DeleteUserModal({ isOpen, onClose, onUserDeleted, user }: DeleteUserModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [currentAdminId, setCurrentAdminId] = useState<string | null>(null);

  useEffect(() => {
    // Get current admin's ID from AuthService
    const adminData = AuthService.getAdminData();
    if (adminData) {
      setCurrentAdminId(adminData.id);
    }
  }, []);

  // Reset states when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setIsDeleting(false);
      setIsSuccess(false);
      setError(null);
      setShowToast(false);
      setToastMessage("");
      setToastType("success");
    }
  }, [isOpen]);

  const handleDelete = async () => {
    if (!user) return;

    // Check if user is trying to delete their own account
    if (user.id === currentAdminId) {
      setError("You cannot delete your own account");
      setToastMessage("You cannot delete your own account");
      setToastType("error");
      setShowToast(true);
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/${user.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${AuthService.getToken()}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete user");
      }

      setIsSuccess(true);
      setToastMessage("User deleted successfully");
      setToastType("success");
      setShowToast(true);

      // Wait for a moment to show the success message before closing
      setTimeout(() => {
        onUserDeleted();
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error deleting user:", error);
      setError(error instanceof Error ? error.message : "Failed to delete user");
      setToastMessage("Failed to delete user");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen || !user) return null;

  const isOwnAccount = user.id === currentAdminId;

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
                  Delete User
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {isOwnAccount 
                    ? "You cannot delete your own account"
                    : "Are you sure you want to delete this user?"}
                </p>
              </div>
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Modal Body */}
          <div className="px-6 py-5">
            {isOwnAccount ? (
              <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">Cannot Delete Own Account</h3>
                  <p className="mt-1 text-sm text-yellow-700">
                    For security reasons, you cannot delete your own account. Please contact another administrator if you need to delete your account.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {user.firstName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>

                <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-red-800">Warning</h3>
                      <p className="mt-1 text-sm text-red-700">
                        This action cannot be undone. The user will lose access to the system immediately.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-5 bg-gray-50 rounded-b-xl">
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              {!isOwnAccount && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 
                           transition-all duration-200 focus:outline-none focus:ring-2 
                           focus:ring-red-500/20 font-medium cursor-pointer disabled:opacity-50 
                           disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    'Delete User'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 