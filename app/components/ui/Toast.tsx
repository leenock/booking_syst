import { CheckCircle, XCircle, X } from "lucide-react";
import { useEffect } from "react";

type ToastProps = {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  duration?: number;
};

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed top-4 right-4 z-[100] animate-slide-in">
      <div className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm ${
        type === "success" 
          ? "bg-green-50/90 border border-green-200 text-green-800" 
          : "bg-red-50/90 border border-red-200 text-red-800"
      }`}>
        {type === "success" ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <XCircle className="w-5 h-5 text-red-500" />
        )}
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
} 