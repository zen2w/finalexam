import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testQuery() {
  // 1. Get an existing reservation or create a test one
  let { data: resList } = await supabase.from('reservations').select('id, reference_code').limit(1);
  let ref = resList?.[0]?.reference_code;

  if (!ref) {
    console.log("No reservations in DB, creating a sample one to test relations...");
    const { data: st } = await supabase.from('showtimes').select('id, auditorium_id, price').limit(1);
    const { data: s } = await supabase.from('seats').select('id').eq('auditorium_id', st[0].auditorium_id).limit(2);
    
    // Hold then confirm
    const uId = '05a14d3f-93d1-46e6-bc65-3b849b210a1d';
    await supabase.rpc('hold_seats', {
      p_showtime_id: st[0].id,
      p_seat_ids: [s[0].id, s[1].id],
      p_user_id: uId
    });

    const { data: cRes } = await supabase.rpc('confirm_reservation', {
      p_showtime_id: st[0].id,
      p_seat_ids: [s[0].id, s[1].id],
      p_user_id: uId,
      p_customer_name: 'Alex Rivera',
      p_customer_email: 'alex.rivera@example.com'
    });
    ref = cRes.reference_code;
    console.log("Created test reservation with ref:", ref);
  } else {
    console.log("Using existing reservation ref:", ref);
  }

  // Test full join
  const { data, error } = await supabase
    .from('reservations')
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
    .eq('reference_code', ref)
    .single();

  if (error) {
    console.error("Relation query error:", error);
  } else {
    console.log("Relation query SUCCESS!");
    console.log("Movie Title:", data.showtime?.movie?.title);
    console.log("Auditorium:", data.showtime?.auditorium?.name);
    console.log("Seats:", data.reservation_seats?.map(rs => rs.seat?.seat_label).join(", "));
    console.log("Total Amount:", data.total_amount);
  }
}

testQuery();
