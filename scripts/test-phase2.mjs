import assert from 'node:assert/strict';
import { generateOtpCode, hashOtpCode, verifyOtpHash } from '../src/lib/otp.js';
import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';

console.log('================================================================================');
console.log('                PHASE 2 AUTOMATED TEST SUITE: AUTH & OTP SECURITY               ');
console.log('================================================================================');

// 1. UNIT TESTS: OTP Generation and Cryptographic Verification
console.log('\n[Test 1] Testing 6-Digit OTP Generator & HMAC Verification...');

const testEmail = 'patron.test.' + Date.now() + '@example.com';
const code = generateOtpCode();

assert.equal(typeof code, 'string', 'OTP code must be a string');
assert.equal(code.length, 6, 'OTP code must be 6 digits');
assert.match(code, /^[0-9]{6}$/, 'OTP must consist of 6 numeric digits');
console.log('  ✓ Generated valid 6-digit numeric OTP: ' + code);

const hashed = hashOtpCode(testEmail, code);
assert.equal(typeof hashed, 'string', 'HMAC hash must be a string');
assert.equal(hashed.length, 64, 'HMAC-SHA256 hex digest must be 64 characters');
console.log('  ✓ Computed HMAC-SHA256 hash: ' + hashed.substring(0, 16) + '...');

const isValid = verifyOtpHash(testEmail, code, hashed);
assert.equal(isValid, true, 'Valid code must verify successfully');
console.log('  ✓ Correct code verified via timing-safe HMAC check');

const isInvalid = verifyOtpHash(testEmail, '000000', hashed);
assert.equal(isInvalid, false, 'Invalid code must be rejected');
console.log('  ✓ Incorrect code correctly rejected');

const isWrongEmail = verifyOtpHash('wrong@example.com', code, hashed);
assert.equal(isWrongEmail, false, 'Mismatched email must be rejected');
console.log('  ✓ Mismatched email correctly rejected');

// 2. INTEGRATION TESTS: Supabase DB & Admin Client
console.log('\n[Test 2] Testing Supabase Database Connection & otp_codes Table...');

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
for (const line of envContent.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const idx = trimmed.indexOf('=');
    if (idx !== -1) {
      env[trimmed.substring(0, idx).trim()] = trimmed.substring(idx + 1).trim();
    }
  }
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

assert.ok(supabaseUrl, 'NEXT_PUBLIC_SUPABASE_URL must be configured');
assert.ok(serviceKey, 'SUPABASE_SERVICE_ROLE_KEY must be configured');

const admin = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Test insert into otp_codes
const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
const { data: inserted, error: insertErr } = await admin
  .from('otp_codes')
  .insert({
    email: testEmail,
    hashed_code: hashed,
    attempts: 0,
    resend_count: 1,
    last_sent_at: new Date().toISOString(),
    expires_at: expiresAt,
    verified: false,
  })
  .select()
  .single();

assert.ifError(insertErr);
assert.ok(inserted.id, 'OTP record must have an ID');
console.log('  ✓ Inserted test OTP record into otp_codes (ID: ' + inserted.id + ')');

// Test query from otp_codes
const { data: fetched, error: fetchErr } = await admin
  .from('otp_codes')
  .select('*')
  .eq('id', inserted.id)
  .single();

assert.ifError(fetchErr);
assert.equal(fetched.email, testEmail);
assert.equal(fetched.verified, false);
console.log('  ✓ Successfully queried and verified otp_codes record');

// 3. API ENDPOINT TESTS (via localhost:3001)
console.log('\n[Test 3] Testing Live Next.js Authentication API Routes...');

const baseUrl = 'http://localhost:3001';
const candidateEmail = 'qa.alex.' + Date.now() + '@example.com';
const candidatePassword = 'MovieSeatPassword123!';
const candidateName = 'Alex Rivera';

// 3a. POST /api/auth/signup
console.log('  -> Testing /api/auth/signup...');
const signupRes = await fetch(baseUrl + '/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: candidateEmail,
    password: candidatePassword,
    full_name: candidateName,
  }),
});

assert.equal(signupRes.status, 200, 'Signup should return 200 OK');
const signupData = await signupRes.json();
assert.equal(signupData.success, true);
assert.ok(signupData.devOtp, 'Development environment must return devOtp for automated test');
console.log('  ✓ User registered unverified: ' + candidateEmail);
console.log('  ✓ Dispatched OTP code: ' + signupData.devOtp);

// 3b. POST /api/auth/verify-otp with wrong code (Lockout attempt test)
console.log('  -> Testing /api/auth/verify-otp with incorrect code...');
const wrongRes = await fetch(baseUrl + '/api/auth/verify-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: candidateEmail,
    code: '000000',
  }),
});

assert.equal(wrongRes.status, 400, 'Wrong code should return 400 Bad Request');
const wrongData = await wrongRes.json();
assert.match(wrongData.error, /Invalid verification code/, 'Error message must warn about invalid code');
console.log('  ✓ Wrong code correctly rejected: ' + wrongData.error);

// 3c. POST /api/auth/verify-otp with correct code
console.log('  -> Testing /api/auth/verify-otp with correct code...');
const verifyRes = await fetch(baseUrl + '/api/auth/verify-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: candidateEmail,
    code: signupData.devOtp,
  }),
});

assert.equal(verifyRes.status, 200, 'Verification should return 200 OK');
const verifyData = await verifyRes.json();
assert.equal(verifyData.success, true);
console.log('  ✓ Account successfully verified: ' + verifyData.message);

// Verify that user is confirmed in Supabase
const { data: usersData } = await admin.auth.admin.listUsers();
const confirmedUser = usersData.users.find(u => u.email === candidateEmail);
assert.ok(confirmedUser, 'User must exist in auth.users');
assert.ok(confirmedUser.email_confirmed_at, 'User email must be confirmed');
console.log('  ✓ Verified auth.users confirmed status (confirmed_at: ' + confirmedUser.email_confirmed_at + ')');

// 3d. POST /api/auth/resend-otp Cooldown Test
console.log('  -> Testing /api/auth/resend-otp 60-second cooldown...');
const resendCooldownRes = await fetch(baseUrl + '/api/auth/resend-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: candidateEmail }),
});

assert.equal(resendCooldownRes.status, 429, 'Immediate resend must be rate-limited (429)');
const cooldownData = await resendCooldownRes.json();
console.log('  ✓ Cooldown rate-limit enforced: ' + cooldownData.error);

// Cleanup test records
await admin.from('otp_codes').delete().eq('email', testEmail);
await admin.from('otp_codes').delete().eq('email', candidateEmail);
if (confirmedUser) {
  await admin.auth.admin.deleteUser(confirmedUser.id);
  await admin.from('profiles').delete().eq('id', confirmedUser.id);
}
console.log('  ✓ Cleaned up test database records');

console.log('\n================================================================================');
console.log('               ALL PHASE 2 TESTS PASSED WITH 100% SUCCESS RATE                  ');
console.log('================================================================================');