import crypto from 'crypto';
import dotenv from 'dotenv';

const targetHash = '6e9e81b40c9ce8e39f695c412c116400d90ecff167ee7c4c6d719b958dfc0e75';
const secret = process.env.OTP_SECRET || 'movieseat_production_otp_secret_key_2026_super_secure';

console.log("Checking OTP with secret:", secret ? "Loaded" : "Missing");

for (let i = 100000; i <= 999999; i++) {
  const code = String(i);
  const h = crypto.createHmac('sha256', secret).update(code).digest('hex');
  if (h === targetHash) {
    console.log("FOUND OTP CODE FOR USER:", code);
    break;
  }
}
