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

const cinema1Id = "11111111-1111-1111-1111-111111111111"; // Cinema 1 (Dolby Atmos)
const cinema2Id = "22222222-2222-2222-2222-222222222222"; // Cinema 2 (IMAX Laser)
const cinema3Id = "33333333-3333-3333-3333-333333333333"; // Cinema 3 (Standard)

const moviesToSync = [
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    tmdb_id: 693134,
    title: "Dune: Part Two",
    poster_path: "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    backdrop_path: "/xOMo8BRK7PfcJv9JCnx7s520Wio.jpg",
    overview: "Paul Atreides unites with Chani and the Fremen to avenge his fallen family.",
    release_date: "2024-03-01",
    runtime: 166,
    vote_average: 8.3,
    certificate: "PG-13",
    audio_format: "4K IMAX",
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    tmdb_id: 569094,
    title: "Spider-Man: Across the Spider-Verse",
    poster_path: "/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    backdrop_path: "/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg",
    overview: "Miles Morales catapults across the Multiverse alongside a team of Spider-People.",
    release_date: "2023-06-02",
    runtime: 140,
    vote_average: 8.4,
    certificate: "PG",
    audio_format: "ANIMATED",
  },
  {
    id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
    tmdb_id: 872585,
    title: "Oppenheimer",
    poster_path: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdrop_path: "/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg",
    overview: "The story of J. Robert Oppenheimer and the moral weight of the atomic bomb.",
    release_date: "2023-07-21",
    runtime: 180,
    vote_average: 8.1,
    certificate: "RATED R",
    audio_format: "70MM IMAX",
  },
  {
    id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
    tmdb_id: 666277,
    title: "Past Lives",
    poster_path: "/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg",
    backdrop_path: "/m4VUe6g6vYJt7uY3wB5T7J8R5K0.jpg",
    overview: "Two childhood friends reunite in New York for one fateful week.",
    release_date: "2023-06-02",
    runtime: 106,
    vote_average: 7.9,
    certificate: "PG-13",
    audio_format: "A24 INDIE",
  },
];

async function sync() {
  console.log("Upserting movies with exact posters...");
  for (const movie of moviesToSync) {
    const { error } = await admin.from("movies").upsert(movie, { onConflict: "id" });
    if (error) console.error("Error upserting movie:", movie.title, error);
    else console.log("✓ Upserted movie:", movie.title);
  }
}

sync().catch(console.error);
