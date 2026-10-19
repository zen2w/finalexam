"use client";

import { useState, useEffect } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import ReservationLookupCard from "@/components/reservation/ReservationLookupCard";
import LatestReservationCard from "@/components/reservation/LatestReservationCard";
import CancelReservationModal from "@/components/reservation/CancelReservationModal";

export default function FindReservationClient() {
  const [activeReservation, setActiveReservation] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // Initial load: Fetch user session and latest reservations if authenticated
  useEffect(() => {
    async function loadUserReservations() {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user || null;
        setUser(currentUser);

        if (currentUser) {
          const { data: bookings, error: bErr } = await supabase
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
            .eq("user_id", currentUser.id)
            .order("created_at", { ascending: false });

          if (!bErr && bookings && bookings.length > 0) {
            setUserBookings(bookings);
            setActiveReservation(bookings[0]);
          }
        }
      } catch (err) {
        console.error("[FindReservationClient] Error:", err);
      } finally {
        setInitialLoading(false);
      }
    }

    loadUserReservations();
  }, []);

  // Lookup reservation by reference code
  const handleSearch = async (rawQuery) => {
    setError("");
    const cleanRef = rawQuery.replace(/^#/, "").trim();

    if (!cleanRef) return;

    setLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error: sErr } = await supabase
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
        .ilike("reference_code", cleanRef)
        .single();

      if (sErr || !data) {
        setError(`No reservation found matching reference #${cleanRef}.`);
        return;
      }

      setActiveReservation(data);
    } catch (err) {
      console.error("[Search] Error:", err);
      setError("An error occurred while finding the reservation.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCancel = () => {
    if (activeReservation) {
      setActiveReservation((prev) => ({
        ...prev,
        status: "cancelled",
      }));
      setUserBookings((prev) =>
        prev.map((b) =>
          b.id === activeReservation.id ? { ...b, status: "cancelled" } : b
        )
      );
    }
  };

  return (
    <div className="w-full flex-1 bg-[#0D0E12] min-h-[calc(100vh-64px)] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1300px] mx-auto space-y-8">
        {/* Header Title matching MovieSeat-FindReservation.png */}
        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Find Your Movie Reservation
          </h1>
          <p className="text-sm text-gray-400">
            Enter your reservation reference number and email address to view your ticket and seat assignments.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs">
            {error}
          </div>
        )}

        {/* 2-Column Grid: Left Search Query (approx 38%) & Right Latest Reservation (approx 62%) */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:w-[38%] shrink-0">
            <ReservationLookupCard
              onSearch={handleSearch}
              loading={loading}
              initialRef={activeReservation?.reference_code || ""}
              userBookings={userBookings}
              onSelectBooking={(b) => setActiveReservation(b)}
              activeRef={activeReservation?.reference_code}
            />
          </div>

          <div className="flex-1 w-full">
            {initialLoading ? (
              <div className="w-full bg-[#18191E] border border-[#2B2C33] rounded-[24px] p-12 flex flex-col items-center justify-center space-y-3">
                <div className="w-8 h-8 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
                <span className="text-xs font-mono uppercase tracking-widest text-gray-500">
                  Retrieving reservation records...
                </span>
              </div>
            ) : (
              <LatestReservationCard
                reservation={activeReservation}
                onOpenCancelModal={() => setIsCancelModalOpen(true)}
                user={user}
              />
            )}
          </div>
        </div>
      </div>

      {/* Cancel Reservation Modal */}
      <CancelReservationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        reservation={activeReservation}
        onConfirmCancel={handleConfirmCancel}
      />
    </div>
  );
}
