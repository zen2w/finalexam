import { Suspense } from "react";
﻿import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Sign In to MovieSeat | MovieSeat Cinemas",
  description: "Enter your registered credentials to access your booked seats and profile.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark bg-[#0D0E12]">
      <body className="bg-[#0D0E12] text-white antialiased min-h-screen flex flex-col justify-between selection:bg-amber-500 selection:text-black">
        <Suspense fallback={<header className="h-16 bg-[#0D0E12]" />}><Header /></Suspense>
        <main className="flex-1 flex flex-col items-center justify-center relative bg-[#0D0E12]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
