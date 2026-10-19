-- =========================================================================
-- MovieSeat Database Schema
-- Single-Cinema Real-Time Movie & Seat Reservation System
-- =========================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. MOVIES TABLE
CREATE TABLE IF NOT EXISTS public.movies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tmdb_id INTEGER NOT NULL UNIQUE,
    title TEXT NOT NULL,
    poster_path TEXT,
    backdrop_path TEXT,
    overview TEXT,
    release_date TEXT,
    runtime INTEGER NOT NULL DEFAULT 120,
    vote_average NUMERIC(3,1) DEFAULT 8.0,
    certificate TEXT DEFAULT 'PG-13',
    audio_format TEXT DEFAULT 'Dolby Atmos',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. AUDITORIUMS TABLE
CREATE TABLE IF NOT EXISTS public.auditoriums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    format TEXT NOT NULL, -- 'Dolby Atmos', 'IMAX Laser', 'Standard'
    total_seats INTEGER NOT NULL DEFAULT 84,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. SEATS TABLE
CREATE TABLE IF NOT EXISTS public.seats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auditorium_id UUID NOT NULL REFERENCES public.auditoriums(id) ON DELETE CASCADE,
    row TEXT NOT NULL,
    number INTEGER NOT NULL,
    seat_label TEXT NOT NULL, -- e.g. 'A1', 'E8'
    seat_type TEXT NOT NULL DEFAULT 'standard' CHECK (seat_type IN ('standard', 'vip')),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(auditorium_id, seat_label)
);

-- 4. SHOWTIME TEMPLATES (Blueprint for daily reseed in Asia/Manila)
CREATE TABLE IF NOT EXISTS public.showtime_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    movie_id UUID NOT NULL REFERENCES public.movies(id) ON DELETE CASCADE,
    auditorium_id UUID NOT NULL REFERENCES public.auditoriums(id) ON DELETE CASCADE,
    start_time_of_day TIME NOT NULL, -- e.g. '10:30:00', '13:30:00'
    price NUMERIC(10,2) NOT NULL DEFAULT 350.00,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. SHOWTIMES TABLE
CREATE TABLE IF NOT EXISTS public.showtimes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    movie_id UUID NOT NULL REFERENCES public.movies(id) ON DELETE CASCADE,
    auditorium_id UUID NOT NULL REFERENCES public.auditoriums(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    price NUMERIC(10,2) NOT NULL DEFAULT 350.00,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. SEAT HOLDS TABLE (5-Minute Temporary Lock)
CREATE TABLE IF NOT EXISTS public.seat_holds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    showtime_id UUID NOT NULL REFERENCES public.showtimes(id) ON DELETE CASCADE,
    seat_id UUID NOT NULL REFERENCES public.seats(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    session_id TEXT,
    held_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(showtime_id, seat_id)
);

-- 7. RESERVATIONS TABLE
CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_code TEXT NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    showtime_id UUID NOT NULL REFERENCES public.showtimes(id) ON DELETE CASCADE,
    total_amount NUMERIC(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'used')),
    customer_name TEXT,
    customer_email TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. RESERVATION SEATS TABLE
