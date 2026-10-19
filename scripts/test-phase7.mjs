import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runTests() {
  console.log("================================================================================");
  console.log("             PHASE 7: FIND RESERVATION & 30-MIN CANCELLATION TEST               ");
  console.log("================================================================================");

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
    }
  }

  // 1. Fetch active reservation MS-2026-D799A6
  const { data: res1, error: err1 } = await supabase
    .from('reservations')
    .select(`
      id,
      reference_code,
      user_id,
      total_amount,
      status,
      customer_name,
      customer_email,
      showtime:showtimes (
        id,
        start_time,
        movie:movies (id, title),
        auditorium:auditoriums (id, name)
      ),
      reservation_seats (
        id,
        seat:seats (id, seat_label, seat_type)
      )
    `)
    .eq('reference_code', 'MS-2026-D799A6')
    .single();

  assert(!err1 && res1, `Found active reservation MS-2026-D799A6 in Supabase`);
  assert(res1?.customer_name, `Customer name verified: ${res1?.customer_name}`);
  assert(res1?.showtime?.movie?.title, `Movie verified: ${res1?.showtime?.movie?.title}`);
  assert(res1?.showtime?.auditorium?.name, `Auditorium verified: ${res1?.showtime?.auditorium?.name}`);
  assert(res1?.reservation_seats?.length > 0, `Seats verified: ${res1?.reservation_seats?.map(s => s.seat.seat_label).join(', ')}`);

  // 2. Test Case-Insensitive Lookup (ilike matching)
  const { data: searchLower, error: searchErr } = await supabase
    .from('reservations')
    .select('id, reference_code')
    .ilike('reference_code', 'ms-2026-d799a6')
    .single();

  assert(!searchErr && searchLower?.reference_code === 'MS-2026-D799A6', `Case-insensitive search (ms-2026-d799a6 -> MS-2026-D799A6) works`);

  // 3. Test 30-minute cancellation rule logic calculation
  const now = new Date();
  const futureShowtime = new Date(res1.showtime.start_time);
  const diffMinutes = (futureShowtime - now) / (1000 * 60);
  console.log(`[INFO] Showtime starts in ${diffMinutes.toFixed(1)} minutes`);
  assert(diffMinutes > 30, `Showtime start time satisfies > 30 minutes cancellation window`);

  // 4. Test Web Page /find-reservation HTTP Status
  try {
    const pageRes = await fetch('http://localhost:3001/find-reservation');
    assert(pageRes.status === 200, `/find-reservation web page responds with HTTP 200 OK`);
    const html = await pageRes.text();
    assert(html.includes("Find Your Movie Reservation"), `Page includes 'Find Your Movie Reservation' header`);
    assert(html.includes("Search Query"), `Page includes 'Search Query' section`);
  } catch (e) {
    assert(false, `Web page fetch failed: ${e.message}`);
  }

  // 5. Test Cancel RPC with disposable booking (> 30 minutes)
  console.log("\n--- Testing Cancel RPC & Seat Release (> 30 mins) ---");
  const futureStId = res1.showtime.id;
  const auditoriumId = res1.showtime.auditorium.id;
  const { data: availSeat, error: seatErr } = await supabase
    .from('seats')
    .select('id, seat_label')
    .eq('auditorium_id', auditoriumId)
    .neq('id', res1.reservation_seats[0].seat.id)
    .limit(1)
    .single();

  assert(!seatErr && availSeat !== null, `Found test seat in auditorium: ${availSeat?.seat_label}`);

  const dummyRef = `MS-TEST-${Date.now().toString(36).toUpperCase()}`;
  const { data: newRes, error: createErr } = await supabase
    .from('reservations')
    .insert({
      showtime_id: futureStId,
      user_id: res1.user_id,
      reference_code: dummyRef,
      total_amount: 350.00,
      status: 'confirmed',
      customer_name: 'Test Patron',
      customer_email: 'test@example.com'
    })
    .select()
    .single();

  assert(!createErr && newRes, `Created disposable reservation: ${dummyRef}`);

  if (newRes && availSeat) {
    const { error: seatInsertErr } = await supabase
      .from('reservation_seats')
      .insert({
        reservation_id: newRes.id,
        seat_id: availSeat.id,
        showtime_id: futureStId,
        price: 350.00,
        status: 'reserved'
      });
    assert(!seatInsertErr, `Reserved test seat ${availSeat.seat_label}`);

    // Call cancel_reservation RPC
    const { data: cancelResult, error: cancelErr } = await supabase.rpc('cancel_reservation', {
      p_reservation_id: newRes.id,
      p_user_id: res1.user_id
    });

    assert(!cancelErr && cancelResult?.success === true, `cancel_reservation RPC successful: ${cancelResult?.message}`);

    // Verify DB record status is 'cancelled'
    const { data: checkRes } = await supabase
      .from('reservations')
      .select('status')
      .eq('id', newRes.id)
      .single();

    assert(checkRes?.status === 'cancelled', `Reservation status updated to 'cancelled'`);

    // Verify reservation_seats status is 'cancelled'
    const { data: checkSeats } = await supabase
      .from('reservation_seats')
      .select('status')
      .eq('reservation_id', newRes.id);

    assert(checkSeats?.every(s => s.status === 'cancelled'), `Reservation seats marked 'cancelled' (seat freed up)`);

    // Clean up test reservation
    await supabase.from('reservation_seats').delete().eq('reservation_id', newRes.id);
    await supabase.from('reservations').delete().eq('id', newRes.id);
  }

  // 6. Test cancellation rejection when within 30 minutes (or past)
  console.log("\n--- Testing Cancel Rejection for Showtimes Within 30 Minutes ---");
  const pastStId = "406924c6-f346-4562-830f-0592b295df47"; // 05:00 UTC (past / within 30 mins)
  const dummyRef2 = `MS-SOON-${Date.now().toString(36).toUpperCase()}`;
  const { data: soonRes } = await supabase
    .from('reservations')
    .insert({
      showtime_id: pastStId,
      user_id: res1.user_id,
      reference_code: dummyRef2,
      total_amount: 250.00,
      status: 'confirmed',
      customer_name: 'Imminent Patron',
      customer_email: 'imminent@example.com'
    })
    .select()
    .single();

  if (soonRes) {
    const { data: rejectResult, error: rejectErr } = await supabase.rpc('cancel_reservation', {
      p_reservation_id: soonRes.id,
      p_user_id: res1.user_id
    });

    assert(
      (rejectResult && rejectResult.success === false) || rejectErr !== null,
      `Cancellation properly rejected for showtime within 30 minutes: ${rejectResult?.message || rejectErr?.message}`
    );

    // Clean up
    await supabase.from('reservations').delete().eq('id', soonRes.id);
  }

  console.log("================================================================================");
  console.log(`                     RESULTS: ${passed} / ${total} TESTS PASSED                  `);
  console.log("================================================================================");

  if (passed === total) {
    console.log(">>> ALL PHASE 7 CRITERIA SUCCESSFULLY VERIFIED! <<<");
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
