import { Suspense, use } from "react";
import TicketClient from "./TicketClient";

export const metadata = {
  title: "Digital Reservation Ticket | MovieSeat Cinemas",
  description: "View and print your digital cinema pass and turnstile barcode.",
};

function TicketWrapper({ paramsPromise }) {
  const params = use(paramsPromise);
  return <TicketClient reference={params?.reference} />;
}

export default function TicketPage({ params }) {
  return (
    <Suspense
      fallback={
        <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-[#0D0E12] text-[#F59E0B] space-y-4">
          <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
          <span className="text-xs font-mono uppercase tracking-widest text-gray-400">
            Rendering E-Ticket Pass...
          </span>
        </div>
      }
    >
      <TicketWrapper paramsPromise={params} />
    </Suspense>
  );
}
