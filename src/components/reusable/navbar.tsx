// Updated navbar.tsx using Auth Context
"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/components/context/AuthContext";

export function NavbarDemo() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  // Use auth context instead of local state
  const { user, loading, logout, isAdmin, isAuthenticated } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  const handleLogin = () => {
    router.push('/login');
  };

  // Filter navigation items based on user role
  const getNavItems = () => {
    const baseNavItems = [
      {
        name: "Home",
        link: "/",
      },
      {
        name: "Contact",
        link: "https://portfolokiranjeet28.vercel.app/",
      },
    ];

    // Only add Create tab if user is ADMIN
    if (isAdmin) {
      return [
        baseNavItems[0], // Home
        {
          name: "Create",
          link: "/create",
        },
        baseNavItems[1], // Contact
      ];
    }

    return baseNavItems;
  };

  const navItems = getNavItems();

  return (
    <div className="relative w-full">
      <Navbar className="">
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            ) : isAuthenticated ? (
              <>
                {/* Show Create button only for ADMIN */}
                {isAdmin && (
                  <NavbarButton
                    onClick={() => router.push('/create')}
                    className="px-8 py-2 rounded-md bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white font-bold transition duration-200 hover:from-gray-200 hover:to-white hover:via-gray-200 hover:text-blue-500 border-2 border-transparent hover:border-blue-500 cursor-pointer"
                  >
                    Create
                  </NavbarButton>
                )}

                {/* User Dropdown */}
                <div className="relative user-dropdown">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                   
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        <p className="text-xs text-blue-600 font-medium mt-1">{user?.role}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Show Login button when no user
              <NavbarButton
                onClick={handleLogin}
                className="px-8 py-2 rounded-md bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white font-bold transition duration-200 hover:from-gray-200 hover:to-white hover:via-gray-200 hover:text-blue-500 border-2 border-transparent hover:border-blue-500 cursor-pointer"
              >
                Login
              </NavbarButton>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300 cursor-pointer"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}

            <div className="flex w-full flex-col gap-4 mt-4 border-t border-gray-200 pt-4">
              {loading ? (
                <div className="flex justify-center py-2">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : isAuthenticated ? (
                <>
                  {/* User Info in Mobile */}
                  <div className="px-4 py-3 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    <p className="text-xs text-blue-600 font-medium mt-1">{user?.role}</p>
                  </div>

                  {/* Show Create button only for ADMIN */}
                  {isAdmin && (
                    <button
                      onClick={() => {
                        router.push('/create');
                        setIsMobileMenuOpen(false);
                      }}
                      className="px-8 py-2 rounded-md bg-blue-900 text-white font-bold transition duration-200 hover:bg-white hover:text-blue-400 border-2 border-transparent hover:border-blue-500 cursor-pointer"
                    >
                      Create
                    </button>
                  )}

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-8 py-2 rounded-md bg-red-500 text-white font-bold transition duration-200 hover:bg-red-600 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                // Show Login button when no user
                <button
                  onClick={() => {
                    handleLogin();
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-8 py-2 rounded-md bg-blue-900 text-white font-bold transition duration-200 hover:bg-white hover:text-blue-400 border-2 border-transparent hover:border-blue-500 cursor-pointer"
                >
                  Login
                </button>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}