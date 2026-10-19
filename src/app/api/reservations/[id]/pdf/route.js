import { NextResponse } from "next/server";
import React from "react";
import { pdf } from "@react-pdf/renderer";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import TicketPdfDocument from "@/components/ticket/TicketPdfDocument";

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const reservationId = resolvedParams.id;

    if (!reservationId) {
      return NextResponse.json({ error: "Reservation ID is required" }, { status: 400 });
    }

    const admin = getSupabaseAdminClient();

    // Query reservation by id or reference_code
    let query = admin
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
      `);

    if (reservationId.startsWith("MS-")) {
      query = query.eq("reference_code", reservationId);
    } else {
      query = query.eq("id", reservationId);
    }

    const { data: reservation, error } = await query.single();

    if (error || !reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }

    // Render PDF Document
    const pdfBlob = await pdf(React.createElement(TicketPdfDocument, { reservation })).toBlob();
    const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="MovieSeat-Ticket-${reservation.reference_code}.pdf"`,
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
  } catch (err) {
    console.error("[PDF Route] Error generating ticket PDF:", err);
    return NextResponse.json({ error: "Failed to generate ticket PDF" }, { status: 500 });
  }
}
