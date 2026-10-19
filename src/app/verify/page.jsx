"use client";

import emailjs from "@emailjs/browser";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Clock, Mail, Check, RotateCw, AlertCircle, CheckCircle2, Info } from "lucide-react";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [email] = useState(emailParam || "alex.rivera@example.com");
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [timeLeft, setTimeLeft] = useState(300);
  const [resendCooldown, setResendCooldown] = useState(48);

  const inputsRef = useRef([]);

  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const cooldownTimer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(cooldownTimer);
  }, [resendCooldown]);

  const handleDigitChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim().replace(/[^0-9]/g, "");
    if (pasted.length === 6) {
      const arr = pasted.split("");
      setDigits(arr);
      inputsRef.current[5]?.focus();
    }
  };

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setSuccessMsg("");

    const code = digits.join("");
    if (code.length !== 6) {
      setError("Please enter all 6 digits of your verification code.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to verify code");
      }

      setSuccessMsg("Account verified! Redirecting to sign in...");
      setTimeout(() => {
        router.push("/signin?verified=true");
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || resending) return;
    setError("");
    setSuccessMsg("");
    setResending(true);

    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to resend code");
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
              to_name: "MovieSeat Patron",
              user_name: "MovieSeat Patron",
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
          console.log("[Client EmailJS] Resend successfully dispatched from browser to:", email);
        } catch (clientEmailErr) {
          console.warn("[Client EmailJS] Browser resend dispatch notice:", clientEmailErr);
        }
      }

      setSuccessMsg("A fresh verification code has been dispatched to your email.");
      setResendCooldown(60);
      setTimeLeft(300);
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  const expiryMin = Math.floor(timeLeft / 60);
  const expirySec = timeLeft % 60;
  const expiryDisplay = `${String(expiryMin).padStart(2, "0")}:${String(expirySec).padStart(2, "0")}`;

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center px-4 py-12 relative bg-[#0D0E12]">
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[140px]" />
      </div>

      <div className="w-full max-w-[480px] relative z-10">
        {/* Back to Sign In Link matching screenshot */}
        <div className="mb-4">
          <Link
            href="/signin"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>

        {/* Card Container */}
        <div className="bg-[#1E1F24] border border-[#2B2C33] rounded-[24px] p-8 sm:p-10 shadow-2xl">
          {/* Glowing Icon with Checkmark Badge matching MovieSeat-AccountVerify.png */}
          <div className="flex justify-center mb-5">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-[#25231F] border border-amber-500/40 shadow-lg shadow-amber-500/20 flex items-center justify-center text-[#F59E0B]">
                <Mail className="w-6 h-6" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F59E0B] flex items-center justify-center text-black text-[10px] font-bold">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
            </div>
          </div>

          {/* Heading & Subtitle */}
          <h1 className="text-3xl font-bold text-white text-center tracking-tight mb-2">
            Verify Your Email
          </h1>
          <p className="text-sm text-gray-400 text-center leading-relaxed mb-6 max-w-sm mx-auto">
            We've dispatched a 6-digit verification code to{" "}
            <span className="text-[#F59E0B] font-medium">{email}</span> to activate your MovieSeat perks.
          </p>

          {/* Alerts */}
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {successMsg && (
            <div className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 6 Digit Input Boxes (3 - 3 layout) matching MovieSeat-AccountVerify.png */}
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex items-center justify-center gap-2 sm:gap-2.5" onPaste={handlePaste}>
              {/* First 3 digits */}
              {digits.slice(0, 3).map((digit, index) => (
                <div key={index} className="relative">
                  <input
                    ref={(el) => (inputsRef.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 bg-[#111215] border border-white/10 rounded-xl text-center text-xl font-bold font-mono text-[#F59E0B] focus:outline-none focus:border-amber-500 transition shadow-inner"
                  />
                  {!digit && (
                    <span className="absolute inset-0 flex items-center justify-center text-gray-600 text-lg pointer-events-none">
                      &bull;
                    </span>
                  )}
                </div>
              ))}

              {/* Separator Dash */}
              <span className="text-gray-500 font-bold px-0.5">-</span>

              {/* Last 3 digits */}
              {digits.slice(3, 6).map((digit, idx) => {
                const index = idx + 3;
                return (
                  <div key={index} className="relative">
                    <input
                      ref={(el) => (inputsRef.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-14 bg-[#111215] border border-white/10 rounded-xl text-center text-xl font-bold font-mono text-[#F59E0B] focus:outline-none focus:border-amber-500 transition shadow-inner"
                    />
                    {!digit && (
                      <span className="absolute inset-0 flex items-center justify-center text-gray-600 text-lg pointer-events-none">
                        &bull;
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Expiry Timer matching screenshot */}
            <div className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5 text-gray-500" />
              <span>Code expires in</span>
              <span className="text-gray-200 font-semibold">{expiryDisplay}</span>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={loading || digits.join("").length !== 6}
              className="w-full bg-[#F59E0B] hover:bg-[#E58E00] text-black font-semibold text-sm py-3.5 px-4 rounded-xl transition duration-150 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Verify Email & Continue</span>
                  <span className="text-base leading-none">&rarr;</span>
                </>
              )}
            </button>
          </form>

          {/* Resend Action Row matching screenshot */}
          <div className="flex items-center justify-between text-xs text-gray-400 mt-4 px-1">
            <span>Didn't get the code?</span>
            {resendCooldown > 0 ? (
              <span className="text-[#F59E0B] font-medium flex items-center gap-1">
                <RotateCw className="w-3 h-3 animate-spin" />
                Resend in 0:{String(resendCooldown).padStart(2, "0")}
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-[#F59E0B] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RotateCw className={`w-3 h-3 ${resending ? "animate-spin" : ""}`} />
                <span>Resend Code</span>
              </button>
            )}
          </div>

          {/* Spam / Promotions tip matching screenshot */}
          <div className="bg-[#121316] border border-white/5 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-gray-400 mt-6">
            <Info className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Check your spam or promotions folder if the email doesn't appear within 2 minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center text-[#F59E0B]">Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
