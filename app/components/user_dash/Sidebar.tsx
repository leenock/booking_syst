"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Calendar,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  LucideIcon,
} from "lucide-react";
import UserAuthService, { UserData } from "@/app/services/user_auth";

// Types
interface VisitorSidebarProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

interface MenuItem {
  name: string;
  icon: LucideIcon;
  href: string;
}

// Menu Items
const MENU_ITEMS: MenuItem[] = [
  { name: "Home", icon: Home, href: "/user_dashboard" },
  { name: "My Bookings", icon: Calendar, href: "/pages/user_bookings" },
  { name: "Reports", icon: Calendar, href: "/pages/analytics" },
  { name: "Notifications", icon: Bell, href: "/pages/notifications" },
  { name: "Settings", icon: Settings, href: "/pages/settings" },
];

const RESIZE_DEBOUNCE_MS = 100;
const DESKTOP_BREAKPOINT = 768;

function debounce<T extends (...args: any[]) => any>(fn: T, ms: number) {
  let timer: NodeJS.Timeout;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

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

export default function VisitorSidebar({ isOpen, onOpenChange }: VisitorSidebarProps) {
  const pathname = usePathname();
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleClose = useCallback(() => onOpenChange(false), [onOpenChange]);

  const handleLogout = async () => {
    await UserAuthService.logout();
  };

  const handleResize = useCallback(() => {
    if (window.innerWidth >= DESKTOP_BREAKPOINT) {
      handleClose();
    }
  }, [handleClose]);

  const isActive = useCallback((path: string) => pathname === path, [pathname]);

  useEffect(() => {
    const data = UserAuthService.getUserData();
    if (data) setUserData(data);
  }, []);

  useEffect(() => {
    handleClose();
  }, [pathname, handleClose]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const debouncedResize = debounce(handleResize, RESIZE_DEBOUNCE_MS);
    handleResize();
    window.addEventListener("resize", debouncedResize);
    return () => window.removeEventListener("resize", debouncedResize);
  }, [handleResize]);

  const renderProfileSection = () => {
    if (!userData) return <ProfileSkeleton />;

    return (
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-200 to-teal-200 flex items-center justify-center">
              <span className="text-lg font-semibold text-teal-700">
                {userData.firstName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-800">{userData.firstName}</h2>
            <p className="text-xs text-gray-500">{userData.email}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderNavigation = () => (
    <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
      <Suspense fallback={[...Array(4)].map((_, i) => <MenuItemSkeleton key={i} />)}>
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive(item.href)
                ? "bg-teal-50 text-teal-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.name}</span>
          </Link>
        ))}
      </Suspense>
    </nav>
  );

  const renderLogoutButton = () => (
    <div className="p-4 mt-auto border-t border-gray-100 bg-gradient-to-r from-teal-50/50 to-green-50/50">
      <button
        onClick={handleLogout}
        className="flex items-center w-full px-4 py-3 text-gray-600 rounded-xl hover:bg-white/80 hover:shadow-sm transition-all duration-200 group"
      >
        <LogOut className="w-5 h-5 mr-3 text-teal-600 group-hover:text-green-600 transition-colors duration-200" />
        <span className="font-medium group-hover:text-gray-800 transition-colors duration-200">
          Log out
        </span>
      </button>
    </div>
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-30 md:hidden"
          onClick={handleClose}
        />
      )}

      <button
        onClick={() => onOpenChange(!isOpen)}
        className="fixed top-3 left-3 z-50 p-2.5 rounded-xl bg-white/90 backdrop-blur-sm border border-gray-100/50 shadow-sm hover:bg-white hover:shadow-md active:scale-95 transition-all duration-200 md:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X size={20} className="text-teal-600 rotate-90 transition-transform duration-200" />
        ) : (
          <Menu size={20} className="text-teal-600 transition-transform duration-200" />
        )}
      </button>

      <aside
        className={`fixed top-0 left-0 h-full bg-white/95 backdrop-blur-sm shadow-xl z-40 transition-all duration-300 ease-in-out transform ${
          isOpen ? "w-72 translate-x-0" : "w-72 -translate-x-full md:translate-x-0 md:w-64"
        }`}
        role="navigation"
        aria-label="Visitor navigation"
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-100 md:block hidden">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 text-transparent bg-clip-text">
              Visitor Panel
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
