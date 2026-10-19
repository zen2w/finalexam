import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function wipeUserData() {
  console.log("================================================================================");
  console.log("                  PERFORMING FRESH WIPE OF ALL USER DATA                        ");
  console.log("================================================================================");

  // 1. Delete all reservation seats
  console.log("1. Clearing reservation_seats...");
  const { error: rsErr } = await supabase.from('reservation_seats').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (rsErr) console.error("Error clearing reservation_seats:", rsErr);

  // 2. Delete all reservations
  console.log("2. Clearing reservations...");
  const { error: resErr } = await supabase.from('reservations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (resErr) console.error("Error clearing reservations:", resErr);

  // 3. Delete all seat holds
  console.log("3. Clearing seat_holds...");
  const { error: holdsErr } = await supabase.from('seat_holds').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (holdsErr) console.error("Error clearing seat_holds:", holdsErr);

  // 4. Delete all OTP codes
  console.log("4. Clearing otp_codes...");
  const { error: otpErr } = await supabase.from('otp_codes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (otpErr) console.error("Error clearing otp_codes:", otpErr);

  // 5. Delete all profiles
  console.log("5. Clearing profiles...");
  const { error: profErr } = await supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (profErr) console.error("Error clearing profiles:", profErr);

  // 6. Delete all auth users
  console.log("6. Clearing auth.users...");
  const { data: { users }, error: listErr } = await supabase.auth.admin.listUsers();
  if (users && users.length > 0) {
    for (const u of users) {
      console.log(`   Deleting user: ${u.email} (${u.id})`);
      const { error: delErr } = await supabase.auth.admin.deleteUser(u.id);
      if (delErr) {
        console.error(`   Failed to delete user ${u.id}:`, delErr);
      }
    }
  }

  console.log("\n--- Verifying Wipe Integrity ---");
  const { data: { users: remainingUsers } } = await supabase.auth.admin.listUsers();
  console.log("Remaining Auth Users:", remainingUsers.length);

  const { count: profRemaining } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  console.log("Remaining Profiles:", profRemaining || 0);

  const { count: resRemaining } = await supabase.from('reservations').select('*', { count: 'exact', head: true });
  console.log("Remaining Reservations:", resRemaining || 0);

  const { count: rsRemaining } = await supabase.from('reservation_seats').select('*', { count: 'exact', head: true });
  console.log("Remaining Reservation Seats:", rsRemaining || 0);

  const { count: holdsRemaining } = await supabase.from('seat_holds').select('*', { count: 'exact', head: true });
  console.log("Remaining Seat Holds:", holdsRemaining || 0);

  const { count: otpRemaining } = await supabase.from('otp_codes').select('*', { count: 'exact', head: true });
  console.log("Remaining OTP Codes:", otpRemaining || 0);

  // Check seat count
  const { count: totalSeats } = await supabase.from('seats').select('*', { count: 'exact', head: true });
  console.log("Intact Physical Seats:", totalSeats);

  // Check showtimes count
  const { count: totalShowtimes } = await supabase.from('showtimes').select('*', { count: 'exact', head: true });
  console.log("Intact Showtimes:", totalShowtimes);

  // Check movies count
  const { count: totalMovies } = await supabase.from('movies').select('*', { count: 'exact', head: true });
  console.log("Intact Movies:", totalMovies);

  console.log("================================================================================");
  console.log("                   FRESH WIPE COMPLETED SUCCESSFULLY!                           ");
  console.log("================================================================================");
}

wipeUserData().catch(err => {
  console.error("Wipe failed:", err);
  process.exit(1);
});
