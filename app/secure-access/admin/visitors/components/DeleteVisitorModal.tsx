"use client";

import { useState } from "react";
import { X } from "lucide-react";
import AuthService from "@/app/services/auth";
import Toast from "@/app/components/ui/Toast";

interface Visitor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
}

interface DeleteVisitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVisitorDeleted: () => void;
  visitor: Visitor | null;
}

export default function DeleteVisitorModal({
  isOpen,
  onClose,
  onVisitorDeleted,
  visitor,
}: DeleteVisitorModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleDelete = async () => {
    if (!visitor) return;

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/visitor-accounts/${visitor.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${AuthService.getToken()}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete visitor");
      }

      setToast({
        message: "Visitor deleted successfully",
        type: "success",
      });
      
      // Close modal after delay
      setTimeout(() => {
        onClose();
        onVisitorDeleted();
      }, 1000);
    } catch (error) {
      console.error("Error deleting visitor:", error);
      setError(error instanceof Error ? error.message : "Failed to delete visitor");
      setToast({
        message: "Failed to delete visitor",
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen || !visitor) return null;

  return (
    <>
      <div className="fixed inset-0 bg-white/30 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Delete Visitor</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <div className="space-y-4">
              <p className="text-gray-600">
                Are you sure you want to delete this visitor? This action cannot be undone.
              </p>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Visitor Details</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Name:</span> {visitor.firstName}{" "}
                    {visitor.lastName}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {visitor.email}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {visitor.phone}
                  </p>
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg 
                       hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg 
                       hover:bg-red-700 transition-colors disabled:opacity-50 
                       disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Deleting...
                </>
              ) : (
                "Delete Visitor"
              )}
            </button>
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