"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  Calendar,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart2,
  LucideIcon,
  Hotel,
  Receipt,
  Shield,
} from "lucide-react";
import AuthService, { AdminData } from "@/app/services/auth";

// Types
interface AdminSidebarProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

interface MenuItem {
  name: string;
  icon: LucideIcon;
  href: string;
}

// Constants
const MENU_ITEMS: MenuItem[] = [
  { name: "Dashboard", icon: Home, href: "/secure-access/admin" },
  { name: "Bookings", icon: Calendar, href: "/secure-access/admin/bookings" },
  { name: "Rooms", icon: Hotel, href: "/secure-access/admin/rooms" },
  { name: "System Users", icon: Users, href: "/secure-access/admin/users" },
  {
    name: "Visitors Accounts",
    icon: Users,
    href: "/secure-access/admin/visitors",
  },
  { name: "Payments", icon: Receipt, href: "/secure-access/admin/payments" },
  { name: "Security", icon: Shield, href: "/secure-access/admin/security" },
  {
    name: "Analytics",
    icon: BarChart2,
    href: "/secure-access/admin/analytics",
  },
  { name: "Settings", icon: Settings, href: "/secure-access/admin/settings" },
];

const RESIZE_DEBOUNCE_MS = 100;
const DESKTOP_BREAKPOINT = 768;

// Utility functions
function debounce<T extends (...args: any[]) => any>(fn: T, ms: number) {
  let timer: NodeJS.Timeout;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

// Add loading skeleton component
const MenuItemSkeleton = () => (
  <div className="px-4 py-3 rounded-lg animate-pulse">
    <div className="flex items-center space-x-3">
      <div className="w-5 h-5 bg-gray-200 rounded" />
      <div className="h-4 bg-gray-200 rounded w-24" />
    </div>
  </div>
);

const ProfileSkeleton = () => (
  <div className="p-6 animate-pulse">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-gray-200 rounded-full" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="h-3 bg-gray-200 rounded w-32" />
      </div>
    </div>
  </div>
);

// Add analytics tracking
const trackNavigation = (pageName: string) => {
  if (typeof window !== "undefined") {
    try {
      console.log(`Admin Navigation tracked: ${pageName}`);
    } catch (error) {
      console.error("Analytics error:", error);
    }
  }
};

export default function AdminSidebar({
  isOpen,
  onOpenChange,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [adminData, setAdminData] = useState<AdminData | null>(null);

  // Handlers
  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleLogout = async () => {
    await AuthService.logout();
  };

  const handleResize = useCallback(() => {
    if (window.innerWidth >= DESKTOP_BREAKPOINT) {
      handleClose();
    }
  }, [handleClose]);

  const isActive = useCallback((path: string) => pathname === path, [pathname]);

  // Get admin data on component mount
  useEffect(() => {
    const data = AuthService.getAdminData();
    if (data) {
      setAdminData(data);
    }
  }, []);

  // Effects
  useEffect(() => {
    handleClose();
  }, [pathname, handleClose]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initial check
    handleResize();

    const debouncedResize = debounce(handleResize, RESIZE_DEBOUNCE_MS);
    window.addEventListener("resize", debouncedResize);

    return () => {
      window.removeEventListener("resize", debouncedResize);
    };
  }, [handleResize]);

  // Render helpers
  const renderProfileSection = () => {
    if (!adminData) return <ProfileSkeleton />;

    return (
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-200 to-indigo-200 flex items-center justify-center">
              <span className="text-lg font-semibold text-blue-600">
                {adminData.lastName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-800">
              {adminData.lastName}
            </h2>
            <p className="text-xs text-gray-500">
              {adminData.email || "admin@vicarage.com"}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderNavigation = () => (
    <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
      <Suspense
        fallback={[...Array(8)].map((_, i) => (
          <MenuItemSkeleton key={i} />
        ))}
      >
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => trackNavigation(item.name)}
            className={`
              flex items-center px-4 py-3 rounded-lg transition-all duration-200
              ${
                isActive(item.href)
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }
            `}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.name}</span>
          </Link>
        ))}
      </Suspense>
    </nav>
  );

  const renderLogoutButton = () => (
    <div className="p-4 mt-auto border-t border-gray-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
      <button
        onClick={handleLogout}
        className="flex items-center w-full px-4 py-3 text-gray-600 rounded-xl hover:bg-white/80 hover:shadow-sm transition-all duration-200 group"
      >
        <LogOut className="w-5 h-5 mr-3 text-blue-500 group-hover:text-indigo-500 transition-colors duration-200" />
        <span className="font-medium group-hover:text-gray-800 transition-colors duration-200">
          Log out
        </span>
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-blue-600/10 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300 ease-in-out"
          onClick={handleClose}
        />
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={() => onOpenChange(!isOpen)}
        className="fixed top-3 left-3 z-50 p-2.5 rounded-xl bg-white/90 backdrop-blur-sm border border-gray-100/50 shadow-sm hover:bg-white hover:shadow-md active:scale-95 transition-all duration-200 md:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X
            size={20}
            className="text-blue-600 transition-transform duration-200 rotate-90"
          />
        ) : (
          <Menu
            size={20}
            className="text-blue-600 transition-transform duration-200"
          />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white/95 backdrop-blur-sm shadow-xl z-40 
          transition-all duration-300 ease-in-out transform
          ${
            isOpen
              ? "w-72 translate-x-0"
              : "w-72 -translate-x-full md:translate-x-0 md:w-64"
          }
        `}
        role="navigation"
        aria-label="Admin navigation"
      >
        <div className="flex flex-col h-full">
          {/* Logo - Hidden on mobile */}
          <div className="p-6 border-b border-gray-100 md:block hidden">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              Admin Panel
            </h1>
          </div>

          {renderProfileSection()}
          {renderNavigation()}
          {renderLogoutButton()}
        </div>
      </aside>
    </>
  );
}
