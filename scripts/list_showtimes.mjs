import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data, error } = await supabase
    .from('showtimes')
    .select('*')
    .limit(2);
    
  if (error) {
    console.error("Error:", error);
    return;
  }
  
  console.log("SHOWTIME SAMPLE:", JSON.stringify(data[0], null, 2));
}

run();
