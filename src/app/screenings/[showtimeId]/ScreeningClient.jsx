"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Ticket } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { formatShowtime, formatShowDate } from "@/lib/time";
import SeatMatrix from "@/components/seatmap/SeatMatrix";
import TicketSummarySidebar from "@/components/seatmap/TicketSummarySidebar";
import GuestAuthModal from "@/components/seatmap/GuestAuthModal";

export default function ScreeningClient({ showtimeId }) {
  const router = useRouter();

  const [showtime, setShowtime] = useState(null);
  const [movie, setMovie] = useState(null);
  const [auditorium, setAuditorium] = useState(null);
  const [seats, setSeats] = useState([]);

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [heldSeats, setHeldSeats] = useState([]);
  const [reservedSeats, setReservedSeats] = useState([]);

  const [user, setUser] = useState(null);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);

  const [countdown, setCountdown] = useState(300);
  const [expiresAt, setExpiresAt] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Load session & showtime details
  const loadScreeningData = async () => {
    try {
      const supabase = getSupabaseBrowserClient();

      // Check auth user
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const currentUser = session?.user || null;
      setUser(currentUser);

      // Fetch showtime details
      const { data: st, error: stErr } = await supabase
        .from("showtimes")
        .select(`
          id,
          start_time,
          end_time,
          price,
          movie:movies (*),
          auditorium:auditoriums (*)
        `)
        .eq("id", showtimeId)
        .single();

      if (stErr || !st) throw new Error("Showtime not found");

      setShowtime(st);
      setMovie(st.movie);
      setAuditorium(st.auditorium);

      // Fetch physical seats for this auditorium
      const { data: allSeats } = await supabase
        .from("seats")
        .select("*")
        .eq("auditorium_id", st.auditorium.id)
        .order("row", { ascending: true })
        .order("number", { ascending: true });

      setSeats(allSeats || []);

      // Fetch active holds
      const { data: holds } = await supabase
        .from("seat_holds")
        .select("*")
        .eq("showtime_id", showtimeId)
        .gt("expires_at", new Date().toISOString());

      // Separate my holds vs other holds
      const myHeldSeatIds = [];
      const othersHeldSeatIds = [];

      (holds || []).forEach((h) => {
        if (currentUser && h.user_id === currentUser.id) {
          myHeldSeatIds.push(h.seat_id);
          if (!expiresAt) {
            setExpiresAt(h.expires_at);
            const remaining = Math.max(
              0,
              Math.floor((new Date(h.expires_at) - Date.now()) / 1000)
            );
            setCountdown(remaining);
          }
        } else {
          othersHeldSeatIds.push(h.seat_id);
        }
      });

      setHeldSeats(othersHeldSeatIds);

      // If user had existing holds, restore them to selectedSeats
      if (myHeldSeatIds.length > 0 && allSeats) {
        setSelectedSeats(allSeats.filter((s) => myHeldSeatIds.includes(s.id)));
      }

      // Fetch confirmed reservation seats
      const { data: reservations } = await supabase
        .from("reservation_seats")
        .select("seat_id")
        .eq("showtime_id", showtimeId)
        .eq("status", "reserved");

      setReservedSeats((reservations || []).map((r) => r.seat_id));
    } catch (err) {
      console.error("[ScreeningPage] Load error:", err);
      setError(err.message || "Failed to load screening");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScreeningData();

    // Setup Supabase Realtime subscription
    const supabase = getSupabaseBrowserClient();
    const channel = supabase
      .channel(`screening-${showtimeId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "seat_holds",
          filter: `showtime_id=eq.${showtimeId}`,
        },
        () => {
          loadScreeningData();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reservation_seats",
          filter: `showtime_id=eq.${showtimeId}`,
        },
        () => {
          loadScreeningData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [showtimeId]);

  // Hold Countdown Timer Effect
  useEffect(() => {
    if (selectedSeats.length === 0) {
      setCountdown(300);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Release client selection when expired
          setSelectedSeats([]);
          setError("Your 5-minute seat hold has expired. Please select again.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedSeats.length]);

  // Handle seat selection toggle
  const handleToggleSeat = async (seat) => {
    setError("");

    // If guest, show auth modal explaining hold security
    if (!user) {
      setIsGuestModalOpen(true);
      return;
    }

    const isAlreadySelected = selectedSeats.some((s) => s.id === seat.id);
    let nextSelected;

    if (isAlreadySelected) {
      nextSelected = selectedSeats.filter((s) => s.id !== seat.id);
    } else {
      if (selectedSeats.length >= 6) {
        setError("Maximum selection limit reached (6 seats per transaction).");
        return;
      }
      nextSelected = [...selectedSeats, seat];
    }

    setSelectedSeats(nextSelected);

    // Call /api/holds to acquire or update server-side lock
    try {
      const res = await fetch("/api/holds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          showtimeId,
          seatIds: nextSelected.map((s) => s.id),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Rollback state if hold rejected (e.g. race condition)
        setSelectedSeats(selectedSeats);
        setError(data.message || data.error || "Failed to reserve seat hold.");
        return;
      }

      if (data.expires_at) {
        setExpiresAt(data.expires_at);
        setCountdown(300);
      }
    } catch (err) {
      console.error("[Hold Seats] Error:", err);
      setError("Network error locking seats. Please try again.");
    }
  };

  // Remove individual seat chip
  const handleRemoveSeat = (seat) => {
    handleToggleSeat(seat);
  };

  // Confirm Reservation Submission
  const handleConfirmReservation = async ({ customerName, customerEmail }) => {
    if (!user) {
      setIsGuestModalOpen(true);
      return;
    }

    if (selectedSeats.length === 0) {
      setError("Please select at least 1 seat to confirm.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/reservations/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          showtimeId,
          seatIds: selectedSeats.map((s) => s.id),
          customerName,
          customerEmail,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to confirm reservation.");
      }

      // Success! Route to reservation ticket page
      router.push(`/ticket/${data.reference_code}`);
    } catch (err) {
      console.error("[Confirm Reservation] Error:", err);
      setError(err.message || "Failed to confirm reservation.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex-1 flex items-center justify-center min-h-[calc(100vh-64px)] bg-[#0D0E12] text-[#F59E0B]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-gray-400">Loading Screening Matrix...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 bg-[#0D0E12] min-h-[calc(100vh-64px)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Breadcrumb Header matching MovieSear-ReservationForm.png */}
        <div className="w-full bg-[#18191E] border border-white/5 rounded-2xl px-6 py-3.5 flex items-center gap-2.5 text-xs flex-wrap shadow-md">
          <Ticket className="w-4 h-4 text-[#F59E0B] shrink-0" />
          <Link href="/" className="text-[#F59E0B] font-bold hover:underline">
            {movie?.title}
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-gray-300">
            Today, {formatShowDate(showtime?.start_time)} • {formatShowtime(showtime?.start_time)}
          </span>
          <span className="text-gray-600">•</span>
          <span className="text-blue-400 font-mono font-bold uppercase tracking-wider">
            {auditorium?.name}
          </span>
          <span className="text-gray-600">•</span>
          <span className="text-[#F59E0B] font-mono font-bold">
            PHP {showtime?.price} / seat
          </span>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs shadow-md">
            {error}
          </div>
        )}

        {/* Main Grid: Left Seat Map (8 cols) & Right Ticket Summary (4 cols) */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Seat Map Viewport */}
          <div className="flex-1 w-full bg-[#15161B] border border-[#2B2C33] rounded-[28px] p-6 sm:p-10 shadow-2xl relative">
            <SeatMatrix
              auditorium={auditorium}
              seats={seats}
              selectedSeats={selectedSeats}
              heldSeats={heldSeats}
              reservedSeats={reservedSeats}
              onToggleSeat={handleToggleSeat}
              countdown={countdown}
            />
          </div>

          {/* Ticket Summary Sidebar */}
          <div id="ticket-summary-sidebar" className="w-full lg:w-auto">
          <TicketSummarySidebar
            movie={movie}
            showtime={showtime}
            auditorium={auditorium}
            selectedSeats={selectedSeats}
            onRemoveSeat={handleRemoveSeat}
            user={user}
            onConfirmReservation={handleConfirmReservation}
            loading={submitting}
            error={error}
          />
          </div>
        </div>
      </div>


      {/* Sticky Mobile Summary Bar (Phase 8 Mobile Polish) */}
      {selectedSeats.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#121316]/95 backdrop-blur-md border-t border-amber-500/30 p-3 sm:p-4 lg:hidden shadow-2xl flex items-center justify-between animate-fade-in">
          <div>
            <span className="text-[10px] font-mono font-bold text-gray-400 block uppercase tracking-wider">
              {selectedSeats.length} {selectedSeats.length === 1 ? "SEAT" : "SEATS"} LOCKED ({selectedSeats.map(s => s.seat_label).join(", ")})
            </span>
            <span className="text-xl font-extrabold text-[#F59E0B] font-mono tracking-tight">
              ₱{selectedSeats.reduce((sum, s) => sum + (s.seat_type === "vip" ? Number(showtime?.price || 0) + 100 : Number(showtime?.price || 0)), 0)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("ticket-summary-sidebar");
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="bg-[#F59E0B] hover:bg-[#E58E00] active:scale-[0.98] text-black font-bold text-xs sm:text-sm py-2.5 px-5 rounded-xl shadow-lg shadow-amber-500/25 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Proceed to Book</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* Guest Authentication Modal */}
      <GuestAuthModal
        isOpen={isGuestModalOpen}
        onClose={() => setIsGuestModalOpen(false)}
        showtimeId={showtimeId}
      />
    </div>
  );
}
