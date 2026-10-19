"use client";

import { Film } from "lucide-react";

export default function AuditoriumFilter({ selectedAuditorium, onSelectAuditorium }) {
  const filters = [
    { id: "all", label: "All Auditoriums", dotColor: null },
    { id: "11111111-1111-1111-1111-111111111111", label: "Cinema 1 • Dolby Atmos", dotColor: "#3B82F6" },
    { id: "22222222-2222-2222-2222-222222222222", label: "Cinema 2 • IMAX Laser", dotColor: "#F59E0B" },
    { id: "33333333-3333-3333-3333-333333333333", label: "Cinema 3 • Standard", dotColor: "#D97706" },
  ];

  return (
    <div className="w-full bg-[#18191E] border border-white/5 rounded-2xl px-6 py-4 flex items-center gap-6 flex-wrap shadow-md">
      <div className="flex items-center gap-2 text-gray-400 shrink-0">
        <Film className="w-4 h-4 text-[#F59E0B]" />
        <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-gray-400">
          AUDITORIUM:
        </span>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        {filters.map((f) => {
          const isSelected = selectedAuditorium === f.id;
          return (
            <button
              key={f.id}
              onClick={() => onSelectAuditorium(f.id)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                isSelected
                  ? "bg-[#25262D] text-white border border-white/20 shadow-sm"
                  : "bg-transparent text-gray-400 hover:text-white border border-transparent hover:border-white/10"
              }`}
            >
              {f.dotColor && (
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: f.dotColor }}
                />
              )}
              <span>{f.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
