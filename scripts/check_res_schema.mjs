import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data: r1, error: e1 } = await supabase.from('reservations').select('*').limit(1);
  console.log("reservations columns:", r1 ? Object.keys(r1[0] || {}) : e1);

  const { data: r2, error: e2 } = await supabase.from('reservation_seats').select('*').limit(1);
  console.log("reservation_seats columns:", r2 ? Object.keys(r2[0] || {}) : e2);

  const { data: r3, error: e3 } = await supabase.from('seat_holds').select('*').limit(1);
  console.log("seat_holds columns:", r3 ? Object.keys(r3[0] || {}) : e3);
}

run();