CREATE TABLE IF NOT EXISTS public.reservation_seats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID NOT NULL REFERENCES public.reservations(id) ON DELETE CASCADE,
    showtime_id UUID NOT NULL REFERENCES public.showtimes(id) ON DELETE CASCADE,
    seat_id UUID NOT NULL REFERENCES public.seats(id) ON DELETE CASCADE,
    price NUMERIC(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'reserved' CHECK (status IN ('reserved', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- PARTIAL UNIQUE INDEX (CRITICAL DOUBLE-BOOKING GUARD)
CREATE UNIQUE INDEX IF NOT EXISTS unique_active_reservation_seat 
ON public.reservation_seats(showtime_id, seat_id) 
WHERE status = 'reserved';

-- 9. OTP CODES TABLE (Server-side HMAC verification)
CREATE TABLE IF NOT EXISTS public.otp_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    hashed_code TEXT NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    resend_count INTEGER NOT NULL DEFAULT 1,
    last_sent_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_otp_codes_email ON public.otp_codes(email);

-- 10. MY_RESERVATIONS VIEW (SECURITY INVOKER)
CREATE OR REPLACE VIEW public.my_reservations
WITH (security_invoker = true)
AS
SELECT
    r.id,
    r.reference_code,
    r.user_id,
    r.showtime_id,
    r.total_amount,
    r.status,
    r.customer_name,
    r.customer_email,
    r.created_at,
    s.start_time,
    s.end_time,
    s.price,
    m.title AS movie_title,
    m.poster_path AS movie_poster,
    m.runtime AS movie_runtime,
    m.certificate AS movie_certificate,
    a.name AS auditorium_name,
    a.format AS auditorium_format,
    COALESCE(
        (
            SELECT json_agg(
                json_build_object(
                    'id', st.id,
                    'label', st.seat_label,
                    'row', st.row,
                    'number', st.number,
                    'type', st.seat_type,
                    'price', rs.price
                )
            )
            FROM public.reservation_seats rs
            JOIN public.seats st ON rs.seat_id = st.id
            WHERE rs.reservation_id = r.id AND rs.status = 'reserved'
        ),
        '[]'::json
    ) AS seats
FROM public.reservations r
JOIN public.showtimes s ON r.showtime_id = s.id
JOIN public.movies m ON s.movie_id = m.id
JOIN public.auditoriums a ON s.auditorium_id = a.id;

-- =========================================================================
-- RPC FUNCTIONS (SECURITY DEFINER)
-- =========================================================================

-- Helper to generate unique reservation reference: MS-YYYY-XXXXXX
CREATE OR REPLACE FUNCTION public.generate_reservation_reference()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    ref TEXT;
    year_str TEXT := to_char(now(), 'YYYY');
BEGIN
    LOOP
        ref := 'MS-' || year_str || '-' || upper(substring(encode(gen_random_bytes(4), 'hex') from 1 for 6));
        EXIT WHEN NOT EXISTS (SELECT 1 FROM public.reservations WHERE reference_code = ref);
    END LOOP;
    RETURN ref;
END;
$$;

-- Hold Seats RPC (5-minute lock with 6-seat cap)
CREATE OR REPLACE FUNCTION public.hold_seats(
    p_showtime_id UUID,
    p_seat_ids UUID[],
    p_user_id UUID,
    p_session_id TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_seat_id UUID;
    v_expires_at TIMESTAMPTZ := now() + interval '5 minutes';
BEGIN
    -- 1. Enforce 6-seat selection limit
    IF array_length(p_seat_ids, 1) > 6 THEN
        RETURN jsonb_build_object('success', false, 'error', 'MAX_SEATS_EXCEEDED', 'message', 'Maximum 6 seats per transaction.');
    END IF;

    -- 2. Clear out globally expired holds
    DELETE FROM public.seat_holds WHERE expires_at <= now();

    -- 3. Clear this user's previous holds for this showtime
    DELETE FROM public.seat_holds WHERE showtime_id = p_showtime_id AND user_id = p_user_id;

    -- If releasing all seats (empty array)
    IF p_seat_ids IS NULL OR array_length(p_seat_ids, 1) = 0 THEN
        RETURN jsonb_build_object('success', true, 'held_seats', '[]'::jsonb);
    END IF;

    -- 4. Check double-booking against active reservations
    IF EXISTS (
        SELECT 1 FROM public.reservation_seats
        WHERE showtime_id = p_showtime_id 
          AND seat_id = ANY(p_seat_ids) 
          AND status = 'reserved'
    ) THEN
        RETURN jsonb_build_object('success', false, 'error', 'SEAT_ALREADY_RESERVED', 'message', 'One or more seats have already been reserved.');
    END IF;

    -- 5. Check conflicts against active holds held by others
    IF EXISTS (
        SELECT 1 FROM public.seat_holds
        WHERE showtime_id = p_showtime_id 
          AND seat_id = ANY(p_seat_ids) 
          AND user_id != p_user_id
          AND expires_at > now()
    ) THEN
        RETURN jsonb_build_object('success', false, 'error', 'SEAT_ALREADY_HELD', 'message', 'One or more seats are currently held by another patron.');
    END IF;

    -- 6. Insert new holds
    FOREACH v_seat_id IN ARRAY p_seat_ids LOOP
        INSERT INTO public.seat_holds (showtime_id, seat_id, user_id, session_id, held_at, expires_at)
        VALUES (p_showtime_id, v_seat_id, p_user_id, p_session_id, now(), v_expires_at)
        ON CONFLICT (showtime_id, seat_id) DO UPDATE
        SET user_id = p_user_id, session_id = p_session_id, held_at = now(), expires_at = v_expires_at;
    END LOOP;

    RETURN jsonb_build_object(
        'success', true,
        'expires_at', v_expires_at,
        'seats', p_seat_ids
    );
END;
$$;

-- Release Holds RPC
CREATE OR REPLACE FUNCTION public.release_holds(
    p_showtime_id UUID,
    p_user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM public.seat_holds WHERE showtime_id = p_showtime_id AND user_id = p_user_id;
    RETURN jsonb_build_object('success', true);
END;
$$;

-- Confirm Reservation RPC
CREATE OR REPLACE FUNCTION public.confirm_reservation(
    p_showtime_id UUID,
    p_seat_ids UUID[],
    p_user_id UUID,
    p_customer_name TEXT,
    p_customer_email TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_reservation_id UUID;
    v_reference TEXT;
    v_base_price NUMERIC(10,2);
    v_total NUMERIC(10,2) := 0;
    v_seat_id UUID;
    v_seat_type TEXT;
    v_seat_price NUMERIC(10,2);
BEGIN
    -- Check that seats were provided
    IF p_seat_ids IS NULL OR array_length(p_seat_ids, 1) = 0 THEN
        RETURN jsonb_build_object('success', false, 'error', 'NO_SEATS', 'message', 'No seats selected.');
    END IF;

    -- Get showtime base price
    SELECT price INTO v_base_price FROM public.showtimes WHERE id = p_showtime_id;
    IF v_base_price IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'SHOWTIME_NOT_FOUND', 'message', 'Showtime does not exist.');
    END IF;

    -- Verify that all requested seats are currently held by this user
    IF (SELECT count(*) FROM public.seat_holds 
        WHERE showtime_id = p_showtime_id 
          AND seat_id = ANY(p_seat_ids) 
          AND user_id = p_user_id 
          AND expires_at > now()) != array_length(p_seat_ids, 1) THEN
        RETURN jsonb_build_object('success', false, 'error', 'HOLD_EXPIRED', 'message', 'Seat hold has expired. Please select your seats again.');
    END IF;

    -- Generate reference code
    v_reference := public.generate_reservation_reference();

    -- Calculate total price (VIP seats +PHP 100)
    FOR v_seat_id IN SELECT unnest(p_seat_ids) LOOP
        SELECT seat_type INTO v_seat_type FROM public.seats WHERE id = v_seat_id;
        IF v_seat_type = 'vip' THEN
            v_total := v_total + v_base_price + 100.00;
        ELSE
            v_total := v_total + v_base_price;
        END IF;
    END LOOP;

    -- Create reservation row
    INSERT INTO public.reservations (
        reference_code, user_id, showtime_id, total_amount, status, customer_name, customer_email
    ) VALUES (
        v_reference, p_user_id, p_showtime_id, v_total, 'confirmed', p_customer_name, p_customer_email
    ) RETURNING id INTO v_reservation_id;

    -- Create reservation_seats rows
    FOR v_seat_id IN SELECT unnest(p_seat_ids) LOOP
        SELECT seat_type INTO v_seat_type FROM public.seats WHERE id = v_seat_id;
        v_seat_price := CASE WHEN v_seat_type = 'vip' THEN v_base_price + 100.00 ELSE v_base_price END;

        INSERT INTO public.reservation_seats (
            reservation_id, showtime_id, seat_id, price, status
        ) VALUES (
            v_reservation_id, p_showtime_id, v_seat_id, v_seat_price, 'reserved'
        );
    END LOOP;

    -- Delete seat holds
    DELETE FROM public.seat_holds WHERE showtime_id = p_showtime_id AND user_id = p_user_id;

    RETURN jsonb_build_object(
        'success', true,
        'reservation_id', v_reservation_id,
        'reference_code', v_reference,
        'total_amount', v_total
    );
END;
$$;

-- Cancel Reservation RPC (Enforces 30-minute cutoff policy)
CREATE OR REPLACE FUNCTION public.cancel_reservation(
    p_reservation_id UUID,
    p_user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_start_time TIMESTAMPTZ;
    v_current_status TEXT;
    v_owner_id UUID;
BEGIN
    SELECT r.user_id, r.status, s.start_time 
    INTO v_owner_id, v_current_status, v_start_time
    FROM public.reservations r
    JOIN public.showtimes s ON r.showtime_id = s.id
    WHERE r.id = p_reservation_id;

    IF v_owner_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'NOT_FOUND', 'message', 'Reservation not found.');
    END IF;

    IF v_owner_id != p_user_id THEN
        RETURN jsonb_build_object('success', false, 'error', 'UNAUTHORIZED', 'message', 'You can only cancel your own reservation.');
    END IF;

    IF v_current_status = 'cancelled' THEN
        RETURN jsonb_build_object('success', false, 'error', 'ALREADY_CANCELLED', 'message', 'This reservation is already cancelled.');
    END IF;

    -- Strict 30-Minute Cutoff Policy
    IF (v_start_time - now()) < interval '30 minutes' THEN
        RETURN jsonb_build_object('success', false, 'error', 'CANCEL_WINDOW_CLOSED', 'message', 'Cancellations are strictly prohibited within 30 minutes of showtime.');
    END IF;

    -- Update reservation status
    UPDATE public.reservations SET status = 'cancelled' WHERE id = p_reservation_id;

    -- Immediately release seats for other users
    UPDATE public.reservation_seats SET status = 'cancelled' WHERE reservation_id = p_reservation_id;

    RETURN jsonb_build_object('success', true, 'message', 'Reservation cancelled and seats released.');
END;
$$;

-- Daily Reseed RPC (Asia/Manila UTC+8)
CREATE OR REPLACE FUNCTION public.reseed_today()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_today_date DATE;
    v_template RECORD;
    v_start_dt TIMESTAMPTZ;
    v_end_dt TIMESTAMPTZ;
    v_count INTEGER := 0;
BEGIN
    -- Determine today in Asia/Manila (UTC+8)
    v_today_date := (now() AT TIME ZONE 'Asia/Manila')::DATE;

    -- If showtimes already exist for today, return early
    IF EXISTS (
        SELECT 1 FROM public.showtimes 
        WHERE (start_time AT TIME ZONE 'Asia/Manila')::DATE = v_today_date
    ) THEN
        RETURN jsonb_build_object('success', true, 'message', 'Today already seeded', 'created', 0);
    END IF;

    -- Generate today''s showtimes from templates
    FOR v_template IN SELECT * FROM public.showtime_templates LOOP
        v_start_dt := (v_today_date || ' ' || v_template.start_time_of_day)::TIMESTAMP AT TIME ZONE 'Asia/Manila';
        v_end_dt := v_start_dt + interval '2 hours 15 minutes';

        INSERT INTO public.showtimes (movie_id, auditorium_id, start_time, end_time, price)
        VALUES (v_template.movie_id, v_template.auditorium_id, v_start_dt, v_end_dt, v_template.price);

        v_count := v_count + 1;
    END LOOP;

    RETURN jsonb_build_object('success', true, 'message', 'Reseeded showtimes for today', 'created', v_count);
END;
$$;

-- =========================================================================
-- PERMISSIONS & ROW LEVEL SECURITY (RLS)
-- =========================================================================

ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auditoriums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.showtime_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.showtimes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seat_holds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservation_seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

-- Public read permissions
CREATE POLICY "Public read movies" ON public.movies FOR SELECT USING (true);
CREATE POLICY "Public read auditoriums" ON public.auditoriums FOR SELECT USING (true);
CREATE POLICY "Public read seats" ON public.seats FOR SELECT USING (true);
CREATE POLICY "Public read showtimes" ON public.showtimes FOR SELECT USING (true);
CREATE POLICY "Public read seat_holds" ON public.seat_holds FOR SELECT USING (true);
CREATE POLICY "Public read reservation_seats" ON public.reservation_seats FOR SELECT USING (true);

-- User-isolated reservation read policy
CREATE POLICY "Users read own reservations" ON public.reservations 
FOR SELECT USING (auth.uid() = user_id);

-- Zero direct client writes (all writes must use SECURITY DEFINER RPCs or service role)
-- No direct INSERT/UPDATE/DELETE policies for public on booking tables.

-- Realtime Publication
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.seat_holds;
EXCEPTION WHEN duplicate_object THEN
    -- already added
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.reservation_seats;
EXCEPTION WHEN duplicate_object THEN
    -- already added
END $$;
