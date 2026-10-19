import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request) {
  try {
    const { showtimeId, seatIds, sessionId } = await request.json();

    if (!showtimeId) {
      return NextResponse.json({ error: "Showtime ID is required" }, { status: 400 });
    }

    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Must be logged in to hold seats
    if (!user) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "Please sign in to lock your seats." },
        { status: 401 }
      );
    }

    const admin = getSupabaseAdminClient();
    const { data, error } = await admin.rpc("hold_seats", {
      p_showtime_id: showtimeId,
      p_seat_ids: seatIds || [],
      p_user_id: user.id,
      p_session_id: sessionId || null,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data.success) {
      return NextResponse.json(data, { status: 409 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[Hold API] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const showtimeId = searchParams.get("showtimeId");

    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !showtimeId) {
      return NextResponse.json({ success: true });
    }

    const admin = getSupabaseAdminClient();
    await admin.rpc("release_holds", {
      p_showtime_id: showtimeId,
      p_user_id: user.id,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Release API] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
