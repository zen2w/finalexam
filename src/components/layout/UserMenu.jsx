"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    const supabase = getSupabaseBrowserClient();

    // Fast-path hydration check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (active) {
        setUser(session?.user || null);
        setHydrated(true);
      }
    });

    // 1.2s safety fallback timer to prevent hanging skeletons
    const fallbackTimer = setTimeout(() => {
      if (active) setHydrated(true);
    }, 1200);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) {
        setUser(session?.user || null);
        setHydrated(true);
      }
    });

    return () => {
      active = false;
      clearTimeout(fallbackTimer);
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push("/signin");
    router.refresh();
  };

  if (!hydrated) {
    return <div className="w-24 h-8 bg-white/5 rounded-lg animate-pulse" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/signin"
          className="text-sm font-medium text-gray-300 hover:text-white transition px-2 py-1"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="bg-[#F59E0B] hover:bg-[#E58E00] text-black font-semibold text-sm px-4 py-2 rounded-lg transition shadow-sm"
        >
          Create Account
        </Link>
      </div>
    );
  }

  const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "Patron";

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 bg-[#1A1B20] border border-white/10 px-3 py-1.5 rounded-lg">
        <div className="w-5 h-5 rounded-full bg-amber-400/20 text-[#F59E0B] flex items-center justify-center text-[10px] font-bold">
          {name[0].toUpperCase()}
        </div>
        <span className="text-xs text-white max-w-[120px] truncate">{name}</span>
        <button
          onClick={handleSignOut}
          title="Sign Out"
          className="text-gray-400 hover:text-red-400 transition ml-1 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
