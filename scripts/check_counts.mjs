import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkCounts() {
  const { data: { users } } = await supabase.auth.admin.listUsers();
  console.log("Auth Users:", users.length, users.map(u => ({ email: u.email, id: u.id })));

  const { count: profCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  console.log("Profiles count:", profCount);

  const { count: resCount } = await supabase.from('reservations').select('*', { count: 'exact', head: true });
  console.log("Reservations count:", resCount);

  const { count: rsCount } = await supabase.from('reservation_seats').select('*', { count: 'exact', head: true });
  console.log("Reservation Seats count:", rsCount);

  const { count: holdsCount } = await supabase.from('seat_holds').select('*', { count: 'exact', head: true });
  console.log("Seat Holds count:", holdsCount);

  const { count: otpCount } = await supabase.from('otp_codes').select('*', { count: 'exact', head: true });
  console.log("OTP Codes count:", otpCount);
}

checkCounts();
