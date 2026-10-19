import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { verifyOtpHash } from "@/lib/otp";

export async function POST(request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: "Email and 6-digit code are required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();
    const admin = getSupabaseAdminClient();

    // 1. Fetch latest active OTP row for this email
    const { data: otpRows, error: fetchErr } = await admin
      .from("otp_codes")
      .select("*")
      .eq("email", cleanEmail)
      .eq("verified", false)
      .order("created_at", { ascending: false })
      .limit(1);

    if (fetchErr || !otpRows || otpRows.length === 0) {
      return NextResponse.json(
        { error: "No active verification code found. Please request a new code." },
        { status: 404 }
      );
    }

    const otpRecord = otpRows[0];

    // 2. Check 5-attempt lockout
    if (otpRecord.attempts >= 5) {
      return NextResponse.json(
        { error: "Too many failed attempts. This code is locked. Please request a new code." },
        { status: 429 }
      );
    }

    // 3. Check 5-minute expiry
    if (new Date(otpRecord.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "Verification code has expired. Please request a new code." },
        { status: 410 }
      );
    }

    // 4. Timing-safe cryptographic hash comparison
    const isValid = verifyOtpHash(cleanEmail, cleanCode, otpRecord.hashed_code);

    if (!isValid) {
      await admin
        .from("otp_codes")
        .update({ attempts: otpRecord.attempts + 1 })
        .eq("id", otpRecord.id);

      const remainingAttempts = 5 - (otpRecord.attempts + 1);
      return NextResponse.json(
        {
          error: `Invalid verification code. ${remainingAttempts} attempts remaining.`,
        },
        { status: 400 }
      );
    }

    // 5. Success! Mark OTP as verified
    await admin
      .from("otp_codes")
      .update({ verified: true })
      .eq("id", otpRecord.id);

    // 6. Confirm user in Supabase Auth
    const { data: userList } = await admin.auth.admin.listUsers();
    const user = userList?.users?.find((u) => u.email?.toLowerCase() === cleanEmail);

    if (user) {
      await admin.auth.admin.updateUserById(user.id, {
        email_confirm: true,
      });

      // Update public.profiles table
      await admin
        .from("profiles")
        .update({ is_verified: true, updated_at: new Date().toISOString() })
        .eq("id", user.id);
    }

    return NextResponse.json({
      success: true,
      message: "Account verified successfully! You can now sign in.",
    });
  } catch (error) {
    console.error("[Verify OTP Route] Exception:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
