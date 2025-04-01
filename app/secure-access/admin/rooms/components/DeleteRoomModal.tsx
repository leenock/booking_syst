import { useState, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";
import AuthService from "@/app/services/auth";
import Toast from "@/app/components/ui/Toast";

interface Room {
  id: string;
  roomNumber: string;
  type: string;
  price: number;
  capacity: number;
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";
  description: string;
  amenities: string[];
  images: string[];
}

type DeleteRoomModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onRoomDeleted: () => void;
  room: Room | null;
};

export default function DeleteRoomModal({
  isOpen,
  onClose,
  onRoomDeleted,
  room,
}: DeleteRoomModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  useEffect(() => {
    if (!isOpen) {
      setIsDeleting(false);
      setIsSuccess(false);
      setError(null);
      setShowToast(false);
    }
  }, [isOpen]);

  const handleDelete = async () => {
    if (!room) return;

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/rooms/${room.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${AuthService.getToken()}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete room");
      }

      setIsSuccess(true);
      setToastMessage("Room deleted successfully");
      setToastType("success");
      setShowToast(true);

      // Wait for a moment to show the success message before closing
      setTimeout(() => {
        onRoomDeleted();
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error deleting room:", error);
      setError(error instanceof Error ? error.message : "Failed to delete room");
      setToastMessage("Failed to delete room");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsDeleting(false);
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
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md relative">
          {/* Modal Header */}
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Delete Room
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Are you sure you want to delete this room?
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
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Delete Room {room.roomNumber}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    This action cannot be undone. This will permanently delete the room
                    and all associated data.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Room Details
                </h4>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-gray-500">Room Type</dt>
                    <dd className="mt-1 font-medium text-gray-900">
                      {room.type}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Price</dt>
                    <dd className="mt-1 font-medium text-gray-900">
                      Ksh {room.price}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Capacity</dt>
                    <dd className="mt-1 font-medium text-gray-900">
                      {room.capacity} persons
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Status</dt>
                    <dd className="mt-1 font-medium text-gray-900">
                      {room.status}
                    </dd>
                  </div>
                </dl>
              </div>

              {error && (
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isDeleting}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="button"
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
                    'Delete Room'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 