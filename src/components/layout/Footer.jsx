export default function Footer() {
  return (
    <footer className="w-full bg-[#0D0E12] border-t border-white/5 py-4">
      <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between text-xs text-gray-400">
        <div>
          MovieSeat &bull; Next.js + Supabase Architecture (Student Project)
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18191E] border border-white/10 text-[11px] font-mono tracking-wider uppercase text-gray-300">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>Live Database Connected</span>
        </div>
      </div>
    </footer>
  );
}
