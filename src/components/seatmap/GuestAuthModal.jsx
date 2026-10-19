"use client";

import Link from "next/link";
import { ShieldAlert, X } from "lucide-react";

export default function GuestAuthModal({ isOpen, onClose, showtimeId }) {
  if (!isOpen) return null;

  const redirectUrl = encodeURIComponent(`/screenings/${showtimeId}`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#18191E] border border-[#2B2C33] rounded-[24px] p-6 sm:p-8 shadow-2xl relative text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Shield Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-[#2A241C] border border-amber-500/40 shadow-lg shadow-amber-500/20 flex items-center justify-center text-[#F59E0B] mx-auto mb-4">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight mb-2">
          Sign In to Lock Your Seats
        </h3>

        <p className="text-xs text-gray-400 leading-relaxed mb-6 max-w-xs mx-auto">
          MovieSeat locks your selected seats in the database for <strong>5 minutes</strong> to prevent double-booking. Sign in or create an account to proceed.
        </p>

        <div className="space-y-3">
          <Link
            href={`/signin?redirect=${redirectUrl}`}
            className="w-full bg-[#F59E0B] hover:bg-[#E58E00] text-black font-semibold text-sm py-3 px-4 rounded-xl transition duration-150 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10"
          >
            Sign In to MovieSeat
          </Link>
          <Link
            href={`/signup?redirect=${redirectUrl}`}
            className="w-full bg-[#24252D] hover:bg-[#2C2E38] text-white font-medium text-sm py-3 px-4 rounded-xl transition duration-150 flex items-center justify-center border border-white/10"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
