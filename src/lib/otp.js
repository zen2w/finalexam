import crypto from "crypto";

const OTP_SECRET = process.env.OTP_HMAC_SECRET || "fallback-secret-minimum-32-chars-long-123456";

/**
 * Generates a cryptographically secure 6-digit numeric OTP
 */
export function generateOtpCode() {
  const num = crypto.randomInt(100000, 999999);
  return String(num);
}

/**
 * Computes an HMAC-SHA256 hex hash of the OTP code and email
 */
export function hashOtpCode(email, code) {
  return crypto
    .createHmac("sha256", OTP_SECRET)
    .update(`${email.toLowerCase()}:${code}`)
    .digest("hex");
}

/**
 * Timing-safe comparison to prevent side-channel timing attacks
 */
export function verifyOtpHash(email, inputCode, storedHash) {
  const computedHash = hashOtpCode(email, inputCode);
  const bufA = Buffer.from(computedHash, "hex");
  const bufB = Buffer.from(storedHash, "hex");

  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}
