import { sendOtpEmail } from '../src/lib/emailjs.js';

async function test() {
  console.log("Calling sendOtpEmail for jonhpaulfeliciano2@gmail.com...");
  const res = await sendOtpEmail({
    to_email: 'jonhpaulfeliciano2@gmail.com',
    to_name: 'John Paul',
    otp_code: '581060',
    expires_in: 5,
  });
  console.log("Result:", res);
}

test();
