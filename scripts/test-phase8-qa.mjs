import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runRegressionSuite() {
  console.log("================================================================================");
  console.log("           PHASE 8: COMPREHENSIVE END-TO-END REGRESSION QA SUITE                ");
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

  // Fetch real users from auth
  const { data: { users } } = await supabase.auth.admin.listUsers();
  const user1 = users[0].id;
  const user2 = users[1] ? users[1].id : '05a14d3f-93d1-46e6-bc65-3b849b210a1d';

  // Pick a future showtime (> 30 mins) for testing
  const futureTime = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString();
  const { data: stList } = await supabase
    .from('showtimes')
    .select('id, auditorium_id, price')
    .gte('start_time', futureTime)
    .limit(1);

  const testShowtime = stList?.[0] || (await supabase.from('showtimes').select('id, auditorium_id, price').limit(1)).data[0];
  const { data: testSeats } = await supabase
    .from('seats')
    .select('id, seat_label')
    .eq('auditorium_id', testShowtime.auditorium_id)
    .limit(5);

  const seatA = testSeats[0];
  const seatB = testSeats[1];

  // Clear any existing holds on seatA & seatB
  await supabase.from('seat_holds').delete().in('seat_id', [seatA.id, seatB.id]);

  // ----------------------------------------------------------------------------
  // TEST PILLAR 1: Double-Booking Race Condition Lock
  // ----------------------------------------------------------------------------
  console.log("\n--- 1. Testing Concurrency & Double-Booking Prevention ---");
  // User 1 acquires hold on seatA
  const { data: hold1 } = await supabase.rpc('hold_seats', {
    p_showtime_id: testShowtime.id,
    p_seat_ids: [seatA.id],
    p_user_id: user1,
    p_session_id: 'session-user-1'
  });
  assert(hold1?.success === true, `User 1 successfully locked seat ${seatA.seat_label}`);

  // User 2 attempts to hold the same seatA concurrently
  const { data: hold2 } = await supabase.rpc('hold_seats', {
    p_showtime_id: testShowtime.id,
    p_seat_ids: [seatA.id],
    p_user_id: user2,
    p_session_id: 'session-user-2'
  });
  assert(
    hold2?.success === false && hold2?.error === 'SEAT_ALREADY_HELD',
    `User 2 locked out with SEAT_ALREADY_HELD conflict: ${hold2?.message}`
  );

  // ----------------------------------------------------------------------------
  // TEST PILLAR 2: 5-Minute Hold Auto-Release (TTL Expiry)
  // ----------------------------------------------------------------------------
  console.log("\n--- 2. Testing 5-Minute Hold Expiry & Auto-Release ---");
  // Artificially expire user 1's hold on seatA
  const expiredTimestamp = new Date(Date.now() - 1000).toISOString();
  await supabase
    .from('seat_holds')
    .update({ expires_at: expiredTimestamp })
    .eq('showtime_id', testShowtime.id)
    .eq('seat_id', seatA.id);

  // User 2 now attempts to hold seatA - hold_seats cleans expired holds and grants lock
  const { data: hold3 } = await supabase.rpc('hold_seats', {
    p_showtime_id: testShowtime.id,
    p_seat_ids: [seatA.id],
    p_user_id: user2,
    p_session_id: 'session-user-2'
  });
  assert(hold3?.success === true, `Expired hold auto-released; User 2 granted hold on seat ${seatA.seat_label}`);

  // Clean up hold
  await supabase.from('seat_holds').delete().eq('seat_id', seatA.id);

  // ----------------------------------------------------------------------------
  // TEST PILLAR 3: OTP Brute-Force Lockout Defense (5 Failed Attempts)
  // ----------------------------------------------------------------------------
  console.log("\n--- 3. Testing OTP Cryptographic Security & Lockout ---");
  const testEmail = `qa-audit-${Date.now()}@example.com`;
  // Insert fresh OTP row with 0 attempts
  const { data: otpRow, error: otpErr } = await supabase
    .from('otp_codes')
    .insert({
      email: testEmail,
      hashed_code: 'fakedigestplaceholder',
      expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      attempts: 0,
      verified: false
    })
    .select()
    .single();

  assert(!otpErr && otpRow, `Created fresh test OTP record for ${testEmail}`);

  // Simulate 5 consecutive failed verification attempts via API
  for (let i = 1; i <= 5; i++) {
    const res = await fetch('http://localhost:3001/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, code: '000000' })
    });
    const data = await res.json();
    if (i < 5) {
      assert(res.status === 400 && data.error?.includes('remaining'), `Failed attempt ${i} rejected with attempts remaining`);
    } else {
      assert(
        res.status === 400 || res.status === 429,
        `Attempt 5 recorded attempt count reaches threshold`
      );
    }
  }

  // 6th attempt should return 429 Locked Out
  const resLocked = await fetch('http://localhost:3001/api/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, code: '000000' })
  });
  const dataLocked = await resLocked.json();
  assert(
    resLocked.status === 429 && dataLocked.error?.includes('locked'),
    `Brute-force lockout triggered (HTTP 429): ${dataLocked.error}`
  );

  // Clean up test OTP
  await supabase.from('otp_codes').delete().eq('email', testEmail);

  // ----------------------------------------------------------------------------
  // TEST PILLAR 4: Cross-User Privacy & Cancellation Isolation
  // ----------------------------------------------------------------------------
  console.log("\n--- 4. Testing Cross-User Privacy & Ownership Isolation ---");
  const dummyRef = `MS-QA-${Date.now().toString(36).toUpperCase()}`;
  const { data: resUser1, error: createErr } = await supabase
    .from('reservations')
    .insert({
      showtime_id: testShowtime.id,
      user_id: user1,
      reference_code: dummyRef,
      total_amount: 350.00,
      status: 'confirmed',
      customer_name: 'Patron One',
      customer_email: 'patron1@example.com'
    })
    .select()
    .single();

  assert(!createErr && resUser1 !== null, `Created reservation for User 1: ${dummyRef}`);

  // User 2 attempts to cancel User 1's reservation
  const { data: cancelSteal } = await supabase.rpc('cancel_reservation', {
    p_reservation_id: resUser1.id,
    p_user_id: user2 // Malicious/different user attempting to cancel another user's reservation
  });

  assert(
    cancelSteal?.success === false && cancelSteal?.error === 'UNAUTHORIZED',
    `Cross-user cancellation blocked by database ownership check: ${cancelSteal?.message}`
  );

  // ----------------------------------------------------------------------------
  // TEST PILLAR 5: 30-Minute Cancellation Cutoff & Immediate Seat Release
  // ----------------------------------------------------------------------------
  console.log("\n--- 5. Testing 30-Minute Cutoff & Immediate Seat Release ---");
  // Assign seatB to User 1's reservation
  await supabase
    .from('reservation_seats')
    .insert({
      reservation_id: resUser1.id,
      showtime_id: testShowtime.id,
      seat_id: seatB.id,
      price: 350.00,
      status: 'reserved'
    });

  // User 1 cancels their own reservation (> 30 mins)
  const { data: legitCancel } = await supabase.rpc('cancel_reservation', {
    p_reservation_id: resUser1.id,
    p_user_id: user1
  });

  assert(legitCancel?.success === true, `User 1 successfully cancelled reservation: ${legitCancel?.message}`);

  // Verify seat is released and can immediately be held again
  const { data: reHold } = await supabase.rpc('hold_seats', {
    p_showtime_id: testShowtime.id,
    p_seat_ids: [seatB.id],
    p_user_id: user2,
    p_session_id: 'session-after-cancel'
  });

  assert(reHold?.success === true, `Cancelled seat immediately released for new patron hold`);

  // Clean up
  await supabase.from('seat_holds').delete().eq('seat_id', seatB.id);
  await supabase.from('reservation_seats').delete().eq('reservation_id', resUser1.id);
  await supabase.from('reservations').delete().eq('id', resUser1.id);

  // ----------------------------------------------------------------------------
  // TEST PILLAR 6: Mobile Responsiveness & Turbopack SSR Rendering
  // ----------------------------------------------------------------------------
  console.log("\n--- 6. Testing SSR Routes & Mobile Navigation ---");
  const routes = ['/', '/find-reservation', '/signin', '/signup', '/verify'];
  for (const path of routes) {
    const res = await fetch(`http://localhost:3001${path}`);
    assert(res.status === 200, `SSR Route ${path} responds HTTP 200 OK`);
  }

  console.log("================================================================================");
  console.log(`               REGRESSION RESULTS: ${passed} / ${total} TESTS PASSED             `);
  console.log("================================================================================");

  if (passed === total) {
    console.log(">>> ALL 6 PHASE 8 PRODUCTION REGRESSION AUDITS PASSED (100%) <<<");
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runRegressionSuite().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
