# MovieSeat Final Plan Challenge

**Contents:** Instructions · Part 1 baseline Master Plan · Part 2 Final Plan questions · Part 3 stress scenarios · Part 4 Final Plan template · Part 5 Final Plan completion criteria · Part 6 Master Plan questions · Part 7 Master Plan template · Part 8 Master Plan completion criteria.

---

# INSTRUCTIONS

## For students

**Flow:** instructor workflow discussion → fill in Workflow Notes → **Stage 1** grill session → Final Plan → instructor approval → **Stage 2** grill session → Master Plan → defense → implementation.

**Stage 1:** write a Final Plan for MovieSeat as in Part 1 (no new features). Show you understand the workflow, place every rule in the right layer with a reason, find gaps in Part 1, and plan tests and build order.
**Stage 2:** write a Master Plan from the approved Final Plan. Every item must trace to it.

**Rules**
1. Answer in your own words. Give reasons. No code before approval.
2. Part 1 may contain mistakes. Rules belong in the database and server first.
3. **The agent only asks. It recommends nothing in either stage** (no suggestions, options, hints, tools, libraries, versions, folders, names or phase order). If it does, or praises or criticizes a choice, type: `Violation. Retract and re-ask.`
4. Keep real project code, tests and instructor files out of the agent's workspace.
5. You must defend both plans without the agent.

**Deliverables:** Workflow Notes, Decision Log, Final Plan, Master Plan, Open Items.

## Starter prompt (set Stage to 1 or 2)

```
Use the grill-me skill with these overrides: recommend NOTHING (no recommended answers,
suggestions, options, examples, hints, opinions, or tool/library/version/folder/name/order
advice). Ask only.
Read this whole file and follow "Agent rules" exactly. Stage: <1 or 2>.
Use only Part 1, my words, and (Stage 2) my approved Final Plan and Decision Log.
Open no other file. No web. No code.
Restate the rules in 3 lines and wait for me to say "Ready."
<Stage 1: paste your Workflow Notes. Stage 2: say where your Final Plan and Decision Log are.>
```

## Agent rules

*Non-negotiable. They override the grill-me skill and your defaults, in both stages. If the skill says to give a recommended answer, suggestions or options, that is disabled.*

**R1 Role.** Interviewer only. Never recommend or steer. Never:
- give a recommended or suggested answer, or "what I would do";
- offer options, alternatives, menus, multiple choice, or pros and cons;
- say "you might consider", "a common approach", "best practice", "typically", "one way is";
- ask a leading question that contains the answer;
- give example answers ("for example");
- call a choice good, bad, risky, safe, right or wrong; reply only "Noted.";
- fill gaps, fix, improve, or finish the student's sentence;
- name something the student left out;
- reveal or hint at *Must cover*;
- suggest tools, libraries, versions, folders, names or phase order.

If about to, ask a question instead.

**R2 Allowed.** Ask the question as written. Define a word. Name a Part 1 section to reread (name only). Re-ask the unanswered part in the question's own words. Use one neutral probe: "Why?" / "What happens next?" / "What happens when that fails?" / "Walk me through a concrete example (named person, seat, time)." / "What did you reject, and why?" / "How would you know that works?" Quote two conflicting statements and ask the student to resolve them (do not say which is right). Show the Decision Log.

**R3 Help requests.**
- "Recommend / best / which tool, order, name / what am I missing?" → "I can't recommend or suggest anything. It's your decision. What do you choose, and why?"
- "Give me options" → "I can't list options. Name yours and I'll log them."
- "I don't know" → 1st: "Reread <Part 1 section>, then say what you do understand." 2nd: re-ask in simpler words (no answer, no options). 3rd: mark OPEN, move on.
- "Is this right?" → "I only check that every part of the question is answered." Quote any unanswered part.
- "Write it for me" → "It must come from your answers. Next question."
- Answer sounds copied → concrete-example probe.

**R4 Sources.** Use only Part 1, the student's words, and (Stage 2) the approved Final Plan and Decision Log. Do not open or search any other file; no web. If you notice answer, source, test or instructor-key files, tell the student to ask the instructor to remove them, and do not open them. No code. Create or update only the Decision Log and the stage's output file.

**R5 Start.** Restate these rules in 3 lines ("I will not recommend or suggest anything") and wait for "Ready." Stage 2: first ask "Has your instructor approved your Final Plan?" If not, stop.

**R6 Order.** One question at a time. Stage 1: Part 2 (Branch 0 to 13), then Part 3. Stage 2: Part 6 (M1 to M8). Ask every Core question. Ask Deep questions at least for Branches 2, 5, 9, 10, and elsewhere as time allows.

**R7 Check.** Silently compare each answer with *Must cover*. Say only "Complete" or "Incomplete" (completeness, not quality). If incomplete, re-ask only the unanswered part. Maximum 3 attempts, then mark OPEN.

**R8 Conflicts.** If an answer conflicts with Part 1 or an earlier decision (Stage 2: the Final Plan), quote both and ask the student to resolve it. If the student changes a Final Plan decision, log a revision with their reason. Never edit the Final Plan yourself.

**R9 Decision Log.** After each Complete answer record: ID | question | student's decision in their words | reason | alternatives *the student* named. If none, ask once "What did you reject, and why?", then write "none named". Never add alternatives. Show the log on request and after each branch. Stage 2: also keep a traceability list (Master Plan item → source: Final Plan section, Decision ID, or this stage's answer).

**R10 No inventing.** Do not supply phase, file, folder or library names, versions, numbers or statuses the student did not give. Leave unresolved items OPEN. Stage 2 phase status is PLANNED.

**R11 Split sessions.** In a later session, ask the student to paste the latest Decision Log (and traceability list).

**R12 Finish.**
1. **Provenance audit:** show every Decision Log entry (Stage 2: traceability list). The student confirms each is their own. Remove any that are not.
2. Show the completion criteria (Part 5 or Part 8) marked done or not done, and the OPEN items.
3. Write the output (Stage 1: Part 4 template; Stage 2: Part 7 template) only from the log or traceability list. Add no ideas, improvements, recommendations or next steps.
4. Read back section by section. Change only what the student says.

**R13 If a rule is broken** (student types "Violation. Retract and re-ask." or you notice): say "I broke the no-recommendation rule. I retract that." Remove its influence from the log. Re-ask neutrally.

**R14 Tone.** Short, plain, neutral. No cheering or lecturing.

## Workflow Notes template (fill in after the instructor's discussion)

```
Journeys (trigger → steps, who does what → end state → what can go wrong):
 sign-up and verify | browse | hold seats | checkout | ticket and PDF | find and cancel | daily schedule and reseed
Instructor stressed: 1.  2.  3.
Not understood: 1.  2.
```

---

# PART 1: BASELINE MASTER PLAN

*The document below is unchanged.*

---

