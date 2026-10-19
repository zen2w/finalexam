import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runTests() {
  console.log("================================================================================");
  console.log("                   PHASE 6: DIGITAL TICKET & PDF GENERATION TEST                ");
  console.log("================================================================================");

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
    }
  }

  // 1. Fetch an existing reservation
  const { data: reservations, error: resErr } = await supabase
    .from('reservations')
    .select(`
      id,
      reference_code,
      customer_name,
      total_amount,
      showtime:showtimes (
        movie:movies (title),
        auditorium:auditoriums (name)
      ),
      reservation_seats (
        seat:seats (seat_label)
      )
    `)
    .limit(1);

  assert(!resErr && reservations?.length > 0, `Found existing confirmed reservation in Supabase: ${reservations?.[0]?.reference_code}`);
  const res = reservations[0];

  assert(res.reference_code?.startsWith('MS-'), `Reference code format verified: ${res.reference_code}`);
  assert(res.showtime?.movie?.title, `Linked movie title verified: ${res.showtime?.movie?.title}`);
  assert(res.reservation_seats?.length > 0, `Allocated seats verified: ${res.reservation_seats.map(rs => rs.seat?.seat_label).join(', ')}`);

  // 2. Test PDF Route endpoint via HTTP GET
  const pdfUrl = `http://localhost:3001/api/reservations/${res.id}/pdf`;
  console.log(`Testing PDF API endpoint: ${pdfUrl}`);

  try {
    const response = await fetch(pdfUrl);
    assert(response.status === 200, `PDF endpoint responded with HTTP ${response.status}`);
    
    const contentType = response.headers.get('content-type');
    assert(contentType?.includes('application/pdf'), `Content-Type verified as application/pdf (got: ${contentType})`);

    const disposition = response.headers.get('content-disposition');
    assert(disposition?.includes('MovieSeat-Ticket-'), `Content-Disposition header includes filename with reference code`);

    const buffer = Buffer.from(await response.arrayBuffer());
    assert(buffer.length > 1000, `Generated PDF buffer size: ${buffer.length} bytes`);

    const pdfHeader = buffer.subarray(0, 5).toString('utf-8');
    assert(pdfHeader === '%PDF-', `PDF signature header verified: ${pdfHeader}`);
  } catch (err) {
    console.error("PDF Route Fetch Error:", err);
    assert(false, "Failed to fetch PDF endpoint");
  }

  // 3. Test PDF generation by reference code (MS-xxxx)
  const refPdfUrl = `http://localhost:3001/api/reservations/${res.reference_code}/pdf`;
  try {
    const responseRef = await fetch(refPdfUrl);
    assert(responseRef.status === 200, `PDF endpoint by reference code ${res.reference_code} responded with HTTP 200`);
    const bufRef = Buffer.from(await responseRef.arrayBuffer());
    assert(bufRef.subarray(0, 5).toString('utf-8') === '%PDF-', `Reference-based PDF signature verified`);
  } catch (err) {
    assert(false, "Failed to fetch PDF by reference code");
  }

  console.log("================================================================================");
  console.log(`RESULTS: ${passed}/${total} TESTS PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log("================================================================================");
}

runTests();
