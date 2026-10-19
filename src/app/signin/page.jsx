"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unverifiedEmail, setUnverifiedEmail] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(true);

  // Autofill prevention: release readOnly after mount delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReadOnly(false);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setUnverifiedEmail(null);

    if (!email.trim() || !password) {
      setError("Please provide both email address and password.");
      return;
    }

    setLoading(true);

    try {
      const supabase = getSupabaseBrowserClient();
      const cleanEmail = email.trim().toLowerCase();

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (authError) {
        if (
          authError.message?.toLowerCase().includes("email not confirmed") ||
          authError.message?.toLowerCase().includes("not verified")
        ) {
          setUnverifiedEmail(cleanEmail);
          throw new Error("Account not verified. Please verify your email to continue.");
        }
        throw new Error(authError.message || "Invalid credentials. Please try again.");
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex-1 flex items-center justify-center px-4 py-16 relative bg-[#0D0E12]">
      {/* Background radial ambient glow matching design */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Sign In Card */}
      <div className="w-full max-w-[460px] bg-[#1E1F24] border border-[#2B2C33] rounded-[24px] p-8 sm:p-10 shadow-2xl relative z-10">
        {/* Title & Subtitle */}
        <h1 className="text-3xl font-bold text-white text-center tracking-tight mb-2">
          Sign In to MovieSeat
        </h1>
        <p className="text-sm text-gray-400 text-center leading-relaxed mb-8 max-w-xs mx-auto">
          Enter your registered credentials to access your booked seats and profile.
        </p>

        {/* Unverified Account Alert with shortcut */}
        {unverifiedEmail ? (
          <div className="mb-6 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Account not verified yet.</span>
            </div>
            <Link
              href={`/verify?email=${encodeURIComponent(unverifiedEmail)}`}
              className="text-amber-400 underline font-semibold hover:text-white shrink-0"
            >
              Verify now &rarr;
            </Link>
          </div>
        ) : error ? (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        {/* Form with autofill prevention hidden fields */}
        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          <input
            type="text"
            name="fake_username"
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            readOnly
          />
          <input
            type="password"
            name="fake_password"
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            readOnly
          />

          {/* Email Address */}
          <div>
            <label className="block text-[11px] font-semibold tracking-wider text-gray-400 uppercase font-mono mb-2">
              EMAIL ADDRESS
            </label>
            <div className="flex items-center bg-[#121316] border border-white/10 rounded-xl px-4 py-3 focus-within:border-amber-500/80 transition">
              <Mail className="w-4 h-4 text-gray-400 mr-3 shrink-0" />
              <input
                type="email"
                required
                value={email}
                readOnly={isReadOnly}
                onFocus={() => setIsReadOnly(false)}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.rivera@example.com"
                autoComplete="none"
                className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase font-mono">
                PASSWORD
              </label>
              <button
                type="button"
                onClick={() => alert("Password reset instructions will be sent to your registered email.")}
                className="text-xs text-amber-500 hover:text-amber-400 transition font-medium cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="flex items-center bg-[#121316] border border-white/10 rounded-xl px-4 py-3 focus-within:border-amber-500/80 transition">
              <Lock className="w-4 h-4 text-gray-400 mr-3 shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                readOnly={isReadOnly}
                onFocus={() => setIsReadOnly(false)}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="            "
                autoComplete="new-password"
                className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-200 ml-2 focus:outline-none cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-[#F59E0B] hover:bg-[#E58E00] text-black font-semibold text-sm py-3.5 px-4 rounded-xl transition duration-150 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to MovieSeat</span>
                <span className="text-base leading-none">&rarr;</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-amber-500 font-semibold hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
