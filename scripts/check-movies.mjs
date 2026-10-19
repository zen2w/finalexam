import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
for (const line of envFile.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const idx = trimmed.indexOf('=');
    if (idx !== -1) {
      env[trimmed.substring(0, idx).trim()] = trimmed.substring(idx + 1).trim();
    }
  }
}

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const { data: movies } = await admin.from('movies').select('*');
console.log('Current Movies in DB:');
console.log(movies?.map(m => ({ id: m.id, title: m.title, poster_path: m.poster_path })));

const { data: showtimes } = await admin.from('showtimes').select('id, movie_id, auditorium_id, start_time, price');
console.log('Showtimes in DB:', showtimes?.length);
