"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Lock, User, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import {
  validateVisitorForm,
  hasFormErrors,
  FormErrors,
  VisitorFormData,
} from "@/app/utils/validation";

// If you're using a toast context or hook
import Toast from "@/app/components/ui/Toast"; // Update to match your toast system

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    isActive: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const validationErrors = validateVisitorForm(formData);
    if (hasFormErrors(validationErrors)) {
      setError("Please fix the form errors before submitting.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/visitor-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          isActive: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Account creation failed");
        setIsLoading(false);
        return;
      }

      // Toast on success
      setToast({
        message: "Visitor added successfully",
        type: "success",
      });

      // Delay navigation by 2 seconds to allow user to see toast
      setTimeout(() => {
        router.push("/pages/auth/login");
      }, 5000);

      // Redirect on success
      router.push("/pages/auth/login");
    } catch (err) {
      console.error("Error creating account:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      <Navbar />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="container mx-auto px-4 py-6 pt-20">
        <div
          className={`bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row-reverse w-full max-w-6xl mx-auto overflow-hidden transition-all duration-500 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Left Side - Image */}
          <div className="md:w-1/2 relative overflow-hidden min-h-[350px] md:min-h-[550px] bg-amber-600">
            <Image
              src="/images/luxury-room.jpg"
              alt="Luxury Hotel Room"
              fill
              className="object-cover transform hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600/80 to-amber-800/80 flex flex-col justify-center p-4 md:p-12 text-white">
              <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 animate-fade-in">
                Join Our Community
              </h2>
              <p className="text-base md:text-lg mb-4 md:mb-8 animate-fade-in delay-200">
                Create an account to unlock exclusive benefits and experience
                luxury at its finest.
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="md:w-1/2 p-8 md:p-12 bg-white">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-800 mb-2">
                Create Account
              </h3>
              <p className="text-gray-600">
                Join us for an exceptional experience
              </p>
            </div>

            {error && (
              <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg mb-6 flex items-center justify-between">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 12H6"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v12"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-white ml-4 hover:text-gray-300"
                >
                  &times;
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* First Name */}
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-400" />
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="pl-10 w-full py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-amber-500 focus:outline-none"
                      placeholder="First name"
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-400" />
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="pl-10 w-full py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-amber-500 focus:outline-none"
                      placeholder="Last name"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 w-full py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-amber-500 focus:outline-none"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-gray-400" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10 w-full py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-amber-500 focus:outline-none"
                    placeholder="+254..."
                  />
                </div>
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 w-full py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-amber-500 focus:outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="pl-10 w-full py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-amber-500 focus:outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition duration-300"
              >
                {isLoading ? "Creating..." : "Create Account"}
              </button>

              <p className="text-sm text-center text-gray-600">
                Already have an account?{" "}
                <Link href="/pages/auth/login" className="text-amber-600 hover:underline">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
