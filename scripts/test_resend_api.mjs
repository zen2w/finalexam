async function testResend() {
  const email = "jonhpaulfeliciano2@gmail.com";
  console.log("Calling /api/auth/resend-otp for", email);
  try {
    const res = await fetch("http://localhost:3001/api/auth/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    console.log("Status:", res.status, "Body:", data);
  } catch (e) {
    console.error("Error:", e);
  }
}

testResend();
