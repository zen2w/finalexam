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

const tmdbKey = env.TMDB_API_KEY;
console.log('TMDB Key exists:', !!tmdbKey);

const ids = [693134, 569094, 872585, 666277];
for (const id of ids) {
  try {
    const res = await fetch(\https://api.themoviedb.org/3/movie/\?api_key=\);
    if (res.ok) {
      const data = await res.json();
      console.log(\[\] \: \, runtime: \);
    } else {
      console.log(\[\] HTTP error \);
    }
  } catch (e) {
    console.error(e.message);
  }
}
