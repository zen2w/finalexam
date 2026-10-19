import { Suspense } from "react";
import FindReservationClient from "./FindReservationClient";

export const metadata = {
  title: "Find Your Movie Reservation | MovieSeat Cinemas",
  description: "Search and inspect your booked cinema seats, admission passes, and digital turnstile barcodes.",
};

export default function FindReservationPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-[#0D0E12] text-[#F59E0B] space-y-4">
          <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
          <span className="text-xs font-mono uppercase tracking-widest text-gray-400">
            Loading Reservation Portal...
          </span>
        </div>
      }
    >
      <FindReservationClient />
    </Suspense>
  );
}
