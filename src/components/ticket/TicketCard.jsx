"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  Printer, 
  Search, 
  Film, 
  Info, 
  Ticket as TicketIcon
} from "lucide-react";
import { formatShowtime, formatShowDate } from "@/lib/time";
import { getTmdbImageUrl } from "@/lib/tmdb";

export default function TicketCard({ reservation }) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const showtime = reservation.showtime;
  const movie = showtime?.movie;
  const auditorium = showtime?.auditorium;
  const seats = reservation.reservation_seats?.map((rs) => rs.seat) || [];

  const posterSrc = getTmdbImageUrl(movie?.poster_path, "w500");
  const refCode = reservation.reference_code || "MS-2026-000000";

  // Split seats by type
  const vipCount = seats.filter((s) => s.seat_type === "vip").length;
  const stdCount = seats.length - vipCount;
  let seatTypeLabel = "";
  if (vipCount > 0 && stdCount > 0) {
    seatTypeLabel = `(${vipCount} VIP, ${stdCount} Standard)`;
  } else if (vipCount > 0) {
    seatTypeLabel = `(${vipCount} VIP Recliner)`;
  } else {
    seatTypeLabel = `(${stdCount} Standard)`;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(refCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = () => {
    setDownloading(true);
    const pdfUrl = `/api/reservations/${reservation.id}/pdf`;
    window.open(pdfUrl, "_blank");
    setTimeout(() => setDownloading(false), 1500);
  };

  // Generate deterministic barcode lines from reference code
  const barcodePattern = [2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 1, 3, 1, 2, 3, 1, 2, 4, 1, 2, 1];

  return (
    <div className="w-full max-w-[1050px] mx-auto space-y-6">
      {/* Top Banner: Reservation Confirmed! */}
      <div className="w-full bg-[#18191E] border border-white/5 rounded-2xl px-6 py-4 flex items-center gap-3.5 shadow-lg">
        <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-[#F59E0B] shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Reservation Confirmed!
        </h2>
      </div>

      {/* Main Perforated Ticket Card matching MovieSeat-ReservationTicket.png */}
      <div className="relative w-full bg-[#18191E] border border-[#2B2C33] rounded-[24px] shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Semi-circular perforation cutouts on top and bottom along the divider */}
        <div className="hidden lg:block absolute -top-4 left-[64%] -translate-x-1/2 w-8 h-8 rounded-full bg-[#0D0E12] border-b border-[#2B2C33] z-20" />
        <div className="hidden lg:block absolute -bottom-4 left-[64%] -translate-x-1/2 w-8 h-8 rounded-full bg-[#0D0E12] border-t border-[#2B2C33] z-20" />

        {/* LEFT SECTION: Main Admission Pass (approx 64% width) */}
        <div className="flex-1 p-6 sm:p-8 lg:p-9 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-dashed border-[#2B2C33] relative">
          <div>
            {/* Pass Badges Row */}
            <div className="flex flex-wrap items-center gap-2.5 mb-6">
              <span className="bg-[#121316] border border-white/10 text-amber-400 font-mono font-bold text-[10px] tracking-wider px-3 py-1 rounded-lg uppercase">
                PASS TYPE: RESERVED ADMISSION
              </span>
              <span className="bg-[#121316] text-gray-300 font-mono text-[10px] tracking-wider px-3 py-1 rounded-lg uppercase">
                SCREENING {auditorium?.name?.toUpperCase() || "HALL 1"}
              </span>
              <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-[10px] tracking-wider px-2.5 py-1 rounded-lg flex items-center gap-1.5 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ACTIVE
              </span>
            </div>

            {/* Poster & Movie Details Grid */}
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Poster thumbnail with 4K badge */}
              <div className="w-[120px] aspect-[2/3] relative rounded-xl overflow-hidden shadow-2xl border border-white/10 shrink-0 bg-[#121316]">
                <Image
                  src={posterSrc}
                  alt={movie?.title || "Movie Poster"}
                  fill
                  className="object-cover"
                  sizes="120px"
                  priority
                />
                <div className="absolute bottom-1.5 right-1.5 bg-black/80 backdrop-blur-sm border border-white/20 text-white font-mono font-bold text-[9px] px-1.5 py-0.5 rounded">
                  4K
                </div>
              </div>

              {/* Title & Specs */}
              <div className="min-w-0 flex-1 space-y-2">
                <div className="text-[11px] font-mono font-bold tracking-wider text-gray-400 uppercase">
                  PG-13 • 166 MIN • <span className="text-[#F59E0B]">DOLBY ATMOS</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  {movie?.title}
                </h1>
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                  {movie?.overview || "Experience cinema entertainment with immersive spatial audio and 4K dual laser projection."}
                </p>

                {/* Auditorium & Showtime 2-Column Info */}
                <div className="grid grid-cols-2 gap-4 pt-3 mt-2 border-t border-white/5">
                  <div>
                    <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                      AUDITORIUM & SOUND
                    </span>
                    <strong className="block text-xs font-bold text-gray-200 mt-0.5">
                      {auditorium?.name || "Cinema Room 1"}
                    </strong>
                    <span className="block text-[11px] text-gray-400">
                      Dolby Atmos 4K Laser
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                      SHOWTIME
                    </span>
                    <strong className="block text-xs font-bold text-gray-200 mt-0.5">
                      {formatShowDate(showtime?.start_time)}
                    </strong>
                    <span className="block text-[11px] text-[#F59E0B] font-mono font-bold">
                      {formatShowtime(showtime?.start_time)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Strip: Ticket Holder, Allocated Seats, Total Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 mt-6 border-t border-white/5">
            <div>
              <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                TICKET HOLDER
              </span>
              <strong className="block text-sm font-bold text-white truncate mt-0.5">
                {reservation.customer_name || "MovieSeat Patron"}
              </strong>
              <span className="block text-xs text-gray-400 truncate">
                {reservation.customer_email || "patron@example.com"}
              </span>
            </div>

            <div>
              <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1">
                ALLOCATED SEATS
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {seats.map((s) => (
                  <span
                    key={s.id}
                    className="bg-[#F59E0B] text-black font-mono font-bold text-xs px-2.5 py-0.5 rounded shadow-sm"
                  >
                    {s.seat_label}
                  </span>
                ))}
                <span className="text-[11px] text-gray-400 font-mono ml-1">
                  {seatTypeLabel}
                </span>
              </div>
            </div>

            <div>
              <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                TOTAL AMOUNT
              </span>
              <div className="mt-0.5">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#F59E0B] tracking-tight block">
                  ₱{Number(reservation.total_amount).toFixed(0)}
                </span>
                <span className="text-[10px] text-gray-400 font-mono block mt-0.5">
                  Simulated Paid
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION: Tear-Off Verification Stub (approx 36% width) */}
        <div className="w-full lg:w-[36%] bg-[#15161B] p-6 sm:p-8 flex flex-col justify-between items-center text-center relative select-none">
          <div className="w-full space-y-6">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-gray-400 uppercase">
              PASS VERIFICATION
            </span>

            {/* Reference Code Box */}
            <div className="w-full bg-[#111215] border border-white/10 rounded-2xl p-4 relative group">
              <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1">
                REFERENCE CODE
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl sm:text-2xl font-mono font-bold text-[#F59E0B] tracking-wider">
                  {refCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  title="Copy Reference Code"
                  className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              {copied && (
                <div className="text-[10px] text-emerald-400 font-mono mt-1 animate-fade-in">
                  Copied to clipboard!
                </div>
              )}
            </div>

            {/* Simulated Barcode Container */}
            <div className="w-full bg-[#111215] border border-white/10 rounded-2xl p-4 flex flex-col items-center">
              <div className="w-full flex items-center justify-center gap-[2px] h-14 px-2 overflow-hidden">
                {barcodePattern.map((width, idx) => (
                  <div
                    key={idx}
                    className="h-full bg-white/90"
                    style={{ width: `${width * 2}px` }}
                  />
                ))}
              </div>
              <span className="text-[11px] font-mono text-gray-400 tracking-[0.3em] mt-2">
                {refCode.replace(/[^0-9]/g, "").padEnd(12, "0").split("").join(" ")}
              </span>
              <span className="text-[9px] font-mono tracking-widest text-gray-500 uppercase mt-1">
                SCAN AT TURNSTILE
              </span>
            </div>
          </div>

          {/* Hall Gate Note */}
          <div className="pt-6 text-[11px] font-mono text-gray-400 flex items-center justify-center gap-1.5">
            <TicketIcon className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Valid for {auditorium?.name || "Cinema 1"} Gate Only</span>
          </div>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={downloading}
          className="w-full sm:w-auto bg-[#F59E0B] hover:bg-[#E58E00] active:scale-[0.99] text-black font-bold text-sm py-3 px-6 rounded-xl transition duration-150 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
        >
          {downloading ? (
            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : (
            <Printer className="w-4 h-4" />
          )}
          <span>Print / Save Ticket (PDF)</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/find-reservation"
            className="flex-1 sm:flex-initial bg-[#18191E] hover:bg-[#23242B] border border-white/10 text-white font-medium text-xs sm:text-sm py-3 px-5 rounded-xl transition duration-150 flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4 text-gray-400" />
            <span>Lookup Anytime</span>
          </Link>

          <Link
            href="/"
            className="flex-1 sm:flex-initial bg-[#18191E] hover:bg-[#23242B] border border-white/10 text-white font-medium text-xs sm:text-sm py-3 px-5 rounded-xl transition duration-150 flex items-center justify-center gap-2"
          >
            <Film className="w-4 h-4 text-[#F59E0B]" />
            <span>Book Another Movie</span>
          </Link>
        </div>
      </div>

      {/* Entrance & Concession Guidelines Card */}
      <div className="w-full bg-[#18191E] border border-white/5 rounded-2xl p-6 sm:p-7 shadow-lg flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#F59E0B] shrink-0 mt-0.5">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-white tracking-tight">
            Entrance & Concession Guidelines
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Present your reference code <strong className="text-amber-400 font-mono font-bold">{refCode}</strong> or show this digital barcode directly at the {auditorium?.name || "Cinema 1"} entrance turnstile or express concessions counter. Concession pick-up opens 30 minutes prior to screening.
          </p>
        </div>
      </div>
    </div>
  );
}
