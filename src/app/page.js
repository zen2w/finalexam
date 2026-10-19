"use client";

import { useState, useEffect } from "react";
import AuditoriumFilter from "@/components/catalog/AuditoriumFilter";
import MovieCard from "@/components/catalog/MovieCard";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const MOVIE_ORDER = [
  "Dune: Part Two",
  "Spider-Man: Across the Spider-Verse",
  "Oppenheimer",
  "Past Lives",
];

export default function Home() {
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [selectedAuditorium, setSelectedAuditorium] = useState("all");
  const [seatsOpenMap, setSeatsOpenMap] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch showtimes & movies from Supabase
  const loadCatalog = async () => {
    try {
      const supabase = getSupabaseBrowserClient();

      const { data: stData, error } = await supabase
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

      if (error) throw error;

      let validShowtimes = stData || [];

      // Auto-Reseed resilience: if today has no showtimes, trigger reseed_today
      if (validShowtimes.length === 0) {
        await supabase.rpc("reseed_today");
        const { data: reseeded } = await supabase
          .from("showtimes")
          .select(`
            id,
            start_time,
            end_time,
            price,
            movie:movies (*),
            auditorium:auditoriums (*)
          `)
          .order("start_time", { ascending: true });
        validShowtimes = reseeded || [];
      }

      setShowtimes(validShowtimes);

      // Extract unique movies
      const movieMap = new Map();
      for (const st of validShowtimes) {
        if (st.movie && !movieMap.has(st.movie.id)) {
          movieMap.set(st.movie.id, st.movie);
        }
      }
      const rawMovies = Array.from(movieMap.values());
      // Sort to match MovieSeat-NowShowing.png exact grid positions
      rawMovies.sort((a, b) => {
        const idxA = MOVIE_ORDER.indexOf(a.title);
        const idxB = MOVIE_ORDER.indexOf(b.title);
        return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
      });
      setMovies(rawMovies);

      // Calculate available seats for each showtime
      const newSeatsMap = {};
      for (const st of validShowtimes) {
        const total = st.auditorium?.total_seats || 84;
        
        // Count active holds
        const { count: holdsCount } = await supabase
          .from("seat_holds")
          .select("*", { count: "exact", head: true })
          .eq("showtime_id", st.id)
          .gt("expires_at", new Date().toISOString());

        // Count confirmed reservation seats
        const { count: reservedCount } = await supabase
          .from("reservation_seats")
          .select("*, reservation:reservations!inner(status)", { count: "exact", head: true })
          .eq("showtime_id", st.id)
          .eq("reservation.status", "confirmed");

        const taken = (holdsCount || 0) + (reservedCount || 0);
        newSeatsMap[st.id] = Math.max(0, total - taken);
      }
      setSeatsOpenMap(newSeatsMap);
    } catch (err) {
      console.error("[Catalog] Error loading catalog:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();

    // Supabase Realtime channel subscription for instant seat availability sync
    const supabase = getSupabaseBrowserClient();
    const channel = supabase
      .channel("catalog-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "seat_holds" },
        () => loadCatalog()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reservation_seats" },
        () => loadCatalog()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter showtimes and movies by selected auditorium
  const filteredShowtimes = showtimes.filter((st) => {
    if (selectedAuditorium === "all") return true;
    return st.auditorium?.id === selectedAuditorium;
  });

  const visibleMovieIds = new Set(filteredShowtimes.map((st) => st.movie?.id));
  const visibleMovies = movies.filter((m) => visibleMovieIds.has(m.id));

  return (
    <div className="w-full flex-1 bg-[#0D0E12] min-h-[calc(100vh-64px)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto space-y-8">
        {/* Auditorium Filter Bar matching MovieSeat-NowShowing.png */}
        <AuditoriumFilter
          selectedAuditorium={selectedAuditorium}
          onSelectAuditorium={setSelectedAuditorium}
        />

        {/* Section Heading & Realtime Active Badge */}
        <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
          <div className="flex items-baseline gap-3">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Now Showing
            </h1>
            <span className="text-sm text-gray-400 font-medium">
              {visibleMovies.length} Titles Available Today
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#F59E0B] tracking-wider uppercase bg-[#18191E] border border-amber-500/20 px-3.5 py-1.5 rounded-full shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
            <span>REAL-TIME SEAT AVAILABILITY ACTIVE</span>
          </div>
        </div>

        {/* 2x2 Movie Card Grid matching MovieSeat-NowShowing.png */}
        {loading ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[280px] bg-[#18191E] border border-white/5 rounded-[24px] animate-pulse"
              />
            ))}
          </div>
        ) : visibleMovies.length === 0 ? (
          <div className="text-center py-20 bg-[#18191E] border border-white/5 rounded-[24px]">
            <p className="text-gray-400 text-sm">No showtimes found for the selected auditorium.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {visibleMovies.map((movie) => {
              const movieShowtimes = filteredShowtimes.filter(
                (st) => st.movie?.id === movie.id
              );
              return (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  showtimes={movieShowtimes}
                  seatsOpenMap={seatsOpenMap}
                  isHighlighted={movie.title === "Dune: Part Two"}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
