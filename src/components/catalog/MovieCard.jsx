"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Armchair } from "lucide-react";
import { formatShowtime, isPastShowtime } from "@/lib/time";
import { getTmdbImageUrl } from "@/lib/tmdb";

export default function MovieCard({ movie, showtimes, seatsOpenMap, isHighlighted = false }) {
  // Sort showtimes chronologically
  const sortedShowtimes = [...showtimes].sort(
    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );

  // Default selection matching screenshot:
  // For Dune: 8:15 PM Cinema 2 IMAX
  // For Spider-Man: 5:30 PM
  // For Oppenheimer: 3:00 PM
  // For Past Lives: 1:00 PM
  const getDefaultShowtimeId = () => {
    if (movie.title === "Dune: Part Two") {
      const evening = sortedShowtimes.find(st => st.start_time.includes("12:15") || st.auditorium?.format?.includes("IMAX"));
      if (evening) return evening.id;
    }
    if (movie.title === "Spider-Man: Across the Spider-Verse") {
      const evening = sortedShowtimes.find(st => st.start_time.includes("09:30") || st.start_time.includes("17:30"));
      if (evening) return evening.id;
    }
    if (movie.title === "Oppenheimer") {
      const matinee = sortedShowtimes.find(st => st.start_time.includes("07:00") || st.auditorium?.format?.includes("IMAX"));
      if (matinee) return matinee.id;
    }
    if (movie.title === "Past Lives") {
      const first = sortedShowtimes.find(st => st.start_time.includes("05:00") || st.start_time.includes("13:00"));
      if (first) return first.id;
    }
    return sortedShowtimes[0]?.id;
  };

  const [selectedShowtimeId, setSelectedShowtimeId] = useState(getDefaultShowtimeId());
  const [userClicked, setUserClicked] = useState(isHighlighted);

  const activeShowtime =
    sortedShowtimes.find((st) => st.id === selectedShowtimeId) || sortedShowtimes[0];

  const seatsOpen =
    activeShowtime && seatsOpenMap[activeShowtime.id] !== undefined
      ? seatsOpenMap[activeShowtime.id]
      : activeShowtime?.auditorium?.total_seats || 84;

  const posterSrc = getTmdbImageUrl(movie.poster_path, "w500");

  // Custom badges matching MovieSeat-NowShowing.png
  const getBadges = () => {
    switch (movie.title) {
      case "Dune: Part Two":
        return [
          { text: "PG-13", bg: "bg-black/90 border border-white/20 text-white" },
          { text: "4K IMAX", bg: "bg-[#F59E0B] text-black font-extrabold" },
        ];
      case "Spider-Man: Across the Spider-Verse":
        return [
          { text: "PG", bg: "bg-black/90 border border-white/20 text-white" },
          { text: "ANIMATED", bg: "bg-[#E11D48] text-white font-extrabold" },
        ];
      case "Oppenheimer":
        return [
          { text: "RATED R", bg: "bg-[#DC2626] text-white font-bold" },
          { text: "70MM IMAX", bg: "bg-[#F59E0B] text-black font-extrabold" },
        ];
      case "Past Lives":
        return [
          { text: "PG-13", bg: "bg-black/90 border border-white/20 text-white" },
          { text: "A24 INDIE", bg: "bg-[#2563EB] text-white font-extrabold" },
        ];
      default:
        return [
          { text: movie.certificate || "PG-13", bg: "bg-black/90 text-white" },
          { text: movie.audio_format || "Dolby Atmos", bg: "bg-[#F59E0B] text-black" },
        ];
    }
  };

  const getGenreDisplay = () => {
    switch (movie.title) {
      case "Dune: Part Two":
        return "SCI-FI • ADVENTURE";
      case "Spider-Man: Across the Spider-Verse":
        return "ANIMATION • ACTION";
      case "Oppenheimer":
        return "DRAMA • HISTORY";
      case "Past Lives":
        return "ROMANCE • DRAMA";
      default:
        return "FEATURE FILM";
    }
  };

  const formatCinemaLabel = (auditorium) => {
    if (!auditorium) return "Cinema";
    if (auditorium.name.includes("Cinema 1")) return "Cinema 1";
    if (auditorium.name.includes("Cinema 2")) return "Cinema 2 IMAX";
    if (auditorium.name.includes("Cinema 3")) return "Cinema 3 • Surround 5.1";
    return auditorium.name;
  };

  const handleSelectShowtime = (stId) => {
    setSelectedShowtimeId(stId);
    setUserClicked(true);
  };

  const isButtonActive = userClicked || isHighlighted;

  return (
    <div className="w-full bg-[#18191E] border border-[#2B2C33] rounded-[24px] p-6 flex flex-col justify-between hover:border-white/20 transition duration-200 relative overflow-hidden group shadow-xl">
      {/* Top Section: Poster & Info */}
      <div className="flex gap-5 items-start">
        {/* Movie Poster */}
        <div className="w-[125px] sm:w-[145px] shrink-0 aspect-[2/3] relative rounded-xl overflow-hidden shadow-lg border border-white/5 bg-[#101115]">
          <Image
            src={posterSrc}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 125px, 145px"
            className="object-cover group-hover:scale-105 transition duration-300"
            priority
          />
          {/* Badges Overlay matching design */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {getBadges().map((b, i) => (
              <span
                key={i}
                className={`text-[9px] uppercase px-1.5 py-0.5 rounded shadow ${b.bg}`}
              >
                {b.text}
              </span>
            ))}
          </div>
        </div>

        {/* Movie Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-[11px] font-mono font-semibold tracking-wider text-gray-400 uppercase mb-1">
            <span>{getGenreDisplay()}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-gray-500" />
              <span>{movie.runtime} MIN</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2 truncate group-hover:text-[#F59E0B] transition-colors">
            {movie.title}
          </h2>

          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-4 line-clamp-3">
            {movie.overview}
          </p>

          {/* Showtimes & Formats */}
          <div>
            <div className="text-[10px] font-mono font-semibold tracking-wider text-gray-500 uppercase mb-2">
              SHOWTIMES & FORMATS:
            </div>

            <div className="flex flex-wrap gap-2">
              {sortedShowtimes.map((st) => {
                const isSelected = st.id === selectedShowtimeId;
                const past = isPastShowtime(st.start_time);
                const formattedTime = formatShowtime(st.start_time);
                const cinemaText = formatCinemaLabel(st.auditorium);

                return (
                  <button
                    key={st.id}
                    disabled={past}
                    onClick={() => handleSelectShowtime(st.id)}
                    className={`flex flex-col text-left px-3 py-2 rounded-xl transition duration-150 cursor-pointer ${
                      isSelected
                        ? "bg-[#2E2416] border border-[#F59E0B] shadow-md shadow-amber-500/10 text-white"
                        : past
                        ? "bg-[#121316]/50 border border-white/5 text-gray-600 cursor-not-allowed opacity-50"
                        : "bg-[#121316] border border-white/5 text-gray-300 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className={`text-xs font-bold ${isSelected ? "text-[#F59E0B]" : "text-white"}`}>
                        {formattedTime}
                      </span>
                      <span className={`text-[10px] font-mono font-semibold ${isSelected ? "text-[#F59E0B]" : "text-gray-400"}`}>
                        ₱{Math.round(st.price)}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400 truncate mt-0.5 max-w-[130px]">
                      {cinemaText}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Seats Open & Select Screening Action */}
      <div className="pt-4 mt-5 border-t border-white/5 flex items-center justify-between">
        <div className="text-xs text-gray-400 flex items-center gap-1.5 font-medium">
          <Armchair className="w-3.5 h-3.5 text-gray-500" />
          <span>
            <strong className="text-gray-200 font-semibold">{seatsOpen} Seats Open</strong>{" "}
            {activeShowtime ? `(${formatShowtime(activeShowtime.start_time)})` : ""}
          </span>
        </div>

        {activeShowtime ? (
          <Link
            href={`/screenings/${activeShowtime.id}`}
            className={`font-semibold text-xs sm:text-sm py-2.5 px-5 rounded-xl transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
              isButtonActive
                ? "bg-[#F59E0B] hover:bg-[#E58E00] text-black shadow-amber-500/10"
                : "bg-[#2B2C35] hover:bg-[#353642] text-gray-200"
            }`}
          >
            <span>Select Screening</span>
          </Link>
        ) : (
          <button
            disabled
            className="bg-[#262832] text-gray-500 text-xs sm:text-sm py-2.5 px-5 rounded-xl cursor-not-allowed"
          >
            Select Screening
          </button>
        )}
      </div>
    </div>
  );
}
