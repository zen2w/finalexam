"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Ticket, Menu, X, Clock } from "lucide-react";
import LiveClock from "./LiveClock";
import UserMenu from "./UserMenu";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-[#0D0E12] border-b border-white/5 select-none sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left Section: Logo & Nav Links */}
        <div className="flex items-center gap-4 sm:gap-8">
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/logo.svg"
              alt="MovieSeat"
              width={141}
              height={32}
              className="h-7 sm:h-8 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-2 sm:gap-4">
            <Link
              href="/"
              className={`text-sm font-semibold px-3.5 py-1.5 rounded-lg transition ${
                pathname === "/"
                  ? "bg-[#F59E0B] text-black shadow-sm"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Now Showing
            </Link>
            <Link
              href="/find-reservation"
              className={`text-sm font-medium px-3.5 py-1.5 rounded-lg transition ${
                pathname === "/find-reservation"
                  ? "bg-[#F59E0B] text-black shadow-sm"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Find Reservation
            </Link>
          </nav>
        </div>

        {/* Right Section: Hall, Time, User Menu, Hamburger */}
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="hidden lg:flex items-center gap-2 text-sm text-gray-300 font-medium">
            <Ticket className="w-4 h-4 text-[#F59E0B]" />
            <span>Cinema City Hall</span>
          </div>

          <span className="hidden lg:inline text-gray-600">|</span>

          <div className="hidden sm:flex items-center">
            <LiveClock />
          </div>

          <UserMenu />

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle Navigation Menu"
            className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Collapsible Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#121316] border-b border-white/10 px-4 py-4 space-y-3 animate-fade-in shadow-2xl">
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm font-semibold px-4 py-2.5 rounded-xl transition ${
                pathname === "/"
                  ? "bg-[#F59E0B] text-black font-bold shadow-sm"
                  : "text-gray-300 hover:bg-white/5"
              }`}
            >
              🎬 Now Showing
            </Link>
            <Link
              href="/find-reservation"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm font-medium px-4 py-2.5 rounded-xl transition ${
                pathname === "/find-reservation"
                  ? "bg-[#F59E0B] text-black font-bold shadow-sm"
                  : "text-gray-300 hover:bg-white/5"
              }`}
            >
              🔍 Find Reservation
            </Link>
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Cinema City Hall</span>
            </div>
            <div className="sm:hidden">
              <LiveClock />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
