"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import TicketCard from "@/components/ticket/TicketCard";

export default function TicketClient({ reference }) {
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReservation() {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data, error: err } = await supabase
          .from("reservations")
          .select(`
            id,
            reference_code,
            user_id,
            total_amount,
            status,
            customer_name,
            customer_email,
            created_at,
            showtime:showtimes (
              id,
              start_time,
              end_time,
              price,
              movie:movies (*),
              auditorium:auditoriums (*)
            ),
            reservation_seats (
              id,
              price,
              status,
              seat:seats (*)
            )
          `)
          .eq("reference_code", reference)
          .single();

        if (err || !data) {
          throw new Error("Reservation not found for reference code: " + reference);
        }

        setReservation(data);
      } catch (e) {
        console.error("[TicketClient] Load error:", e);
        setError(e.message || "Unable to load reservation ticket.");
      } finally {
        setLoading(false);
      }
    }

    if (reference) {
      loadReservation();
    }
  }, [reference]);

  if (loading) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-[#0D0E12] text-[#F59E0B] space-y-4">
        <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
        <span className="text-xs font-mono uppercase tracking-widest text-gray-400">
          Loading Digital Reservation Ticket...
        </span>
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-[#0D0E12] px-4">
        <div className="w-full max-w-md bg-[#18191E] border border-red-500/30 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <h2 className="text-lg font-bold text-red-400">Reservation Not Found</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            {error || "Could not retrieve the reservation. Please check your reference code."}
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Link
              href="/find-reservation"
              className="bg-[#252730] hover:bg-[#2C2E38] text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition"
            >
              Lookup Reservation
            </Link>
            <Link
              href="/"
              className="bg-[#F59E0B] hover:bg-[#E58E00] text-black text-xs font-bold py-2.5 px-4 rounded-xl transition"
            >
              Back to Movies
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 bg-[#0D0E12] min-h-[calc(100vh-64px)] py-10 px-4 sm:px-6 lg:px-8">
      <TicketCard reservation={reservation} />
    </div>
  );
}
