import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error("Error:", error);
    return;
  }
  console.log(`Found ${users.length} users:`);
  users.forEach((u) => {
    console.log(`ID: ${u.id} | Email: ${u.email} | Name: ${u.user_metadata?.full_name}`);
  });
}

run();
