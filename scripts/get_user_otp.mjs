import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const email = 'jonhpaulfeliciano2@gmail.com';
  const { data, error } = await supabase
    .from('otp_codes')
    .select('*')
    .eq('email', email)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Found records for", email, ":", data);
}

run();
