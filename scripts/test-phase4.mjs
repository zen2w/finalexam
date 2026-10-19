import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runTests() {
  console.log("================================================================================");
  console.log("                   PHASE 4: SEAT MAP & 5-MIN HOLD RPC VERIFICATION             ");
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

  // 1. Get a showtime and auditorium seats
  const { data: showtimes } = await supabase
    .from('showtimes')
    .select('id, price, auditorium_id')
    .order('start_time', { ascending: true })
    .limit(1);

  const testShowtime = showtimes[0];
  assert(testShowtime, `Fetched active showtime (${testShowtime?.id})`);

  const { data: seats } = await supabase
    .from('seats')
    .select('id, row, number, seat_label, seat_type')
    .eq('auditorium_id', testShowtime.auditorium_id)
    .order('row', { ascending: true })
    .order('number', { ascending: true });

  assert(seats && seats.length > 10, `Auditorium has ${seats?.length} physical seats`);

  const vipSeat = seats.find(s => s.seat_type === 'vip');
  const stdSeat = seats.find(s => s.seat_type === 'standard');
  const user1 = '05a14d3f-93d1-46e6-bc65-3b849b210a1d';
  const user2 = '11111111-2222-3333-4444-555555555555';

  // Clear any existing test holds
  await supabase.from('seat_holds').delete().eq('showtime_id', testShowtime.id);

  // TEST 1: Hold 2 seats
  const { data: holdRes, error: holdErr } = await supabase.rpc('hold_seats', {
    p_showtime_id: testShowtime.id,
    p_seat_ids: [vipSeat.id, stdSeat.id],
    p_user_id: user1,
  });

  assert(holdRes?.success === true, `User 1 locked 2 seats (${vipSeat.seat_label}, ${stdSeat.seat_label})`);
  assert(holdRes?.expires_at, `Hold has valid expires_at timestamp: ${holdRes?.expires_at}`);

  // TEST 2: Conflict detection (User 2 attempts to lock User 1's held seat)
  const { data: conflictRes } = await supabase.rpc('hold_seats', {
    p_showtime_id: testShowtime.id,
    p_seat_ids: [vipSeat.id],
    p_user_id: user2,
  });

  assert(conflictRes?.success === false && conflictRes?.error === 'SEAT_ALREADY_HELD', 'Conflict prevention: User 2 blocked from locking User 1 seat');

  // TEST 3: 6-Seat limit enforcement
  const sevenSeatIds = seats.slice(0, 7).map(s => s.id);
  const { data: limitRes } = await supabase.rpc('hold_seats', {
    p_showtime_id: testShowtime.id,
    p_seat_ids: sevenSeatIds,
    p_user_id: user1,
  });

  assert(limitRes?.success === false && limitRes?.error === 'MAX_SEATS_EXCEEDED', 'Enforced 6-seat cap per transaction (7 seats rejected)');

  // TEST 4: Release holds
  const { data: releaseRes } = await supabase.rpc('release_holds', {
    p_showtime_id: testShowtime.id,
    p_user_id: user1,
  });

  assert(releaseRes?.success === true, 'release_holds successfully released User 1 seats');

  const { data: remainingHolds } = await supabase
    .from('seat_holds')
    .select('*')
    .eq('showtime_id', testShowtime.id)
    .eq('user_id', user1);

  assert(remainingHolds.length === 0, 'seat_holds table verified empty for User 1');

  // TEST 5: Complete Booking flow (Hold -> Confirm -> Price calculation with VIP surcharge)
  await supabase.rpc('hold_seats', {
    p_showtime_id: testShowtime.id,
    p_seat_ids: [vipSeat.id, stdSeat.id],
    p_user_id: user1,
  });

  const { data: confirmRes, error: confirmErr } = await supabase.rpc('confirm_reservation', {
    p_showtime_id: testShowtime.id,
    p_seat_ids: [vipSeat.id, stdSeat.id],
    p_user_id: user1,
    p_customer_name: 'Juan dela Cruz',
    p_customer_email: 'patron@movieseat.ph',
  });

  assert(confirmRes?.success === true, `Reservation confirmed with Reference: ${confirmRes?.reference_code}`);

  const expectedTotal = Number(testShowtime.price) + 100 + Number(testShowtime.price); // Base + VIP + Base
  assert(Number(confirmRes?.total_amount) === expectedTotal, `Total amount correctly calculated: PHP ${confirmRes?.total_amount} (matches expected PHP ${expectedTotal})`);

  // Verify double booking guard on confirmed reservation
  const { data: doubleBookRes } = await supabase.rpc('hold_seats', {
    p_showtime_id: testShowtime.id,
    p_seat_ids: [vipSeat.id],
    p_user_id: user2,
  });

  assert(doubleBookRes?.success === false && doubleBookRes?.error === 'SEAT_ALREADY_RESERVED', 'Double-booking guard: Already reserved seat cannot be held by any user');

  // Cleanup test reservation
  if (confirmRes?.reservation_id) {
    await supabase.from('reservation_seats').delete().eq('reservation_id', confirmRes.reservation_id);
    await supabase.from('reservations').delete().eq('id', confirmRes.reservation_id);
  }

  console.log("================================================================================");
  console.log(`RESULTS: ${passed}/${total} TESTS PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log("================================================================================");
}

runTests();
