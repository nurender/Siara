"use client";

import { useSidebar } from "@/context/SidebarContext";
import { ManagerAuthProvider, useManagerAuth } from "@/context/ManagerAuthContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React from "react";
import { usePathname } from "next/navigation";

function ManagerContent({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { isAuthenticated, isLoading } = useManagerAuth();
  const pathname = usePathname();
  
  // Ensure component is mounted (client-side only)
  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  // Check if we're on the login page
  const isLoginPage = pathname === "/manager/login" || pathname === "/manager/login/";
  
  // During SSR or before mount, just render children for login page
  if (!mounted) {
    if (isLoginPage) {
      return <>{children}</>;
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-siara-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-dm-sans text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  // If on login page, always render children (login form)
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loading state only for non-login pages
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-siara-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-dm-sans text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and not on login page, show redirect message
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-siara-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-dm-sans text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Authenticated - show full dashboard layout
  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />
      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />
        {/* Page Content */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ManagerAuthProvider>
      <ManagerContent>{children}</ManagerContent>
    </ManagerAuthProvider>
  );
}
