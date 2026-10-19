import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const email = 'patron@movieseat.ph';
  const password = 'Password123!';
  const fullName = 'Juan dela Cruz';

  // Check if exists
  const { data: { users } } = await supabase.auth.admin.listUsers();
  const existing = users.find(u => u.email === email);
  if (existing) {
    console.log("User already exists:", existing.id);
    return;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      phone: '09171234567'
    }
  });

  if (error) {
    console.error("Create user error:", error);
    return;
  }

  console.log("Created test user:", data.user.id, data.user.email);
}

run();
