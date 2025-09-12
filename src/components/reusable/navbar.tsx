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
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export function NavbarDemo() {
  const navItems = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Create",
      link: "/create",
    },
    {
      name: "Contact",
      link: "https://www.tnpgndec.com/",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="relative w-full">
      <Navbar className="">
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <NavbarButton
              onClick={() => router.push('/create')}
              className="px-8 py-2 rounded-md bg-blue-900 text-white font-bold transition duration-200 hover:bg-white hover:text-blue-400 border-2 border-transparent hover:border-blue-500 cursor-pointer"
            >
              Create
            </NavbarButton>
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
            <div className="flex w-full flex-col gap-4">
              <button
                onClick={() => router.push('/create')}
                className="px-8 py-2 rounded-md bg-blue-900 text-white font-bold transition duration-200 hover:bg-white hover:text-blue-400 border-2 border-transparent hover:border-blue-500 cursor-pointer"
              >
                Create
              </button>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}