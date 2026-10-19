import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request, { params }) {
  try {
    const resolvedParams = await params;
    const reservationId = resolvedParams.id;

    if (!reservationId) {
      return NextResponse.json({ error: "Reservation ID is required" }, { status: 400 });
    }

    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "You must be signed in to cancel a reservation." },
        { status: 401 }
      );
    }

    const admin = getSupabaseAdminClient();

    // Find actual UUID if reference code was passed
    let actualReservationId = reservationId;
    if (reservationId.startsWith("MS-")) {
      const { data: found } = await admin
        .from("reservations")
        .select("id")
        .eq("reference_code", reservationId)
        .single();
      if (!found) {
        return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
      }
      actualReservationId = found.id;
    }

    // Call cancel_reservation RPC (enforces 30-min policy)
    const { data, error } = await admin.rpc("cancel_reservation", {
      p_reservation_id: actualReservationId,
      p_user_id: user.id,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data.success) {
      return NextResponse.json(data, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[Cancel API] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