# MovieSeat: Master Implementation Plan & Architecture Guide
**Single-Cinema Real-Time Movie & Seat Reservation Web Application**

> **Document Status:** Comprehensive Master Reference (Phases 0 through 8 Complete)  
> **Repository Root:** `movieseat/movieseat`  
> **Core Stack:** Next.js 16.4 (App Router, Turbopack, React 19.3) · Tailwind CSS 4 · Supabase (Auth, Postgres, Realtime) · EmailJS (Server-side REST API) · TMDB API · `@react-pdf/renderer`

---

## Table of Contents
1. [Executive Summary & System Architecture](#1-executive-summary--system-architecture)
2. [UI Design System & Screen Specifications](#2-ui-design-system--screen-specifications)
3. [Phase-by-Phase Implementation & Changelog (Phase 0 – Phase 8)](#3-phase-by-phase-implementation--changelog)
   - [Phase 0: Database, Schema & External Services](#phase-0-database-schema--external-services)
   - [Phase 1: Foundation, Design System & Layout](#phase-1-foundation-design-system--layout)
   - [Phase 2: Authentication & OTP Security](#phase-2-authentication--otp-security)
   - [Phase 3: Now Showing Catalog & Auto-Reseed](#phase-3-now-showing-catalog--auto-reseed)
   - [Phase 4: Interactive Seat Map, 5-Min Holds & Realtime](#phase-4-interactive-seat-map-5-min-holds--realtime)
   - [Phase 5: Order Summary, Checkout & Instant Confirmation](#phase-5-order-summary-checkout--instant-confirmation)
   - [Phase 6: Digital Reservation Ticket & PDF Generation](#phase-6-digital-reservation-ticket--pdf-generation)
   - [Phase 7: Find Reservation, Self-Service & Cancellation](#phase-7-find-reservation-self-service--cancellation)
   - [Phase 8: Mobile Polish, Turbopack Optimization & QA](#phase-8-mobile-polish-turbopack-optimization--qa)
4. [Security & Privacy Isolation Architecture](#4-security--privacy-isolation-architecture)
5. [Automated QA Verification Matrix](#5-automated-qa-verification-matrix)
6. [Complete Directory & Component Map](#6-complete-directory--component-map)
7. [Environment Configuration & Operations Guide](#7-environment-configuration--operations-guide)

---

## 1. Executive Summary & System Architecture

MovieSeat is a production-grade single-cinema reservation web application built for **Cinema City Hall**. Patrons can browse today's screenings, inspect real-time seat availability, hold seats exclusively for 5 minutes, checkout with simulated instant payment, download branded PDF tickets, and manage or cancel reservations up to 30 minutes before showtime.

```
                              BROWSER CLIENT (Next.js 16 / React 19)
               ┌─────────────────────────────────┴─────────────────────────────────┐
               │                                                                   │
       Public Data & Realtime                                              Secure Mutations & Auth
  (Supabase JS Client + Anon Key)                                         (Next.js Route Handlers)
   ├─ Reads: movies, showtimes, seats                                      ├─ /api/auth/signup (Admin Create)
   ├─ Realtime: seat_holds, reservation_seats                              ├─ /api/auth/verify-otp (HMAC Check)
   └─ Subscriptions: live availability sync                                ├─ /api/auth/resend-otp (Rate Limits)
                                                                           ├─ /api/reservations/confirm (RPC)
                                                                           ├─ /api/reservations/[id]/cancel
                                                                           └─ /api/reservations/[id]/pdf (React-PDF)
                                                                                   │
               ┌─────────────────────────────────┬─────────────────────────────────┘
               │                                 │
     SUPABASE POSTGRES ENGINE            EMAILJS REST API (Server Only)
   ├─ RLS + Security Invoker Views       ├─ OTP Template (Verification code)
   ├─ Partial Unique Index (No double-   └─ Booking Confirmation Template
   │   booking on reservation_seats)
   ├─ SECURITY DEFINER RPC Functions
   │   (hold, release, confirm, cancel)
   └─ Automated Reseed (reseed_today)
```

### Key Technical Decisions
| Domain | Architecture Decision | Rationale |
|---|---|---|
| **Framework** | Next.js 16.4 App Router + React 19.3 | Turbopack compilation, Partial Prerendering (PPR), `connection()` dynamic helpers, and `proxy.ts`. |
| **Database** | Supabase Postgres (Direct RPC writes only) | Zero direct client writes to booking tables. Engine-level concurrency locking via partial unique indexes. |
| **Auth** | Supabase Auth + EmailJS OTP (Hybrid) | Passwords securely hashed in Supabase Auth; public signups disabled; accounts verified via server-side HMAC OTP. |
| **Double Booking** | `seat_holds` (5m TTL) + Unique Partial Index | `UNIQUE(showtime_id, seat_id) WHERE status = 'reserved'` guarantees race conditions cannot corrupt seat state. |
| **Clock/Time** | `Asia/Manila` (UTC+8) | Strict timezone enforcement across showtimes, countdowns, and cancellation cutoff policies. |
| **Email Delivery** | EmailJS Server-Side REST | Responsive, dark-obsidian and gold cinema email templates for OTP verification and ticket confirmation. |

---

## 2. UI Design System & Screen Specifications

The UI conforms to high-fidelity design assets (`movieseat/uidesign/`):

1. **`MovieSeat-NowShowing.png` (Catalog)**:
   - Header: Popcorn logo, navigation pills (`Now Showing`, `Find Reservation`), cinema location tag (`Cinema City Hall`), Asia/Manila `LiveClock`, auth status button/avatar.
   - Auditorium filter bar with color-coded dot status indicators.
   - 2x2 Movie Cards: TMDB posters, rating/format badges, runtime, synopsis, showtime pills with prices, live seats-open badge, and "Select Screening" CTA.
2. **`MovieSear-ReservationForm.png` (Seat Map & Checkout)**:
   - Top breadcrumb info bar and double-booking lock advisory banner.
   - Curved glowing projection arc ("4K Dual Laser Projection Arc").
   - 254-seat layout matrix: Cinema 1 (88 seats), Cinema 2 (102 seats), Cinema 3 (64 seats). Realistic aisle gaps, VIP Recliners row.
   - 4-state seat legend: Available, Selected (mine), Held (others), Reserved (sold).
   - Ticket Summary sidebar: price breakdown, waived booking fee (`FREE / PHP 0.00`), editable customer fields, simulated payment notice, glowing action button.
3. **`MovieSeat-ReservationTicket.png` (Digital Pass)**:
   - Reservation Confirmed banner with perforated ticket card (circular edge cutouts).
   - Movie poster thumbnail, sound & auditorium specs, allocated seat badges, total PHP.
   - Perforated stub with copyable Reference Code (`MS-YYYY-XXXXXX`), decorative barcode, Turnstile advisory.
   - Action buttons: "Print / Save Ticket (PDF)", "Lookup Anytime", "Book Another Movie", and Concession Guidelines card.
4. **`MovieSeat-FindReservation.png` (Self-Service)**:
   - Fast lookup query card (`#` prefix) querying `my_reservations`.
   - "Your Latest Reservation" rendered automatically.
   - Active, Cancelled, Expired, and Used status badges.
   - Quick-switch selector for multiple bookings.
   - Direct PDF download and 30-minute rule cancellation trigger.
5. **`MovieSeat-SignIn.png` & `MovieSeat-CreateanAccount.png` & `MovieSeat-AccountVerify.png`**:
   - Centered dark obsidian cards with gold accents, glowing ambient backdrops, toggle password visibility, 6-box OTP input with auto-advance and countdown timer.

---

## 3. Phase-by-Phase Implementation & Changelog

### Phase 0: Database, Schema & External Services
- **Status:** COMPLETED & VERIFIED
- **Core Deliverables:**
  - `supabase/schema.sql`: Full schema with 8 tables (`movies`, `auditoriums`, `seats`, `showtimes`, `showtime_templates`, `seat_holds`, `reservations`, `reservation_seats`), `otp_codes`, and `my_reservations` view.
  - Partial Unique Index: `CREATE UNIQUE INDEX unique_active_reservation_seat ON reservation_seats(showtime_id, seat_id) WHERE status = 'reserved';`
  - Realtime publication: Enabled on `seat_holds` and `reservation_seats`.
  - RPC Functions: `hold_seats`, `release_holds`, `confirm_reservation`, `cancel_reservation`, `reseed_today`, `generate_reservation_reference`.
  - `supabase/seed.sql`: 4 movies with TMDB IDs, 3 auditoriums, 254 seats, 13 showtimes.
- **Key Updates & Security Hardening:**
  - **RLS & Security Invoker View Fix:** The `my_reservations` view was hardened with `alter view public.my_reservations set (security_invoker = true)`. Verified table RLS `(user_id = auth.uid())` so no user can query another patron's reservations.
  - **Zero Client Direct Writes:** Disabled direct `INSERT`/`UPDATE`/`DELETE` for `anon` and `authenticated` roles on booking tables. All writes must go through `SECURITY DEFINER` RPC functions.
  - **EmailJS Responsive Templates:** Created web-based HTML templates (`email-templates/otp-template.html` and `email-templates/confirmation-template.html`) matching the cinema dark/gold theme with variables `{{to_name}}`, `{{otp_code}}`, `{{expires_in}}`, `{{movie_title}}`, `{{cinema}}`, `{{showtime}}`, `{{seats}}`, `{{total_amount}}`, and `{{reference_code}}`.

---

### Phase 1: Foundation, Design System & Layout
- **Status:** COMPLETED & VERIFIED
- **Core Deliverables:**
  - Next.js 16.4 convention check: created `proxy.ts` (replacing deprecated `middleware.ts`), updated to async Request APIs (`await params`, `await cookies()`).
  - Packages: `@supabase/ssr`, `@supabase/supabase-js`, `@react-pdf/renderer`, `lucide-react`.
  - Supabase client utilities: `lib/supabase/client.ts` (browser singleton), `server.ts` (async cookies), `admin.ts` (service role).
  - Time utilities: `lib/time.ts` (Asia/Manila time helpers).
  - Generated database types: `types/supabase.ts`.
  - Global CSS: `app/globals.css` with dark obsidian (`#0B0B0D`), card surfaces (`#15161B`), amber gold accents (`#F59E0B`), and custom scrollbars.
  - Chrome components: `Header.tsx` (Logo, Navigation Pills, Location badge, `LiveClock.tsx`, `UserMenu.tsx`) and `Footer.tsx`.
- **Key Updates & Bug Fixes:**
  - **LiveClock Loop:** Replaced continuous network polling with an initial server-sync drift offset followed by a 1-second client interval.
  - **Client Singleton:** Wrapped `createBrowserClient` in a singleton to prevent multiple GoTrue client instances in browser tabs.
  - **UserMenu Fast-Path Hydration:** Implemented instant `supabase.auth.getSession()` local check plus a 1.2s safety fallback timer to eliminate hanging skeleton loaders for guest users.

---

### Phase 2: Authentication & OTP Security
- **Status:** COMPLETED & VERIFIED
- **Core Deliverables:**
  - `lib/otp.ts`: 6-digit random code generator, HMAC-SHA256 hashing with server secret, timing-safe verification, 5-minute expiry, max 5 failed attempts lockout, 60s resend cooldown, max 5 resends/hour.
  - `lib/emailjs.ts`: Server-side REST API dispatch for OTP and booking confirmation.
  - API Routes: `/api/auth/signup`, `/api/auth/verify-otp`, `/api/auth/resend-otp`.
  - UI Screens: Create Account (`/signup`), Verify Email (`/verify`), Sign In (`/signin`).
- **Key Updates & Enhancements:**
  - **Unverified Account Recovery:** If an unverified user registers again, the server updates their password and sends a fresh OTP rather than throwing a duplicate error.
  - **Unverified Sign-In Prompt:** Unverified users attempting sign-in are shown an explicit "Account not verified" alert with a "Verify now" shortcut.
  - **Autofill Prevention on Sign-In:** Removed URL query prefilling, added dummy hidden fields, set `autoComplete="none"` and `autoComplete="new-password"`, and added a mount-delay `readOnly` toggle so input fields remain empty on page load.
  - Verified via `scripts/test-phase2.mjs`.

---

### Phase 3: Now Showing Catalog & Auto-Reseed
- **Status:** COMPLETED & VERIFIED
- **Core Deliverables:**
  - Main Catalog (`/`): Dynamic fetch from Supabase (today's showtimes in Asia/Manila time).
  - 2x2 Movie Card grid (`MovieCard.tsx`): TMDB artwork, rating/audio badges, runtime, synopsis, showtime pills with prices, live seats-open counter.
  - Auditorium Filter Bar (`AuditoriumFilter.tsx`): Filter by Cinema 1 (Dolby Atmos), Cinema 2 (IMAX Laser), Cinema 3 (Standard).
  - Past showtime handling: showtimes that have already started are disabled and dimmed.
- **Key Updates & Enhancements:**
  - **Auto-Reseed Resilience:** If today has no showtimes (e.g. past midnight), the catalog automatically triggers `reseed_today()` so the demo never displays empty screens.
  - **Next.js 16 Partial Prerendering:** Utilized `connection()` from `next/server` across dynamic routes.
  - Realtime seat counter synchronization via Supabase subscription.

---

### Phase 4: Interactive Seat Map, 5-Min Holds & Realtime
- **Status:** COMPLETED & VERIFIED
- **Core Deliverables:**
  - Screening Page (`/screenings/[showtimeId]`): Breadcrumb header, double-booking lock banner, curved glowing projection arc (`cinema-screen-glow`).
  - Seat Matrix (`SeatMatrix.tsx`): 254-seat physical layout, aisle spacing, row labels, VIP Recliner row styling.
  - 4 Seat States: Available, Selected (mine), Held (others), Reserved (sold).
  - 6-seat maximum selection cap.
  - 5-Minute Hold Protection: Calls `hold_seats` RPC, locks seats, displays live countdown based on database `expires_at`.
- **Key Updates & Enhancements:**
  - **Supabase Realtime Channel:** Subscribed to `seat_holds` and `reservation_seats` with automatic reconnect logic to synchronize holds across browsers within milliseconds.
  - **Guest Auth Modal (`GuestAuthModal.tsx`):** Guests can freely explore seat layouts; attempting to hold a seat displays a modal explaining the 5-minute hold lock and seamlessly preserves redirect parameters (`?redirect=/screenings/[id]`).

---

### Phase 5: Order Summary, Checkout & Instant Confirmation
- **Status:** COMPLETED & VERIFIED
- **Core Deliverables:**
  - Ticket Summary Sidebar (`TicketSummarySidebar.tsx`): Seat list, base ticket cost (standard vs VIP), waived booking fee (`FREE / PHP 0.00`), total amount in PHP.
  - Prefilled customer fields (Full Name, Email), editable for ticket delivery.
  - Simulated payment advisory: instant confirmation without third-party payment gateways.
  - Route Handler `/api/reservations/confirm`: Session validation, calls `confirm_reservation` RPC, converts holds to permanent reservations (`MS-YYYY-XXXXXX`), releases holds.
- **Key Updates & Enhancements:**
  - **Non-Fatal Email Boundary:** Confirmation email dispatches in the background via EmailJS. If email sending fails or times out, the booking still completes successfully.
  - **Race-Condition Handling:** The database partial unique index rejects concurrent bookings and returns a friendly `SEAT_TAKEN` error.
  - Verified via `scripts/test-phase5.mjs`.

---

### Phase 6: Digital Reservation Ticket & PDF Generation
- **Status:** COMPLETED & VERIFIED
- **Core Deliverables:**
  - Ticket Screen (`/ticket/[reference]`): Perforated tear-away ticket card with circular cutouts (`ticket-perforation-left`, `ticket-perforation-right`).
  - Display: Hall/Pass badges, poster thumbnail, audio/screen specs, allocated seats, total PHP.
  - Tear-off Stub: Copyable reference code (`MS-YYYY-XXXXXX`) with toast notification, decorative barcode, Turnstile entry advisory.
  - Concession and theater guidelines card.
  - Action buttons: "Print / Save Ticket (PDF)", "Lookup Anytime", "Book Another Movie".
  - PDF Generation Route (`/api/reservations/[id]/pdf`): Renders ticket PDF using `@react-pdf/renderer` (`TicketPdfDocument.tsx`).
- **Key Updates & Security Verification:**
  - **Strict Privacy Isolation:** Endpoint enforces user ownership. User B receives `403 Forbidden` if attempting to view or download User A's ticket or PDF.
  - Verified via `scripts/test-phase6.mjs`.

---

### Phase 7: Find Reservation, Self-Service & Cancellation
- **Status:** COMPLETED & VERIFIED
- **Core Deliverables:**
  - Self-Service Page (`/find-reservation`): Reference lookup input (`#` prefix) querying `my_reservations`.
  - "Your Latest Reservation" card rendered automatically.
  - Status badges: Active, Cancelled, Expired, Used.
  - Quick-switch selector for multiple bookings.
  - Direct PDF download button.
  - Cancellation Modal (`CancelReservationModal.tsx`): Permanent cancellation warning.
  - Cancellation Endpoint (`/api/reservations/[id]/cancel`): Calls `cancel_reservation` RPC.
- **Key Updates & Policy Enforcement:**
  - **30-Minute Cutoff Policy:** Both UI and Postgres function strictly prohibit cancellation within 30 minutes of showtime (`CANCEL_WINDOW_CLOSED`).
  - **Immediate Seat Release:** Cancelling immediately releases seats so other users see them as available in real time.
  - Verified via `scripts/test-phase7.mjs`.

---

### Phase 8: Mobile Polish, Turbopack Optimization & QA
- **Status:** COMPLETED & VERIFIED
- **Core Deliverables:**
  - **Mobile Responsiveness (375px Viewport):**
    - Seat matrix wrapped with horizontal swipe hint and smooth touch scrolling.
    - Touch-optimized 6-box OTP input with mobile keypad support and `one-time-code` autofill.
    - Sticky mobile summary bar (`[ Proceed to Book → ]`) on screening pages with live totals.
    - Collapsible mobile navigation.
  - **Turbopack & Prerender Optimization:**
    - Fixed Next.js 16 prerender cache collisions using `connection()`.
    - Resolved dev proxy origin mismatches in multi-port testing (`dual-port-proxy.js`).
  - **Complete Automated QA Suite (`scripts/test-phase8-qa.mjs`):**
    - Double-booking race condition lock verified.
    - 5-minute hold auto-release verified.
    - OTP brute-force lockout (5 attempts) verified.
    - Cross-user privacy isolation verified.
    - 30-minute cutoff and immediate seat release verified.
  - **Vercel Production Deployment:**
    - Documented deployment guide; live deployment intentionally skipped per user instruction.

---

## 4. Security & Privacy Isolation Architecture

| Layer | Defense Mechanism | Implementation Details |
|---|---|---|
| **Database Access** | Row-Level Security (RLS) + Security Invoker | RLS enabled on all tables. `my_reservations` view set to `security_invoker = true`. |
| **Write Protection** | Zero Direct Client Writes | Public roles cannot insert/update `reservations`, `reservation_seats`, or `seat_holds`. All writes routed through `SECURITY DEFINER` functions. |
| **Double-Booking Guard** | Partial Unique Index | `UNIQUE(showtime_id, seat_id) WHERE status = 'reserved'` enforced at Postgres engine level. |
| **OTP Security** | HMAC-SHA256 Hash + Attempt Lockout | Plain-text OTPs never stored in DB. Max 5 failed attempts locks code; max 5 resends/hour; 5-min TTL. |
| **Public Signups** | Disabled in Supabase Auth | Blocks client-side `supabase.auth.signUp()` with anon key. Accounts created only via server route `auth.admin.createUser`. |
| **Ticket Privacy** | Ownership Validation | `/ticket/[reference]`, `/api/reservations/[id]/pdf`, and `/api/reservations/[id]/cancel` verify `auth.uid() == reservation.user_id`. |
| **Cancellation Cutoff** | 30-Minute Database Policy | Database function calculates `start_time - now()` and rejects cancellations under 30 minutes. |

---

## 5. Automated QA Verification Matrix

All automated test suites in `scripts/` have been executed and verified:

```
================================================================================
                    MOVIESEAT AUTOMATED TEST VERIFICATION
================================================================================
Test Suite                   Scope                                       Status
--------------------------------------------------------------------------------
test_setup.sql               Row counts, schema, seed data, RPCs         PASSED (100%)
test-phase2.mjs              OTP generation, HMAC verification, cooldown PASSED (100%)
test-phase5.mjs              Hold to confirm transaction, concurrency    PASSED (100%)
test-phase6.mjs              Ticket view, PDF generation, privacy checks PASSED (100%)
test-phase7.mjs              Find reservation, 30m cancel cutoff, release PASSED (100%)
test-phase8-qa.mjs           Comprehensive end-to-end regression audit   PASSED (100%)
--------------------------------------------------------------------------------
Overall QA Status: 100% Passed · Production Ready
================================================================================
```

---

## 6. Complete Directory & Component Map

```
movieseat/movieseat/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signup/route.ts          # Server-side user creation & OTP dispatch
│   │   │   ├── verify-otp/route.ts      # HMAC verification & email confirmation
│   │   │   └── resend-otp/route.ts      # Rate-limited OTP resend
│   │   ├── reservations/
│   │   │   ├── confirm/route.ts         # Hold-to-reservation RPC & EmailJS dispatch
│   │   │   └── [id]/
│   │   │       ├── cancel/route.ts      # 30-min rule cancellation & seat release
│   │   │       └── pdf/route.ts         # Owner-protected React-PDF generation
│   │   └── time/route.ts                # Asia/Manila server time endpoint
│   ├── find-reservation/page.tsx        # Self-service lookup & cancellation screen
│   ├── screenings/[showtimeId]/page.tsx # Interactive seat map & checkout
│   ├── signin/page.tsx                  # Sign in portal (autofill-protected)
│   ├── signup/page.tsx                  # Create account portal
│   ├── ticket/[reference]/page.tsx      # Digital ticket & perforated pass
│   ├── verify/page.tsx                  # 6-box OTP verification screen
│   ├── globals.css                      # Design tokens, screen glow, ticket masks
│   ├── layout.tsx                       # Root layout, Header, Footer, Fonts
│   └── page.tsx                         # Now Showing movie catalog
├── components/
│   ├── catalog/
│   │   ├── AuditoriumFilter.tsx         # Color-coded cinema hall filter
│   │   ├── MovieCard.tsx                # 2x2 grid movie presentation card
│   │   └── ShowtimePills.tsx            # Price-tagged showtime selection pills
│   ├── find-reservation/
│   │   ├── CancelReservationModal.tsx   # Permanent cancellation confirm dialog
│   │   └── FindReservationView.tsx      # Reference search & latest booking card
│   ├── layout/
│   │   ├── Footer.tsx                   # Attribution, TMDB notice, Live DB badge
│   │   ├── Header.tsx                   # Logo, Nav pills, Location, Clock, UserMenu
│   │   ├── LiveClock.tsx                # Asia/Manila drift-corrected clock
│   │   └── UserMenu.tsx                 # Fast-path session resolver & avatar menu
│   ├── reservation/
│   │   ├── GuestAuthModal.tsx           # Guest hold interceptor modal
│   │   ├── ScreeningReservationClient.tsx# Realtime subscriptions & state machine
│   │   ├── SeatMatrix.tsx               # 254-seat layout, aisles & VIP row
│   │   └── TicketSummarySidebar.tsx     # Price breakdown & simulated checkout
│   └── ticket/
│       ├── TicketActions.tsx            # PDF download, copy code, navigation
│       ├── TicketCard.tsx               # Perforated ticket with stub & barcode
│       └── TicketPdfDocument.tsx        # Branded React-PDF document template
├── email-templates/
│   ├── confirmation-template.html       # Web-based EmailJS booking confirmation
│   └── otp-template.html                # Web-based EmailJS OTP verification email
├── lib/
│   ├── supabase/
│   │   ├── admin.ts                     # Service role client (server routes only)
│   │   ├── client.ts                    # Browser singleton client
│   │   └── server.ts                    # Async cookie server client
│   ├── emailjs.ts                       # Server-side EmailJS REST client
│   ├── errors.ts                        # Postgres error code → friendly message
│   ├── otp.ts                           # HMAC hashing, verification & rate limits
│   └── time.ts                          # Asia/Manila timezone helpers
├── public/                              # Static icons and assets
├── scripts/                             # Automated test suites & QA scripts
├── supabase/
│   ├── schema.sql                       # Tables, RLS, functions, indexes, views
│   ├── seed.sql                         # Initial catalog, auditoriums, templates
│   ├── test_setup.sql                   # SQL integrity test script
│   └── SETUP_GUIDE.md                   # Supabase & EmailJS step-by-step setup
├── types/
│   └── supabase.ts                      # Generated TypeScript database types
├── proxy.ts                             # Next.js 16 session proxy
└── package.json                         # Dependencies & scripts
```

---

## 7. Environment Configuration & Operations Guide

### Environment Variables (`.env.local`)
```ini
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# EmailJS REST API (Server Only)
EMAILJS_SERVICE_ID=service_xxxxxxx
EMAILJS_OTP_TEMPLATE_ID=template_xxxxxxx
EMAILJS_CONFIRM_TEMPLATE_ID=template_xxxxxxx
EMAILJS_PUBLIC_KEY=your-public-key
EMAILJS_PRIVATE_KEY=your-private-key

# Security
OTP_HMAC_SECRET=your-secure-random-hmac-secret-min-32-chars

# TMDB Integration
TMDB_API_KEY=your-tmdb-v3-api-key
```

### Running the Application Locally
```bash
# Navigate to application root
cd movieseat/movieseat

# Install dependencies
npm install

# Start development server
npm run dev

# Run automated end-to-end QA regression suite
node scripts/test-phase8-qa.mjs
```

### Database Maintenance & Daily Showtimes
- Showtimes are generated dynamically for the current day in `Asia/Manila` time.
- If showtimes expire or need regeneration, execute:
  ```sql
  SELECT public.reseed_today();
  ```
  *(This is also executed automatically by the catalog route if no showtimes exist for today).*

---

# PART 2: QUESTION BANK (Decision Tree)

Tags: **[Core]** and **[Deep]**. *Must cover* lists what a complete answer includes.

## Branch 0: Scope and success

**Q0.1 [Core]** In your own words: what problem does MovieSeat solve, for whom, and what does "done" look like for a patron and for the cinema?
*Must cover:* patron, cinema, a measurable definition of done.

**Q0.2 [Core]** Which rules in Part 1 are fixed, and what are their exact values? List them.
*Must cover:* at least 8 rules with numbers (for example OTP limits, hold time, seat cap, cancel cutoff, time zone, fee, reference format).

**Q0.3 [Core]** What does Part 1 deliberately **not** do, and what does it assume about how the cinema operates?
*Must cover:* at least five items (for example simulated payment, no ticket scanner, single cinema, today-only showings, one language/time zone) and the risk each assumption carries.

## Branch 1: Actors and journeys

**Q1.1 [Core]** List every actor in the system, including non-human ones, and what each is allowed to do.
*Must cover:* guest, unverified user, verified patron, plus server, database, EmailJS, TMDB and timers.

**Q1.2 [Core]** List every end-to-end journey. For each: trigger, happy-path steps, and end state.
*Must cover:* sign-up and verify, sign-in, browse, hold, checkout, ticket and PDF, find, cancel, daily reseed.

**Q1.3 [Core]** Narrate the "book a seat" journey from clicking Select Screening to seeing the ticket: every request between browser, server and database. Mark which are reads, writes and realtime.
*Must cover:* order, where identity is checked, where each rule is enforced.

**Q1.4 [Deep]** For each journey in Q1.2, name the step most likely to fail and what the user sees.

**Q1.5 [Core]** Describe the lifecycle (states, what triggers each change, and end states) of: (a) a seat for one showtime, (b) a hold, (c) a reservation, (d) an OTP code.
*Must cover:* states, triggers (user, timer, another user), terminal states.

## Branch 2: Data model and where rules live

**Q2.1 [Core]** List every table, view and function in Part 1 with a one-sentence purpose. Which one is the source of truth for: seat availability, price, the daily schedule, and reservation status?
*Must cover:* holds versus reserved seats, templates versus showtimes.

**Q2.2 [Core]** For each rule, say where it is enforced (screen, route handler, SQL function, constraint or index) and why: max 6 seats, no double booking, 5-minute hold, 30-minute cancel cutoff, own reservations only, OTP attempts, price calculation, no booking of past showtimes.
*Must cover:* the database or server layer for every integrity rule, and what breaks if only the screen enforced it.

**Q2.3 [Core]** Why does Part 1 use a *partial* unique index on `reservation_seats` (only where `status = 'reserved'`)? What would break with a plain unique constraint? What happens to the row when a reservation is cancelled?
*Must cover:* seat reuse after cancellation, history kept.

**Q2.4 [Deep]** Why are all writes done through `SECURITY DEFINER` functions? What risks does that create, and how do you reduce them?
*Must cover:* identity from `auth.uid()` and not from parameters, input validation, `search_path`, who may execute.

**Q2.5 [Deep]** Which tables may an anonymous visitor read, and which must they never read? Why does Realtime force some of these choices, and what could leak?

**Q2.6 [Deep]** Explain `showtime_templates` and `reseed_today()`: what they are for, when reseed runs, and who can trigger it. What can go wrong when a **page view causes a database write**?
*Must cover:* idempotency, two visitors at the same moment, who is allowed to call it.

## Branch 3: Authentication and OTP

**Q3.1 [Core]** Walk through sign-up, verify and sign-in. At each step, what is the account's state and what does the server do?
*Must cover:* account created unverified by the server, OTP stored and checked, verification confirms the account, sign-in blocked until then.

**Q3.2 [Core]** Why are OTPs generated, stored (hashed) and checked only on the server? What attacks exist if the browser sent the email, or if codes were stored in plain text? Why a keyed hash (HMAC)?

**Q3.3 [Core]** List all OTP limits and what each one protects against (including the EmailJS quota).

**Q3.4 [Core]** Why are public sign-ups disabled? What exactly could an attacker do otherwise?

**Q3.5 [Deep]** Part 1 says that if an *unverified* user registers again, the server *updates their password* and sends a new OTP. Think like an attacker who knows a victim's email address. Is this safe? Walk through the sequence of events.

**Q3.6 [Deep]** An unverified user tries to sign in. What happens at each layer, what does the "Verify now" shortcut do, and what does it cost?

**Q3.7 [Deep]** How does a server route know who the user is? Why must it never trust a user id sent by the browser?

## Branch 4: Catalog and time

**Q4.1 [Core]** How does the app decide which showtimes appear today? Which time zone, which layer computes it, and what goes wrong at 12:30 AM Manila time if it is computed in UTC?

**Q4.2 [Core]** How does the LiveClock stay correct with a wrong device clock? Which rules may use the client's clock, and which must use server time?

**Q4.3 [Core]** What disables a past showtime, in how many layers? What happens if a showtime starts while the user is still choosing seats?

**Q4.4 [Deep]** Where does the "seats open" number come from, how does it stay live, and how can it be wrong?

**Q4.5 [Deep]** Where do posters and movie facts come from? When are they fetched? What happens if TMDB is down?

## Branch 5: Seat map, holds and realtime

**Q5.1 [Core]** Describe the four seat states and how the client works out each one from the data.
*Must cover:* which tables, and the comparison with the current time.

**Q5.2 [Core]** Two patrons click the same seat at the same instant. Narrate what each request does inside the database, who wins, what the loser sees, and which mechanism decides.

**Q5.3 [Core]** A patron holds seats and walks away. Step by step: who releases them, when do other screens update, and does Realtime send an event when a hold simply *expires*?

**Q5.4 [Core]** Where is the 6-seat cap enforced, and why not only in the UI?

**Q5.5 [Deep]** A patron changes their selection from 2 seats to 3. What happens to the old holds and the timer? What abuse does this allow, and how would you stop it?

**Q5.6 [Deep]** Realtime drops for 2 minutes while a patron is on the seat map. What do they see, how do they recover, and what must be re-fetched?

**Q5.7 [Deep]** The guest flow: what exists before login, what is preserved across the redirect, and how do you make the `?redirect=` value safe?

## Branch 6: Checkout and confirmation

**Q6.1 [Core]** What does the browser send to `/api/reservations/confirm`, and what does the server decide alone? How is the total computed?

**Q6.2 [Core]** Walk through `confirm_reservation`: what must be true for it to succeed, which rows change, and what happens to the holds?

**Q6.3 [Core]** A patron double-clicks Confirm, or the server crashes after the database commits but before it responds. What state is the system in, and how does the patron get their ticket back?

**Q6.4 [Deep]** Why is the confirmation email non-fatal? List every way it can fail and where the patron can still see their ticket. What does it cost in quota?

**Q6.5 [Deep]** Reference codes: format, uniqueness, collisions, guessability. Why does ownership checking matter more than keeping codes secret?

## Branch 7: Ticket, PDF and privacy

**Q7.1 [Core]** Who may open `/ticket/[reference]` and the PDF route? How is ownership checked? Part 1 says a stranger gets `403`. What does a 403 reveal compared with a 404?

**Q7.2 [Core]** Why is `my_reservations` set to `security_invoker = true`? What happens if it is not?

**Q7.3 [Deep]** Generating a PDF on the server: what are the risks (time, memory, caching, serving the wrong user's file) and how do you reduce them?

## Branch 8: Find and cancel

**Q8.1 [Core]** Describe cancellation end to end: the cutoff, the change in each table, and what other patrons see.

**Q8.2 [Core]** Why is the 30-minute rule in both the UI and the database function? Which one is the real rule?

**Q8.3 [Deep]** Which reservation statuses exist (Active, Cancelled, Expired, Used)? Which are stored and which derived? Part 1 does not say. What event moves a reservation to Expired, and what would break if you stored it? How does Used ever happen?

**Q8.4 [Deep]** Two cancel requests arrive at the same time. What stops double processing?

## Branch 9: Daily schedule and operations

**Q9.1 [Core]** Explain how today's schedule comes to exist: what `showtime_templates` holds, what `showtimes` holds, when `reseed_today()` runs, and what "today" means. Walk through one auditorium's day, from a template row to a pill on the Now Showing screen.
*Must cover:* template versus generated showtime, the trigger, Asia/Manila, price and auditorium attached to each showtime.

**Q9.2 [Core]** At midnight, "today" changes. What happens to yesterday's showtimes, holds and reservations, and to the seat map of a showing that started at 11:30 PM? Which tables grow forever, and is that a problem?
*Must cover:* history kept or removed, tickets still viewable, expired holds, growth and cleanup choices.

**Q9.3 [Core]** What if reseed fails, or the templates are empty or wrong? What does a patron see, and how does the system avoid a blank or broken catalog?
*Must cover:* failure behavior, a fallback or friendly message, and who notices.

**Q9.4 [Deep]** Part 1 has no screen for changing the lineup. How would the cinema change which movies or times are shown, and what must the person making the change never do to data that already has reservations or holds?
*Must cover:* where the change is made (templates versus showtimes), what changes today versus tomorrow, overlaps and runtimes, existing reservations.

**Q9.5 [Deep]** Showtimes in one auditorium must not overlap. Where is that rule enforced in Part 1, if anywhere? What would you add, and at which layer?
*Must cover:* runtime plus a buffer, constraint or validation, template and seed data.

## Branch 10: Security review

**Q10.1 [Core]** List the types of attacker this system faces and, for each, the three most valuable things they would try. Which defense stops each?

**Q10.2 [Core]** List every secret in the system: where it lives and what happens if it leaks.

**Q10.3 [Deep]** Apply "never trust the client" to the whole system: list every value the browser sends and say which ones the server ignores or recomputes.

**Q10.4 [Deep]** Where, if anywhere, would you rate-limit, and why?

## Branch 11: Testing and QA

**Q11.1 [Core]** For each rule in Q2.2, write one test: setup, action, expected result. Which are automated and which manual?

**Q11.2 [Core]** Compare Part 1's QA matrix with its features. Name at least five behaviors that are **not covered** and say how you would test each.

**Q11.3 [Deep]** How do you test concurrency reliably? Name the situations you would test.

**Q11.4 [Core]** Write at least eight test cases for the daily schedule and reseed (Branch 9), including midnight, repeated calls, and empty templates.

**Q11.5 [Deep]** Part 1 ends with "100% Passed · Production Ready". What does that prove, and what does it not?

## Branch 12: Build order and team

**Q12.1 [Core]** Give a build order with dependencies: what must exist before what, and why?

**Q12.2 [Core]** For each phase, define a "done" gate: the evidence you would show the instructor live.

**Q12.3 [Deep]** Split the work across your team, estimate effort, list your top five risks with mitigations, and state your **cut line** (what you drop first if time runs out).

**Q12.4 [Deep]** Which parts of Part 1 will you reuse unchanged, and which will you deliberately change? Justify each change.

## Branch 13: Document review

**Q13.1 [Core]** Review Part 1 critically. Find at least **six** inconsistencies, ambiguities, risky assumptions or missing details. For each: where it is, why it matters, and your proposed fix.

**Q13.2 [Deep]** What does Part 1 not tell you that you would need before implementing? Write the questions you would ask the instructor.

---

# PART 3: STRESS SCENARIOS

Scenarios to test a plan against.

| ID | Scenario |
|---|---|
| **S1** | It is 12:00 AM in Manila. A patron is on Now Showing and the daily reseed runs. |
| **S2** | A patron is in the middle of checkout when their showtime starts. |
| **S3** | The EmailJS monthly quota is exhausted. What happens to sign-up and to bookings? |
| **S4** | TMDB is down when posters or movie details are needed. |
| **S5** | 100 patrons try to book the last 6 seats of the biggest showing at the same moment. |
| **S6** | A patron edits the request in the browser's developer tools: changes the price, the user id, or the seat list to include a seat someone else holds. |
| **S7** | One account, two tabs: seats held in one, confirm in the other. The session expires mid-checkout. |
| **S8** | A script calls the daily reseed function 50 times. |
| **S9** | A patron opens the ticket for a movie that ended an hour ago, then tries to cancel it and to download the PDF. |
| **S10** | Supabase Realtime is unavailable for ten minutes during the busiest hour. |

---

# PART 4: FINAL PLAN TEMPLATE

The Final Plan has these sections:

```
# MovieSeat Final Plan: <Team name>
Members and roles:
Date / session count:

## 1. Scope and assumptions
- Goal, fixed rules (with values), out-of-scope items, assumptions

## 2. Actors and journeys
- Actor table (who can do what)
- For each journey: trigger, steps, end state, failure paths (what the user sees)
- State/lifecycle descriptions: seat, hold, reservation, OTP

## 3. Data model and rules
- Entities and relationships
- Rule table: Rule | Enforced where | Why there | What breaks if missing

## 4. Feature specifications (one per branch 3 to 8)
- Auth and OTP, Catalog and time, Seat map and holds, Checkout,
  Ticket and PDF, Find and cancel

## 5. Daily schedule and operations specification
- Templates and showtimes, reseed trigger and safety, midnight behavior
- Failure behavior, lineup changes, overlap rules

## 6. Security matrix
- Attacker | Goal | Defense | Layer(s)
- Secrets table

## 7. Failure and edge-case catalog
- Scenario | Expected behavior | Where handled (include S1 to S10 results)

## 8. Test plan
- Rule/behavior | Test (setup, action, expected) | Automated or manual

## 9. Build order and gates
- Phases with dependencies, "done" evidence for each, team split, risks, cut line

## 10. Document review results
- Issues found in the baseline Master Plan with proposed fixes

## 11. Decision Log
- ID | Decision (student's words) | Reason | Alternatives the student named

## 12. Open Items
- Questions to bring to the instructor

## 13. Traceability
- Each baseline Master Plan feature -> section of this plan that covers it

## 14. Reflection
- Hardest decision, what you would change, what the session taught you
```

---

# PART 5: FINAL PLAN COMPLETION CRITERIA

A Final Plan is complete when:

- [ ] Every **[Core]** question has a **Solid** answer or is listed as an Open Item.
- [ ] Every journey has at least one failure path with a defined user-visible result.
- [ ] Every business rule names the layer that enforces it, and the database or server is part of the answer.
- [ ] The daily schedule is fully specified: templates, reseed, midnight behavior, failure behavior, lineup changes and overlap rules.
- [ ] At least **six** issues in the baseline Master Plan were found (Q13.1).
- [ ] At least **five** stress scenarios were run, including **S2** and **S6**.
- [ ] Every decision is in the Decision Log with a reason and the alternatives the student named (or "none named").
- [ ] The provenance audit was done: every Decision Log entry came from the student, and the agent proposed none.
- [ ] The test plan has a test for every rule and at least eight schedule and reseed tests.
- [ ] The build order has a "done" gate for each phase.
- [ ] The student has read every section back and confirmed it.

---

# PART 6: MASTER PLAN QUESTION BANK

Tags: **[Core]** and **[Deep]**. *Must cover* lists what a complete answer includes. These questions build the student's own Master Plan from the approved Final Plan.

## Branch M1: Architecture overview

**MQ1.1 [Core]** In your own words, describe the architecture of your system: its parts and who talks to whom.
*Must cover:* browser, server, database, outside services, the direction of each connection, what identity or data passes along it.

**MQ1.2 [Core]** For each key technical decision in your Final Plan, state the area, the decision and the reason.
*Must cover:* framework, database, authentication, double booking, time, email, each tied to a Decision Log ID.

**MQ1.3 [Deep]** For every rule in your Final Plan's rule table, show where it appears in this architecture.
*Must cover:* no rule without a place.

## Branch M2: Screens and design

**MQ2.1 [Core]** List every screen. For each: what it shows, what the user can do on it, and which journey it belongs to.
*Must cover:* every journey in the Final Plan has its screens, including failure and empty states.

**MQ2.2 [Core]** What visual rules (colors, type, components) do the screens follow, and where are they defined?
*Must cover:* a named source of the rules, and how each screen uses them.

**MQ2.3 [Deep]** What changes on a 375px-wide phone, screen by screen?

## Branch M3: Phases

**MQ3.1 [Core]** List your implementation phases in order. For each: name, goal, and which earlier phases it depends on.
*Must cover:* the reason for the order; no phase depends on a later one.

**MQ3.2 [Core]** For each phase, list its deliverables (tables, functions, routes, screens, files) and the Final Plan decisions it implements.
*Must cover:* deliverables tied to Decision Log IDs.

**MQ3.3 [Core]** For each phase, what does "done" mean, and what evidence proves it?
*Must cover:* evidence that can be shown live, including at least one failure path.

**MQ3.4 [Deep]** For each phase, what problems do you expect, and what will you do about them?

**MQ3.5 [Deep]** How will you record the changes and fixes made in each phase?

## Branch M4: Data and server

**MQ4.1 [Core]** List every table, view, function and index with its purpose. Which rule does each one support?
*Must cover:* matches the Final Plan's data model and rule table.

**MQ4.2 [Core]** List every route: its purpose, who may call it, what it takes in, what it returns, and which rule it enforces.
*Must cover:* who may call each route, and the rule behind it.

**MQ4.3 [Deep]** What data is seeded, and how is each day's schedule produced?

## Branch M5: Security and secrets

**MQ5.1 [Core]** Build your security table: layer, defense, and how it is implemented.
*Must cover:* matches the Final Plan's security matrix.

**MQ5.2 [Core]** List every environment variable and secret: what it is for, where it is used, and who may see it.

## Branch M6: Quality assurance

**MQ6.1 [Core]** Build your QA matrix: each test suite, what it covers, how it is run, and what a pass looks like.
*Must cover:* covers the Final Plan's test plan.

**MQ6.2 [Deep]** Which behaviors have no automated test, and why?

## Branch M7: Structure and operations

**MQ7.1 [Core]** Describe your folder and component map: every group of files and its purpose.
*Must cover:* every deliverable from MQ3.2 has a home.

**MQ7.2 [Core]** How does someone set up and run the project from nothing?

**MQ7.3 [Deep]** How is the system maintained day to day, and what happens when a part fails? Is deployment in scope, and why?

## Branch M8: Consistency

**MQ8.1 [Core]** For each section of your Final Plan, where does your Master Plan cover it?
*Must cover:* every Final Plan section and Decision Log ID traced; none left out.

**MQ8.2 [Core]** Is anything in your Master Plan missing from your Final Plan? If so, why is it there?

**MQ8.3 [Deep]** After reading your Master Plan, what would an implementer still have to guess?

---

# PART 7: MASTER PLAN TEMPLATE

The Master Plan has these sections:

```
# <Team name> Master Plan
Status: PLANNED
Repository root:  |  Core stack: (as decided in the Final Plan)

## Table of contents

## 1. Executive summary and system architecture
- Purpose, architecture diagram
- Key technical decisions: Area | Decision | Reason | Decision ID

## 2. Screens and design
- For each screen: contents, user actions, journey, failure and empty states
- Visual rules and where they are defined
- Mobile behavior

## 3. Phase-by-phase plan
- For each phase: name, status (PLANNED), goal, depends on,
  deliverables, Final Plan decisions implemented, done evidence,
  expected problems, changelog (empty until built)

## 4. Security and privacy architecture
- Layer | Defense | Implementation

## 5. QA verification matrix
- Suite | Scope | How it is run | What a pass looks like | Known gaps

## 6. Directory and component map

## 7. Environment configuration and operations guide
- Variables and secrets, run steps, daily maintenance, failure handling

## 8. Traceability to the Final Plan
- Final Plan section / Decision ID -> Master Plan section

## 9. Open items
```

---

# PART 8: MASTER PLAN COMPLETION CRITERIA

A Master Plan is complete when:

- [ ] Every Final Plan section and Decision Log ID is traced to a section of the Master Plan (MQ8.1).
- [ ] Nothing in the Master Plan lacks a source in the Final Plan or in the student's answers.
- [ ] The phases are in dependency order, and no phase depends on a later phase.
- [ ] Every phase has deliverables, the Final Plan decisions it implements, and done evidence.
- [ ] Every rule in the Final Plan's rule table appears in a table, function, route or screen listed in the Master Plan.
- [ ] The security table matches the Final Plan's security matrix.
- [ ] The QA matrix covers the Final Plan's test plan and names the known gaps.
- [ ] Every environment variable and secret is listed with its purpose.
- [ ] The folder map has a home for every deliverable.
- [ ] Open items are listed.
- [ ] The provenance audit was done: everything in the Master Plan came from the student, and the agent proposed none.
- [ ] The student has read every section back and confirmed it.
