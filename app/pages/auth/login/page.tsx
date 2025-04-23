"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import UserAuthService from "@/app/services/user_auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check if user is already logged in
    if (UserAuthService.isAuthenticated()) {
      router.push("/user_dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setIsSuccess(false);

    try {
      const response = await fetch(
        "http://localhost:5000/api/visitor-accounts/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to login visitor");
      }

      const { token, visitor } = await response.json();

      // Store auth token and user info
      UserAuthService.setAuth(token, visitor);

      // Show success state
      setIsSuccess(true);

      // Redirect to explore page
      setTimeout(() => {
        router.push("/user_dashboard");
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      <Navbar />

      <div className="container mx-auto px-4 py-6 pt-20">
        <div
          className={`bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row w-full max-w-6xl mx-auto overflow-hidden transition-all duration-500 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Left Side */}
          <div className="md:w-1/2 relative overflow-hidden min-h-[350px] md:min-h-[550px] bg-amber-600">
            <Image
              src="/images/luxury-room.jpg"
              alt="Hotel Lobby"
              fill
              className="object-cover transform hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600/80 to-amber-800/80 flex flex-col justify-center p-4 md:p-12 text-white">
              <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 animate-fade-in">
                Welcome Back!
              </h2>
              <p className="text-base md:text-lg mb-4 md:mb-8 animate-fade-in delay-200">
                Experience luxury and comfort at its finest. Sign in to access
                your exclusive member benefits.
              </p>
              <div className="space-y-3 md:space-y-4 animate-fade-in delay-300">
                <div className="flex items-center">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center mr-3 md:mr-4">
                    <svg
                      className="w-4 h-4 md:w-6 md:h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <p>Check your email</p>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center mr-3 md:mr-4">
                    <svg
                      className="w-4 h-4 md:w-6 md:h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p>Follow the instructions</p>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center mr-3 md:mr-4">
                    <svg
                      className="w-4 h-4 md:w-6 md:h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p>Create new password</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="md:w-1/2 p-6 md:p-8 bg-white">
            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold text-gray-800 mb-1">Sign In</h3>
              <p className="text-gray-600">Access your account</p>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="text-red-600 text-center text-sm">
                  {errorMessage}
                </div>
              )}

              <div className="relative group">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="relative group">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  href="/pages/auth/forgot-password"
                  className="text-amber-600 hover:text-amber-500 text-sm"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading || isSuccess}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] ${
                  isSuccess ? "bg-green-500 hover:bg-green-600" : ""
                }`}
              >
                {isLoading ? (
                  <span className="inline-flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Signing in...
                  </span>
                ) : isSuccess ? (
                  <span className="inline-flex items-center">
                    <svg
                      className="animate-bounce -ml-1 mr-3 h-5 w-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Success! Redirecting...
                  </span>
                ) : (
                  <span className="inline-flex items-center">
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign in
                  </span>
                )}
              </button>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    href="/pages/auth/register"
                    className="text-amber-600 hover:text-amber-500 font-medium"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
