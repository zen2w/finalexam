import { Suspense, use } from "react";
import ScreeningClient from "./ScreeningClient";

function ScreeningWrapper({ paramsPromise }) {
  const params = use(paramsPromise);
  return <ScreeningClient showtimeId={params?.showtimeId} />;
}

export default function ScreeningPage({ params }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#07080B] flex flex-col items-center justify-center text-white/50 space-y-4">
          <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
          <p className="text-xs uppercase tracking-widest text-white/60">Loading Cinema Auditorium & Seat Map...</p>
        </div>
      }
    >
      <ScreeningWrapper paramsPromise={params} />
    </Suspense>
  );
}
