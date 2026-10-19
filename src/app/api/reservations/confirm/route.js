import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendEmailJsRest } from "@/lib/emailjs";

export async function POST(request) {
  try {
    const { showtimeId, seatIds, customerName, customerEmail } = await request.json();

    if (!showtimeId || !seatIds || seatIds.length === 0) {
      return NextResponse.json({ error: "Showtime and seats are required" }, { status: 400 });
    }

    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "Please sign in to complete your reservation." },
        { status: 401 }
      );
    }

    const admin = getSupabaseAdminClient();
    const { data, error } = await admin.rpc("confirm_reservation", {
      p_showtime_id: showtimeId,
      p_seat_ids: seatIds,
      p_user_id: user.id,
      p_customer_name: customerName || user.user_metadata?.full_name || "MovieSeat Patron",
      p_customer_email: customerEmail || user.email,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data.success) {
      return NextResponse.json(data, { status: 409 });
    }

    // Non-fatal background email notification via EmailJS
    const templateId = process.env.EMAILJS_CONFIRMATION_TEMPLATE_ID || process.env.NEXT_PUBLIC_EMAILJS_CONFIRMATION_TEMPLATE_ID;
    if (templateId) {
      sendEmailJsRest({
        templateId,
        templateParams: {
          to_email: customerEmail || user.email,
          to_name: customerName || "MovieSeat Patron",
          reference_code: data.reference_code,
          total_amount: `PHP ${data.total_amount}`,
          seats: data.seats?.map((s) => s.seat_label).join(", "),
        },
      }).catch((e) => console.error("[Confirm Route] EmailJS dispatch non-fatal error:", e));
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[Confirm API] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
