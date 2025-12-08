"use client";

import { useState } from "react";
import { useManagerAuth } from "@/context/ManagerAuthContext";
import Link from "next/link";

export default function ManagerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useManagerAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.message || "Invalid email or password");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-siara-purple-950 via-siara-purple-900 to-siara-purple-950 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-siara-purple-800/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-siara-gold-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-siara-gold-500/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-siara-purple-500/10 rounded-full"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-12 group">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-siara-gold-400 via-siara-gold-500 to-siara-gold-600 flex items-center justify-center shadow-2xl">
                <span className="font-cormorant text-3xl font-bold text-siara-purple-950">S</span>
              </div>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-cormorant text-3xl font-semibold tracking-wide text-white">
                Siara
              </span>
              <span className="font-dm-sans text-xs uppercase tracking-[0.3em] text-siara-gold-400 -mt-1">
                Events
              </span>
            </div>
          </Link>

          <h1 className="font-cormorant text-4xl xl:text-5xl font-semibold text-white mb-6">
            Manager Portal
          </h1>
          <p className="font-dm-sans text-lg text-siara-purple-200/70 max-w-md leading-relaxed">
            Access your dashboard to manage events, clients, and business operations with ease.
          </p>

          {/* Features */}
          <div className="mt-12 space-y-4 text-left">
            {[
              "Real-time event tracking",
              "Client management system",
              "Analytics & Reports",
              "Team collaboration tools"
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 text-siara-purple-200/70">
                <div className="w-6 h-6 rounded-full bg-siara-gold-500/20 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-siara-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-dm-sans text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-siara-gold-400 via-siara-gold-500 to-siara-gold-600 flex items-center justify-center shadow-lg">
                <span className="font-cormorant text-xl font-bold text-siara-purple-950">S</span>
              </div>
              <div className="flex flex-col">
                <span className="font-cormorant text-2xl font-semibold tracking-wide text-siara-purple-950">
                  Siara
                </span>
                <span className="font-dm-sans text-[10px] uppercase tracking-[0.3em] text-siara-gold-600 -mt-1">
                  Events
                </span>
              </div>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 lg:p-10">
            <div className="text-center mb-8">
              <h2 className="font-cormorant text-3xl font-semibold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="font-dm-sans text-gray-500">
                Sign in to access your manager dashboard
              </p>
            </div>

            {/* Demo Credentials Info */}
            <div className="mb-6 p-4 rounded-xl bg-siara-purple-50 border border-siara-purple-100">
              <p className="font-dm-sans text-xs text-siara-purple-700 font-medium mb-2">Demo Credentials:</p>
              <p className="font-dm-sans text-xs text-siara-purple-600">Email: admin@siara.com</p>
              <p className="font-dm-sans text-xs text-siara-purple-600">Password: siara123</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100">
                <p className="font-dm-sans text-sm text-red-600 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block font-dm-sans text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 font-dm-sans text-gray-900 placeholder-gray-400 focus:outline-none focus:border-siara-purple-500 focus:ring-2 focus:ring-siara-purple-500/20 transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block font-dm-sans text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-gray-200 bg-gray-50 font-dm-sans text-gray-900 placeholder-gray-400 focus:outline-none focus:border-siara-purple-500 focus:ring-2 focus:ring-siara-purple-500/20 transition-all"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-siara-purple-600 focus:ring-siara-purple-500"
                  />
                  <span className="font-dm-sans text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="font-dm-sans text-sm text-siara-purple-600 hover:text-siara-purple-700">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-siara-purple-800 to-siara-purple-900 text-white font-dm-sans font-semibold hover:from-siara-purple-900 hover:to-siara-purple-950 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Back to Website */}
            <div className="mt-8 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 font-dm-sans text-sm text-gray-500 hover:text-siara-purple-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Website
              </Link>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center font-dm-sans text-sm text-gray-400">
            © 2024 Siara Events. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

