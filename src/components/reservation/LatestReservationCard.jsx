"use client";

import Image from "next/image";
import Link from "next/link";
import { Printer, ExternalLink, Ban } from "lucide-react";
import { formatShowtime, formatShowDate } from "@/lib/time";
import { getTmdbImageUrl } from "@/lib/tmdb";

export default function LatestReservationCard({
  reservation,
  onOpenCancelModal,
  user,
}) {
  if (!reservation) {
    return (
      <div className="w-full bg-[#18191E] border border-[#2B2C33] rounded-[24px] p-8 sm:p-12 text-center shadow-xl space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 mx-auto">
          <Printer className="w-8 h-8 opacity-40" />
        </div>
        <h3 className="text-lg font-bold text-white">No Reservation Selected</h3>
        <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
          Enter your reservation reference code on the left to inspect your booked seats, turnstile barcode, and admission pass.
        </p>
      </div>
    );
  }

  const showtime = reservation.showtime;
  const movie = showtime?.movie;
  const auditorium = showtime?.auditorium;
  const seats = reservation.reservation_seats?.map((rs) => rs.seat) || [];

  const posterSrc = getTmdbImageUrl(movie?.poster_path, "w500");
  const refCode = reservation.reference_code || "MS-2026-000000";
  const isCancelled = reservation.status === "cancelled";

  // Check 30-minute policy window
  const startTime = new Date(showtime?.start_time).getTime();
  const canCancel =
    !isCancelled &&
    user &&
    reservation.user_id === user.id &&
    startTime - Date.now() > 30 * 60 * 1000;

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

  const handleDownloadPdf = () => {
    window.open(`/api/reservations/${reservation.id}/pdf`, "_blank");
  };

  return (
    <div className="w-full bg-[#18191E] border border-[#2B2C33] rounded-[24px] p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
      <div className="space-y-6">
        {/* Card Title matching MovieSeat-FindReservation.png */}
        <h2 className="text-xl font-bold text-white tracking-tight">
          Your Latest Reservation
        </h2>

        {/* Pass Badges Row */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="bg-[#121316] border border-white/10 text-amber-400 font-mono font-bold text-[10px] tracking-wider px-3 py-1 rounded-lg uppercase">
            PASS TYPE: RESERVED ADMISSION
          </span>
          <span className="bg-[#121316] text-gray-300 font-mono text-[10px] tracking-wider px-3 py-1 rounded-lg uppercase">
            SCREENING {auditorium?.name?.toUpperCase() || "HALL 1"}
          </span>
          {isCancelled ? (
            <span className="bg-red-500/10 border border-red-500/30 text-red-400 font-mono font-bold text-[10px] tracking-wider px-2.5 py-1 rounded-lg flex items-center gap-1.5 uppercase">
              ● CANCELLED
            </span>
          ) : (
            <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-[10px] tracking-wider px-2.5 py-1 rounded-lg flex items-center gap-1.5 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ACTIVE
            </span>
          )}
        </div>

        {/* Poster & Movie Details Grid */}
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Poster thumbnail with 4K badge */}
          <div className="w-[110px] sm:w-[125px] aspect-[2/3] relative rounded-xl overflow-hidden shadow-2xl border border-white/10 shrink-0 bg-[#121316]">
            <Image
              src={posterSrc}
              alt={movie?.title || "Movie Poster"}
              fill
              className="object-cover"
              sizes="125px"
              priority
            />
            <div className="absolute bottom-1.5 right-1.5 bg-black/80 backdrop-blur-sm border border-white/20 text-white font-mono font-bold text-[9px] px-1.5 py-0.5 rounded">
              4K
            </div>
          </div>

          {/* Title & Info */}
          <div className="min-w-0 flex-1 space-y-2">
            <div className="text-[11px] font-mono font-bold tracking-wider text-gray-400 uppercase">
              PG-13 • 166 MIN • <span className="text-[#F59E0B]">DOLBY ATMOS</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white tracking-tight leading-tight">
              {movie?.title}
            </h3>
            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
              {movie?.overview || "Experience cinema entertainment with spatial audio and 4K laser projection."}
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

        {/* Bottom Strip: Ticket Holder, Allocated Seats, Total Amount */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/5">
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

      {/* Action Buttons matching MovieSeat-FindReservation.png */}
      <div className="space-y-3 pt-6 mt-6 border-t border-white/5">
        <button
          type="button"
          onClick={handleDownloadPdf}
          className="w-full bg-[#F59E0B] hover:bg-[#E58E00] active:scale-[0.99] text-black font-bold text-sm py-3.5 px-4 rounded-xl transition duration-150 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save Ticket (PDF)</span>
        </button>

        <div className="flex items-center justify-between text-xs pt-1">
          <Link
            href={`/ticket/${refCode}`}
            className="text-gray-400 hover:text-white transition flex items-center gap-1.5"
          >
            <span>View Full Digital Ticket Pass</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {canCancel && (
            <button
              type="button"
              onClick={onOpenCancelModal}
              className="text-red-400 hover:text-red-300 transition flex items-center gap-1 cursor-pointer font-medium"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Cancel Reservation</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
