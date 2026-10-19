"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { formatShowtime, formatShowDate } from "@/lib/time";

export default function CancelReservationModal({
  isOpen,
  onClose,
  reservation,
  onConfirmCancel,
}) {
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !reservation) return null;

  const showtime = reservation.showtime;
  const movie = showtime?.movie;
  const refCode = reservation.reference_code;

  const handleCancel = async () => {
    setCancelling(true);
    setError("");

    try {
      const res = await fetch(`/api/reservations/${reservation.id}/cancel`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || "Failed to cancel reservation.");
      }

      onConfirmCancel();
      onClose();
    } catch (err) {
      console.error("[CancelModal] Error:", err);
      setError(err.message || "Failed to cancel reservation.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#18191E] border border-red-500/30 rounded-[24px] p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 shadow-lg shadow-red-500/10 flex items-center justify-center text-red-400 mx-auto mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-bold text-white text-center tracking-tight mb-2">
          Cancel This Reservation?
        </h3>

        <div className="bg-[#121316] border border-white/5 rounded-xl p-4 my-4 space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">Movie</span>
            <strong className="text-white truncate">{movie?.title}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Reference</span>
            <span className="text-amber-400 font-mono font-bold">{refCode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Showtime</span>
            <span className="text-gray-300">
              {formatShowDate(showtime?.start_time)} • {formatShowtime(showtime?.start_time)}
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center leading-relaxed mb-6">
          <strong className="text-amber-400">Notice:</strong> Cancellations must be made at least <strong>30 minutes</strong> before showtime. Once confirmed, your seats will be released immediately for other moviegoers.
        </p>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={cancelling}
            className="w-full bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-bold text-sm py-3 px-4 rounded-xl transition duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg shadow-red-600/20"
          >
            {cancelling ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>Yes, Cancel Reservation</span>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full bg-[#24252D] hover:bg-[#2C2E38] text-gray-300 font-medium text-xs sm:text-sm py-3 px-4 rounded-xl transition duration-150 border border-white/10"
          >
            Keep Reservation
          </button>
        </div>
      </div>
    </div>
  );
}
