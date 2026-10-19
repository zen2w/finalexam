const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL || "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p";
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "";
const TMDB_READ_ACCESS_TOKEN = process.env.TMDB_READ_ACCESS_TOKEN || "";

export const getTmdbImageUrl = (path, size = "w500") => {
  if (!path) return "/placeholder-movie.png";
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export const fetchFromTmdb = async (endpoint, params = {}) => {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);

  if (TMDB_API_KEY) {
    url.searchParams.set("api_key", TMDB_API_KEY);
  }

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const headers = {
    "Content-Type": "application/json",
  };

  if (TMDB_READ_ACCESS_TOKEN) {
    headers["Authorization"] = `Bearer ${TMDB_READ_ACCESS_TOKEN}`;
  }

  const res = await fetch(url.toString(), { headers });
  if (!res.ok) {
    throw new Error(`TMDB API request failed with status: ${res.status}`);
  }

  return res.json();
};

export const getPopularMovies = async (page = 1) => {
  return fetchFromTmdb("/movie/popular", { page: String(page) });
};

export const getTrendingMovies = async (timeWindow = "week") => {
  return fetchFromTmdb(`/trending/movie/${timeWindow}`);
};

export const searchMovies = async (query, page = 1) => {
  return fetchFromTmdb("/search/movie", { query, page: String(page) });
};

export const getMovieDetails = async (movieId) => {
  return fetchFromTmdb(`/movie/${movieId}`);
};
