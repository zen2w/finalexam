const serviceId = "service_eazawk8";
const templateId = "template_3qyzall";
const publicKey = "5EbETUO7A8SUC3ma4";

async function testEmail() {
  const targetEmail = "jonhpaulfeliciano2@gmail.com";
  
  const payload = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: {
      to_email: targetEmail,
      email: targetEmail,
      user_email: targetEmail,
      recipient: targetEmail,
      reply_to: targetEmail,
      to_name: "John Paul",
      user_name: "John Paul",
      name: "John Paul",
      otp_code: "581060",
      code: "581060",
      expires_in: "5",
      message: "Your MovieSeat verification code is 581060. Valid for 5 minutes.",
    },
  };

  try {
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "http://localhost:3001",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      body: JSON.stringify(payload),
    });

    console.log("Status:", res.status);
    const txt = await res.text();
    console.log("Response:", txt);
  } catch (err) {
    console.error("Error:", err);
  }
}

testEmail();
