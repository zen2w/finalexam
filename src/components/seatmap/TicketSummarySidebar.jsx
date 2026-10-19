"use client";

import { useState } from "react";
import Image from "next/image";
import { User, Mail, Ticket, AlertCircle, Info, X } from "lucide-react";
import { formatShowtime, formatShowDate } from "@/lib/time";
import { getTmdbImageUrl } from "@/lib/tmdb";

export default function TicketSummarySidebar({
  movie,
  showtime,
  auditorium,
  selectedSeats,
  onRemoveSeat,
  user,
  onConfirmReservation,
  loading,
  error,
}) {
  const [customerName, setCustomerName] = useState(
    user?.user_metadata?.full_name || ""
  );
  const [customerEmail, setCustomerEmail] = useState(
    user?.email || ""
  );

  const basePrice = Number(showtime?.price || 280);

  // Calculate pricing breakdown
  const seatCount = selectedSeats.length;
  const vipSeatsCount = selectedSeats.filter((s) => s.seat_type === "vip").length;
  const standardSeatsCount = seatCount - vipSeatsCount;

  const standardTotal = standardSeatsCount * basePrice;
  const vipTotal = vipSeatsCount * (basePrice + 100);
  const totalAmount = standardTotal + vipTotal;

  const posterSrc = getTmdbImageUrl(movie?.poster_path, "w500");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedSeats.length === 0) return;
    onConfirmReservation({
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
    });
  };

  return (
    <div className="w-full lg:w-[380px] bg-[#18191E] border border-[#2B2C33] rounded-[24px] p-6 sm:p-7 shadow-2xl flex flex-col justify-between shrink-0">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Top Header Card */}
        <div className="flex gap-4 items-center">
          <div className="w-[60px] aspect-[2/3] relative rounded-lg overflow-hidden shadow-md border border-white/10 shrink-0 bg-[#101115]">
            <Image
              src={posterSrc}
              alt={movie?.title || "Movie"}
              fill
              className="object-cover"
              sizes="60px"
              priority
            />
          </div>

          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-mono font-bold tracking-wider text-[#F59E0B] uppercase">
              TICKET SUMMARY
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight truncate mt-0.5">
              {movie?.title}
            </h3>
            <p className="text-xs text-gray-400 truncate mt-0.5">
              {auditorium?.name} • Today {formatShowtime(showtime?.start_time)}
            </p>
          </div>
        </div>

        {/* Selected Seats Badges */}
        <div>
          <div className="flex items-center justify-between text-xs mb-2.5">
            <span className="text-gray-400 font-medium">Selected Seats</span>
            <span className="text-[11px] font-mono font-bold text-[#F59E0B] uppercase tracking-wider">
              {seatCount} {seatCount === 1 ? "SEAT RESERVED" : "SEATS RESERVED"}
            </span>
          </div>

          {selectedSeats.length === 0 ? (
            <div className="p-3.5 rounded-xl bg-[#121316] border border-white/5 text-gray-500 text-xs text-center">
              No seats selected yet. Click any seat on the map.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map((s) => (
                <div
                  key={s.id}
                  className="bg-[#F59E0B] text-black font-mono font-bold text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm"
                >
                  <span>{s.seat_label}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveSeat(s)}
                    className="hover:opacity-70 transition cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cost Breakdown */}
        <div className="space-y-2 pt-2 border-t border-white/5 text-xs text-gray-400">
          <div className="flex items-center justify-between">
            <span>
              Ticket Base ({seatCount} × PHP {basePrice})
            </span>
            <span className="text-gray-200 font-mono">
              PHP {seatCount * basePrice}
            </span>
          </div>

          {vipSeatsCount > 0 && (
            <div className="flex items-center justify-between text-amber-400">
              <span>VIP Surcharge ({vipSeatsCount} × PHP 100)</span>
              <span className="font-mono">+PHP {vipSeatsCount * 100}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span>Online Convenience Fee</span>
            <span className="text-emerald-400 font-mono font-semibold">FREE (WAIVED)</span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/10 text-sm">
            <span className="font-bold text-white">Total Amount</span>
            <span className="text-xl font-bold font-mono text-[#F59E0B]">
              PHP {totalAmount}
            </span>
          </div>
        </div>

        {/* Guest / Patron Contact Fields */}
        <div className="space-y-3 pt-2 border-t border-white/5">
          <div>
            <label className="block text-[11px] font-mono text-gray-400 mb-1">
              Patron Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Juan dela Cruz"
                className="w-full bg-[#121316] border border-white/10 rounded-xl px-3 py-2 pl-9 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-gray-400 mb-1">
              Notification Email (For E-Ticket PDF)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="juan@example.com"
                className="w-full bg-[#121316] border border-white/10 rounded-xl px-3 py-2 pl-9 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={selectedSeats.length === 0 || loading}
          className="w-full py-3.5 px-4 bg-[#F59E0B] hover:bg-[#e08e0a] active:scale-[0.99] text-black font-bold text-sm rounded-xl transition duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : (
            <>
              <Ticket className="w-4 h-4 stroke-[2.5]" />
              <span>Confirm Reservation ({seatCount} {seatCount === 1 ? "Ticket" : "Tickets"})</span>
            </>
          )}
        </button>

        {/* Guarantee Footer */}
        <div className="text-[11px] text-gray-500 flex items-center justify-center gap-1.5 text-center">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>Instant Confirmation • Cancel up to 30m before showtime</span>
        </div>
      </form>
    </div>
  );
}
