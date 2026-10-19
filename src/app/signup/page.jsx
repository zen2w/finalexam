"use client";

import emailjs from "@emailjs/browser";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Eye, EyeOff, RotateCcw, AlertCircle } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setError("All fields marked with an asterisk are required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreed) {
      setError("You must agree to the Terms of Service and Theater House Rules to proceed.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      // Browser-side Dual Dispatch via EmailJS SDK
      if (data.devOtp) {
        try {
          await emailjs.send(
            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_eazawk8",
            process.env.NEXT_PUBLIC_EMAILJS_OTP_TEMPLATE_ID || "template_3qyzall",
            {
              to_email: email.trim().toLowerCase(),
              email: email.trim().toLowerCase(),
              user_email: email.trim().toLowerCase(),
              recipient: email.trim().toLowerCase(),
              reply_to: email.trim().toLowerCase(),
              to_name: fullName.trim(),
              user_name: fullName.trim(),
              otp_code: data.devOtp,
              code: data.devOtp,
              code_1: String(data.devOtp)[0] || "",
              code_2: String(data.devOtp)[1] || "",
              code_3: String(data.devOtp)[2] || "",
              code_4: String(data.devOtp)[3] || "",
              code_5: String(data.devOtp)[4] || "",
              code_6: String(data.devOtp)[5] || "",
              expiry_minutes: "5",
              expires_in: "5",
              current_year: String(new Date().getFullYear()),
              message: `Your MovieSeat verification code is ${data.devOtp}. Valid for 5 minutes.`,
            },
            process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "5EbETUO7A8SUC3ma4"
          );
          console.log("[Client EmailJS] Successfully dispatched code from browser to:", email);
        } catch (clientEmailErr) {
          console.warn("[Client EmailJS] Browser dispatch notice:", clientEmailErr);
        }
      }

      router.push(`/verify?email=${encodeURIComponent(email.trim().toLowerCase())}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex-1 flex items-center justify-center px-4 py-12 relative bg-[#0D0E12]">
      {/* Background ambient radial glow matching MovieSeat-CreateanAccount.png */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[520px] h-[520px] bg-amber-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Card matching MovieSeat-CreateanAccount.png */}
      <div className="w-full max-w-[500px] bg-[#18191E] border border-[#2B2C33] rounded-[24px] p-8 sm:p-10 shadow-2xl relative z-10">
        <h1 className="text-3xl font-bold text-white text-center tracking-tight mb-2">
          Create your MovieSeat Account
        </h1>
        <p className="text-sm text-gray-400 text-center leading-relaxed mb-8 max-w-sm mx-auto">
          Join MovieSeat to reserve seats faster, track digital tickets, and access your booking history.
        </p>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-semibold tracking-wider text-gray-400 uppercase font-mono mb-2">
              FULL NAME <span className="text-[#F59E0B]">*</span>
            </label>
            <div className="flex items-center bg-[#101115] border border-white/10 rounded-xl px-4 py-3 focus-within:border-amber-500/80 transition">
              <User className="w-4 h-4 text-gray-400 mr-3 shrink-0" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Rivera"
                className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-[11px] font-semibold tracking-wider text-gray-400 uppercase font-mono mb-2">
              EMAIL ADDRESS <span className="text-[#F59E0B]">*</span>
            </label>
            <div className="flex items-center bg-[#101115] border border-white/10 rounded-xl px-4 py-3 focus-within:border-amber-500/80 transition">
              <Mail className="w-4 h-4 text-gray-400 mr-3 shrink-0" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.rivera@example.com"
                className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-semibold tracking-wider text-gray-400 uppercase font-mono mb-2">
              PASSWORD <span className="text-[#F59E0B]">*</span>
            </label>
            <div className="flex items-center bg-[#101115] border border-white/10 rounded-xl px-4 py-3 focus-within:border-amber-500/80 transition">
              <Lock className="w-4 h-4 text-gray-400 mr-3 shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-200 ml-2 focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[11px] font-semibold tracking-wider text-gray-400 uppercase font-mono mb-2">
              CONFIRM PASSWORD <span className="text-[#F59E0B]">*</span>
            </label>
            <div className="flex items-center bg-[#101115] border border-white/10 rounded-xl px-4 py-3 focus-within:border-amber-500/80 transition">
              <RotateCcw className="w-4 h-4 text-gray-400 mr-3 shrink-0" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray-400 hover:text-gray-200 ml-2 focus:outline-none cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Terms Agreement Checkbox matching design */}
          <div className="flex items-start gap-2.5 pt-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-4 h-4 rounded bg-[#101115] border border-white/20 text-[#F59E0B] accent-[#F59E0B] focus:ring-0 cursor-pointer"
            />
            <label htmlFor="terms" className="text-xs text-gray-400 leading-relaxed cursor-pointer select-none">
              I agree to the <span className="text-[#F59E0B] hover:underline">Terms of Service</span>, <span className="text-[#F59E0B] hover:underline">Theater House Rules</span>, and consent to digital processing under the <span className="text-[#F59E0B] hover:underline">Privacy Policy</span>.
            </label>
          </div>

          {/* Create Account Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-[#F59E0B] hover:bg-[#E58E00] text-black font-semibold text-sm py-3.5 px-4 rounded-xl transition duration-150 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Create Account</span>
                <span className="text-base leading-none">&rarr;</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Already have an account?{" "}
          <Link href="/signin" className="text-[#F59E0B] font-semibold hover:underline">
            Sign In &rarr;
          </Link>
        </p>
      </div>
    </div>
  );
}
