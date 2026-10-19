import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data, error } = await supabase
    .from('showtimes')
    .select('id, start_time, price, movies(title), auditoriums(name)')
    .order('start_time', { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  data.forEach((s) => {
    console.log(`${s.id} | ${s.movies?.title} | ${s.auditoriums?.name} | ${s.start_time}`);
  });
}

run();
