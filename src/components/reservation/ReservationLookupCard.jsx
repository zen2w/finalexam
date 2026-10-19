"use client";

import { useState } from "react";
import { Search, Receipt } from "lucide-react";

export default function ReservationLookupCard({
  onSearch,
  loading,
  initialRef = "",
  userBookings = [],
  onSelectBooking,
  activeRef = "",
}) {
  const [refInput, setRefInput] = useState(initialRef);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!refInput.trim()) return;
    onSearch(refInput.trim());
  };

  return (
    <div className="w-full bg-[#18191E] border border-[#2B2C33] rounded-[24px] p-6 sm:p-8 shadow-2xl space-y-6">
      {/* Header matching MovieSeat-FindReservation.png */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#F59E0B]">
            <Receipt className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Search Query
          </h2>
        </div>
        <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">
          FAST LOOKUP
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-gray-400 mb-2">
            Reference Number
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-sm pointer-events-none">
              #
            </span>
            <input
              type="text"
              required
              value={refInput}
              onChange={(e) => setRefInput(e.target.value)}
              placeholder="MS-2024-89412"
              className="w-full bg-[#111215] border border-white/10 rounded-xl px-4 py-3 pl-8 text-sm text-white font-mono placeholder-gray-600 focus:outline-none focus:border-amber-500 transition shadow-inner"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !refInput.trim()}
          className="w-full bg-[#F59E0B] hover:bg-[#E58E00] active:scale-[0.99] text-black font-bold text-sm py-3.5 px-4 rounded-xl transition duration-150 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : (
            <Search className="w-4 h-4 stroke-[2.5]" />
          )}
          <span>Lookup Reservation</span>
        </button>
      </form>

      {/* Multiple user bookings quick switcher if user is signed in */}
      {userBookings && userBookings.length > 1 && (
        <div className="pt-4 border-t border-white/5 space-y-2">
          <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider">
            YOUR RECENT BOOKINGS ({userBookings.length})
          </span>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {userBookings.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => {
                  setRefInput(b.reference_code);
                  onSelectBooking(b);
                }}
                className={`w-full text-left p-2.5 rounded-xl border text-xs transition flex items-center justify-between cursor-pointer ${
                  activeRef === b.reference_code
                    ? "bg-[#25221B] border-amber-500/40 text-amber-300"
                    : "bg-[#121316] border-white/5 text-gray-400 hover:text-white hover:border-white/20"
                }`}
              >
                <div className="min-w-0 flex-1 pr-2 truncate">
                  <span className="font-mono font-bold text-white block truncate">
                    {b.showtime?.movie?.title}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">
                    {b.reference_code}
                  </span>
                </div>
                <span
                  className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                    b.status === "cancelled"
                      ? "text-red-400 bg-red-500/10"
                      : "text-emerald-400 bg-emerald-500/10"
                  }`}
                >
                  {b.status}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
