import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { generateOtpCode, hashOtpCode } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/emailjs";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const admin = getSupabaseAdminClient();

    // Fetch latest OTP row
    const { data: otpRows } = await admin
      .from("otp_codes")
      .select("*")
      .eq("email", cleanEmail)
      .order("created_at", { ascending: false })
      .limit(1);

    if (otpRows && otpRows.length > 0) {
      const lastOtp = otpRows[0];

      // Rate limit 1: 60-second cooldown
      const secondsSinceLast = (Date.now() - new Date(lastOtp.last_sent_at).getTime()) / 1000;
      if (secondsSinceLast < 60) {
        const waitSec = Math.ceil(60 - secondsSinceLast);
        return NextResponse.json(
          { error: `Please wait ${waitSec}s before requesting a new code.` },
          { status: 429 }
        );
      }

      // Rate limit 2: Max 5 resends per hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { count } = await admin
        .from("otp_codes")
        .select("*", { count: "exact", head: true })
        .eq("email", cleanEmail)
        .gte("created_at", oneHourAgo);

      if (count && count >= 5) {
        return NextResponse.json(
          { error: "Too many resend attempts. Please wait an hour before trying again." },
          { status: 429 }
        );
      }
    }

    // Generate new code
    const newCode = generateOtpCode();
    const newHash = hashOtpCode(cleanEmail, newCode);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    await admin.from("otp_codes").insert({
      email: cleanEmail,
      hashed_code: newHash,
      attempts: 0,
      resend_count: (otpRows?.[0]?.resend_count || 0) + 1,
      last_sent_at: new Date().toISOString(),
      expires_at: expiresAt,
      verified: false,
    });

    sendOtpEmail({
      to_email: cleanEmail,
      otp_code: newCode,
      expires_in: 5,
    }).catch((err) => console.error("[Resend OTP] EmailJS error:", err));

    return NextResponse.json({
      success: true,
      message: "A fresh verification code has been dispatched to your email.",
      devOtp: process.env.NODE_ENV !== "production" ? newCode : undefined,
    });
  } catch (error) {
    console.error("[Resend OTP Route] Exception:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
