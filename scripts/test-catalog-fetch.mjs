import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";

const envFile = fs.readFileSync("C:/Users/COMPUTER CENTER/Music/Movieseat/my-app/.env.local", "utf8");
const env = {};
for (const line of envFile.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith("#")) {
    const idx = trimmed.indexOf("=");
    if (idx !== -1) {
      env[trimmed.substring(0, idx).trim()] = trimmed.substring(idx + 1).trim();
    }
  }
}

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function testFetch() {
  const { data: showtimes, error } = await admin
    .from("showtimes")
    .select(`
      id,
      start_time,
      end_time,
      price,
      movie:movies (
        id,
        tmdb_id,
        title,
        poster_path,
        backdrop_path,
        overview,
        release_date,
        runtime,
        vote_average,
        certificate,
        audio_format
      ),
      auditorium:auditoriums (
        id,
        name,
        format,
        total_seats
      )
    `)
    .order("start_time", { ascending: true });

  if (error) {
    console.error("Error fetching showtimes:", error);
    return;
  }

  console.log("Total showtimes fetched:", showtimes.length);
  for (const st of showtimes) {
    console.log(`- ${st.movie.title} | ${st.auditorium.name} | ${st.start_time} | ₱${st.price}`);
  }
}

testFetch().catch(console.error);
