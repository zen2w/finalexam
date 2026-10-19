import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { generateOtpCode, hashOtpCode } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/emailjs";

export async function POST(request) {
  try {
    const { email, password, full_name } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const admin = getSupabaseAdminClient();
    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists in auth.users
    const { data: userList } = await admin.auth.admin.listUsers();
    const existingUser = userList?.users?.find(
      (u) => u.email?.toLowerCase() === cleanEmail
    );

    let userId = null;

    if (existingUser) {
      // If user is already verified, block re-registration
      if (existingUser.email_confirmed_at) {
        return NextResponse.json(
          { error: "An account with this email already exists. Please sign in." },
          { status: 409 }
        );
      }

      // Unverified Account Recovery: Update password and send fresh OTP
      const { data: updated, error: updateErr } = await admin.auth.admin.updateUserById(
        existingUser.id,
        {
          password,
          user_metadata: { full_name: full_name || existingUser.user_metadata?.full_name || "" },
        }
      );

      if (updateErr) {
        return NextResponse.json({ error: updateErr.message }, { status: 500 });
      }
      userId = updated.user.id;
    } else {
      // Create new user (unconfirmed)
      const { data: newUser, error: createErr } = await admin.auth.admin.createUser({
        email: cleanEmail,
        password,
        email_confirm: false,
        user_metadata: { full_name: full_name || "" },
      });

      if (createErr) {
        return NextResponse.json({ error: createErr.message }, { status: 500 });
      }
      userId = newUser.user.id;
    }

    // Generate 6-digit OTP & HMAC-SHA256 hash
    const otpCode = generateOtpCode();
    const hashedCode = hashOtpCode(cleanEmail, otpCode);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // Store in public.otp_codes table
    const { error: otpDbErr } = await admin.from("otp_codes").insert({
      email: cleanEmail,
      hashed_code: hashedCode,
      attempts: 0,
      resend_count: 1,
      last_sent_at: new Date().toISOString(),
      expires_at: expiresAt,
      verified: false,
    });

    if (otpDbErr) {
      console.error("[SignUp Route] Error storing OTP in DB:", otpDbErr);
    }

    // Dispatch OTP email via EmailJS (non-blocking for resilience)
    sendOtpEmail({
      to_email: cleanEmail,
      to_name: full_name || "MovieSeat Patron",
      otp_code: otpCode,
      expires_in: 5,
    }).catch((err) => console.error("[SignUp Route] EmailJS error:", err));

    return NextResponse.json({
      success: true,
      message: "Verification code sent to your email",
      email: cleanEmail,
      devOtp: process.env.NODE_ENV !== "production" ? otpCode : undefined,
    });
  } catch (error) {
    console.error("[SignUp Route] Exception:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
