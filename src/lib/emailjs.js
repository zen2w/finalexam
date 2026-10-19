/**
 * Server-Side & Browser-Resilient EmailJS REST API Client
 */

export async function sendEmailJsRest({ templateId, templateParams }) {
  const serviceId = process.env.EMAILJS_SERVICE_ID || process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_eazawk8";
  const publicKey = process.env.EMAILJS_PUBLIC_KEY || process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "5EbETUO7A8SUC3ma4";
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.warn("[EmailJS] Missing credentials. Dispatch skipped.");
    return { success: false, error: "Missing EmailJS credentials" };
  }

  const recipientEmail = templateParams.to_email || templateParams.email || templateParams.user_email || "";
  const recipientName = templateParams.to_name || templateParams.user_name || templateParams.name || "MovieSeat Patron";

  const rawCode = String(templateParams.otp_code || templateParams.code || "");
  const digits = rawCode.padEnd(6, "0").split("");
  const expiryMins = String(templateParams.expiry_minutes || templateParams.expires_in || "5");
  const currentYear = String(new Date().getFullYear());

  const enrichedParams = {
    ...templateParams,
    // Recipient aliases
    to_email: recipientEmail,
    email: recipientEmail,
    user_email: recipientEmail,
    recipient: recipientEmail,
    reply_to: recipientEmail,
    to_name: recipientName,
    user_name: recipientName,
    name: recipientName,

    // Full OTP code aliases
    otp_code: rawCode,
    code: rawCode,

    // 6-digit individual box variables
    code_1: digits[0] || "",
    code_2: digits[1] || "",
    code_3: digits[2] || "",
    code_4: digits[3] || "",
    code_5: digits[4] || "",
    code_6: digits[5] || "",

    // Expiry aliases
    expiry_minutes: expiryMins,
    expires_in: expiryMins,

    // Date & copyright
    current_year: currentYear,
    message: `Your MovieSeat verification code is ${rawCode}. Valid for ${expiryMins} minutes.`,
  };

  const payload = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: enrichedParams,
  };

  // Only attach accessToken if it's a dedicated private key distinct from the public key
  if (privateKey && privateKey !== publicKey) {
    payload.accessToken = privateKey;
  }

  try {
    const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": origin,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[EmailJS REST] Failed with status:", res.status, errText);
      return { success: false, error: errText };
    }

    console.log(`[EmailJS REST] Successfully dispatched OTP email to ${recipientEmail} (Status 200)`);
    return { success: true };
  } catch (error) {
    console.error("[EmailJS REST] Exception:", error);
    return { success: false, error: error.message };
  }
}

export async function sendOtpEmail({ to_email, to_name, otp_code, expires_in = 5 }) {
  const templateId = process.env.EMAILJS_OTP_TEMPLATE_ID || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_3qyzall";
  
  console.log("================================================================================");
  console.log(`[MOVIESEAT OTP DISPATCH] Recipient: ${to_email} | CODE: ${otp_code} | Valid: ${expires_in}m`);
  console.log("================================================================================");

  return sendEmailJsRest({
    templateId,
    templateParams: {
      to_email,
      to_name: to_name || "MovieSeat Patron",
      otp_code,
      expires_in: String(expires_in),
      expiry_minutes: String(expires_in),
    },
  });
}
