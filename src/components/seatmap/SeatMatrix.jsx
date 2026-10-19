"use client";

import { Check, Lock, ShieldCheck, Video } from "lucide-react";

export default function SeatMatrix({
  auditorium,
  seats,
  selectedSeats,
  heldSeats,
  reservedSeats,
  onToggleSeat,
  countdown,
}) {
  // Group seats by row
  const rowsMap = {};
  seats.forEach((seat) => {
    if (!rowsMap[seat.row]) {
      rowsMap[seat.row] = [];
    }
    rowsMap[seat.row].push(seat);
  });

  const rowLetters = Object.keys(rowsMap).sort();

  // Find max seats in any row for column headers
  let maxSeatsInRow = 10;
  rowLetters.forEach((r) => {
    if (rowsMap[r].length > maxSeatsInRow) {
      maxSeatsInRow = rowsMap[r].length;
    }
  });

  const columnNumbers = Array.from({ length: maxSeatsInRow }, (_, i) => i + 1);

  // Format countdown mm:ss
  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const selectedLabels = selectedSeats.map((s) => s.seat_label);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Real-time Hold Notice Banner */}
      <div className="w-full max-w-[700px] mb-8 bg-[#18191E] border border-amber-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-[#F59E0B]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Real-Time Seat Locks Active</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">
              {selectedLabels.length > 0 ? (
                <>
                  Seats <strong className="text-amber-400 font-mono font-bold">{selectedLabels.join(", ")}</strong> are temporarily locked for your session.
                </>
              ) : (
                "Click on any available seat to hold it for 5 minutes."
              )}
            </div>
          </div>
        </div>

        {selectedSeats.length > 0 && (
          <div className="shrink-0 bg-[#25221B] border border-amber-500/40 text-[#F59E0B] text-xs font-mono font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
            <span>Hold expires in</span>
            <span className="text-white">{formatCountdown(countdown)}</span>
          </div>
        )}
      </div>

      {/* Auditorium Screen Area with Curved Glowing Arc */}
      <div className="w-full flex flex-col items-center mb-10 select-none">
        <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-[#F59E0B] uppercase mb-2">
          AUDITORIUM SCREEN
        </span>

        {/* Projection Arc SVG */}
        <div className="w-full max-w-[500px] h-8 relative flex items-center justify-center">
          <svg
            viewBox="0 0 500 40"
            className="w-full h-full overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 35 Q 250 5 480 35"
              stroke="url(#screen_glow)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="screen_glow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D97706" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#F59E0B" stopOpacity="1" />
                <stop offset="100%" stopColor="#D97706" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500 mt-1">
          <Video className="w-3 h-3 text-gray-500" />
          <span>4K Dual Laser Projection Arc</span>
        </div>
      </div>

      {/* Seat Matrix */}
      {/* Mobile Touch Swipe Hint */}
      <div className="md:hidden flex items-center justify-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-gray-400 select-none animate-pulse">
        <span>⇄</span>
        <span>Swipe horizontally to view full seating matrix</span>
      </div>

      {/* Seat Matrix with Touch Pan */}
      <div className="w-full overflow-x-auto pb-4 flex flex-col items-center touch-pan-x scroll-smooth">
        {/* Column Number Labels with Aisle Gaps */}
        <div className="flex items-center gap-2 mb-3 pl-8 select-none">
          {columnNumbers.map((num) => {
            const hasAisle = num === 2 || num === 6 || num === maxSeatsInRow - 2;
            return (
              <div key={num} className="flex items-center">
                <div className="w-8 text-center text-[10px] font-mono font-bold text-gray-500">
                  {num}
                </div>
                {hasAisle && <div className="w-4" />}
              </div>
            );
          })}
        </div>

        {/* Rows */}
        <div className="space-y-2.5">
          {rowLetters.map((rowLetter) => {
            const rowSeats = rowsMap[rowLetter].sort((a, b) => a.number - b.number);
            const isVipRow = rowLetter === "A";

            return (
              <div key={rowLetter}>
                {isVipRow && (
                  <div className="flex items-center justify-center gap-2 my-2 select-none">
                    <span className="h-[1px] w-12 bg-amber-500/20" />
                    <span className="text-[10px] font-mono font-bold tracking-widest text-[#F59E0B] uppercase">
                      VIP RECLINERS (+PHP 100)
                    </span>
                    <span className="h-[1px] w-12 bg-amber-500/20" />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {/* Row Letter Header */}
                  <div className="w-6 text-xs font-mono font-bold text-gray-400 text-center select-none">
                    {rowLetter}
                  </div>

                  {/* Seat buttons */}
                  <div className="flex items-center gap-2">
                    {rowSeats.map((seat) => {
                      const isSelected = selectedSeats.some((s) => s.id === seat.id);
                      const isReserved = reservedSeats.includes(seat.id);
                      const isHeldByOther = heldSeats.includes(seat.id);
                      const hasAisle =
                        seat.number === 2 ||
                        seat.number === 6 ||
                        seat.number === maxSeatsInRow - 2;

                      let seatClass = "bg-[#1B1C22] border border-white/10 text-gray-300 hover:border-white/30 hover:bg-[#252730] hover:scale-105";

                      if (isSelected) {
                        seatClass = "bg-[#F59E0B] text-black shadow-lg shadow-amber-500/30 scale-105 border border-amber-400 font-bold";
                      } else if (isReserved) {
                        seatClass = "bg-[#16171B] border border-white/5 text-gray-600 opacity-40 cursor-not-allowed";
                      } else if (isHeldByOther) {
                        seatClass = "bg-[#181613] border border-amber-500/30 text-amber-500/70 opacity-60 cursor-not-allowed";
                      } else if (seat.seat_type === "vip") {
                        seatClass = "bg-[#1F1D19] border border-amber-500/30 text-amber-200 hover:border-amber-400 hover:scale-105";
                      }

                      return (
                        <div key={seat.id} className="flex items-center">
                          <button
                            type="button"
                            disabled={isHeldByOther || isReserved}
                            onClick={() => onToggleSeat(seat)}
                            title={`${seat.seat_label} (${seat.seat_type.toUpperCase()})`}
                            className={`w-8 h-8 rounded-lg text-[10px] font-bold font-mono transition-all duration-150 flex items-center justify-center cursor-pointer ${seatClass}`}
                          >
                            {isSelected ? (
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            ) : isReserved || isHeldByOther ? (
                              <Lock className="w-3 h-3 text-gray-500" />
                            ) : (
                              <span>{seat.seat_label}</span>
                            )}
                          </button>
                          {hasAisle && <div className="w-4" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-white/5 text-xs text-gray-400 select-none">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#1B1C22] border border-white/10" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#1F1D19] border border-amber-500/40" />
          <span>VIP Recliner (+PHP 100)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#F59E0B] border border-amber-400" />
          <span className="text-amber-400 font-bold">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#181613] border border-amber-500/30 opacity-60" />
          <span>Held by Others</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#16171B] border border-white/5 opacity-40" />
          <span>Reserved</span>
        </div>
      </div>
    </div>
  );
}
