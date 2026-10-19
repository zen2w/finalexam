-- =========================================================================
-- MovieSeat Database Seed Data
-- 4 TMDB Movies, 3 Auditoriums, 254 Seats, Showtime Templates & Today's Schedule
-- =========================================================================

-- 1. SEED AUDITORIUMS (3 Halls)
INSERT INTO public.auditoriums (id, name, format, total_seats) VALUES
('11111111-1111-1111-1111-111111111111', 'Cinema 1 (Dolby Atmos)', 'Dolby Atmos', 84),
('22222222-2222-2222-2222-222222222222', 'Cinema 2 (IMAX Laser)', 'IMAX Laser', 86),
('33333333-3333-3333-3333-333333333333', 'Cinema 3 (Standard)', 'Standard', 84)
ON CONFLICT (name) DO UPDATE SET total_seats = EXCLUDED.total_seats;

-- 2. SEED SEATS (Total 254 Physical Seats across 3 Auditoriums)
-- Cinema 1 (84 seats: Rows A-G, 12 seats per row; Row A is VIP Recliner)
DO $$
DECLARE
    r TEXT;
    n INT;
    aud_id UUID := '11111111-1111-1111-1111-111111111111';
    st_type TEXT;
BEGIN
    FOREACH r IN ARRAY ARRAY['A', 'B', 'C', 'D', 'E', 'F', 'G'] LOOP
        FOR n IN 1..12 LOOP
            st_type := CASE WHEN r = 'A' THEN 'vip' ELSE 'standard' END;
            INSERT INTO public.seats (auditorium_id, row, number, seat_label, seat_type)
            VALUES (aud_id, r, n, r || n, st_type)
            ON CONFLICT (auditorium_id, seat_label) DO NOTHING;
        END LOOP;
    END LOOP;
END $$;

-- Cinema 2 (86 seats: Rows A-G, 12 seats per row + Row H 2 seats; Row A is VIP Recliner)
DO $$
DECLARE
    r TEXT;
    n INT;
    aud_id UUID := '22222222-2222-2222-2222-222222222222';
    st_type TEXT;
BEGIN
    FOREACH r IN ARRAY ARRAY['A', 'B', 'C', 'D', 'E', 'F', 'G'] LOOP
        FOR n IN 1..12 LOOP
            st_type := CASE WHEN r = 'A' THEN 'vip' ELSE 'standard' END;
            INSERT INTO public.seats (auditorium_id, row, number, seat_label, seat_type)
            VALUES (aud_id, r, n, r || n, st_type)
            ON CONFLICT (auditorium_id, seat_label) DO NOTHING;
        END LOOP;
    END LOOP;
    -- Extra 2 seats in Row H
    INSERT INTO public.seats (auditorium_id, row, number, seat_label, seat_type)
    VALUES (aud_id, 'H', 1, 'H1', 'standard'), (aud_id, 'H', 2, 'H2', 'standard')
    ON CONFLICT (auditorium_id, seat_label) DO NOTHING;
END $$;

-- Cinema 3 (84 seats: Rows A-G, 12 seats per row; Row A is VIP Recliner)
DO $$
DECLARE
    r TEXT;
    n INT;
    aud_id UUID := '33333333-3333-3333-3333-333333333333';
    st_type TEXT;
BEGIN
    FOREACH r IN ARRAY ARRAY['A', 'B', 'C', 'D', 'E', 'F', 'G'] LOOP
        FOR n IN 1..12 LOOP
            st_type := CASE WHEN r = 'A' THEN 'vip' ELSE 'standard' END;
            INSERT INTO public.seats (auditorium_id, row, number, seat_label, seat_type)
            VALUES (aud_id, r, n, r || n, st_type)
            ON CONFLICT (auditorium_id, seat_label) DO NOTHING;
        END LOOP;
    END LOOP;
END $$;

-- 3. SEED MOVIES (4 Real TMDB Titles)
INSERT INTO public.movies (id, tmdb_id, title, poster_path, backdrop_path, overview, release_date, runtime, vote_average, certificate, audio_format) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1148365, 'Matchbox the Movie', '/lFKA4GMz36dImEy3DQPdPF7G4V9.jpg', '/jdJsnhHfkIi3J7jwfiCFT4gXNx5.jpg', 'An action-packed adventure inspired by the legendary die-cast toy franchise, racing against time to save the circuit.', '2026-10-05', 118, 7.8, 'PG-13', 'Dolby Atmos'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 1368337, 'The Odyssey', '/5rhTDKUhPYvpdQIijFIs5VoWsON.jpg', '/nVBzWBqHTB3XD0iqWiJLfKLo5fq.jpg', 'Homer''s timeless epic retold for modern screens. A legendary hero battles mythical beasts and wrathful gods on his ten-year voyage home.', '2026-07-15', 154, 8.0, 'PG-13', 'IMAX Laser'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 1058424, 'Hope', '/qW1m7bcsRb2lo8xG2v0p4mARyH8.jpg', '/qqHFLg90IUSoTmSMpKOOW5RyqN3.jpg', 'A gripping and heart-wrenching sci-fi journey about survival and humanity on the outer edges of a distant star system.', '2026-07-15', 125, 6.9, 'PG-13', 'Dolby Digital'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 1423191, 'Resident Evil', '/i7UyjfPio0VFHB9rBUZSFyhOoM8.jpg', '/3icyRAqgakNcQn6aDVz9libFmBA.jpg', 'Survival horror returns to Raccoon City. Biohazard alarms sound as elite operatives fight through infested corridors.', '2026-09-16', 112, 7.3, 'R-16', 'Dolby Atmos')
ON CONFLICT (tmdb_id) DO UPDATE SET
title = EXCLUDED.title,
poster_path = EXCLUDED.poster_path,
backdrop_path = EXCLUDED.backdrop_path,
overview = EXCLUDED.overview,
vote_average = EXCLUDED.vote_average;

-- 4. SEED SHOWTIME TEMPLATES (13 Scheduled Showtimes daily)
INSERT INTO public.showtime_templates (movie_id, auditorium_id, start_time_of_day, price) VALUES
-- Matchbox the Movie (Cinema 1 - Dolby Atmos)
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '10:30:00', 380.00),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '13:45:00', 380.00),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '17:00:00', 420.00),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '20:15:00', 420.00),

-- The Odyssey (Cinema 2 - IMAX Laser)
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', '11:00:00', 450.00),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', '14:30:00', 450.00),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', '18:00:00', 500.00),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', '21:30:00', 500.00),

-- Hope (Cinema 3 - Standard)
('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', '12:00:00', 320.00),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', '15:15:00', 320.00),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', '18:30:00', 350.00),

-- Resident Evil (Cinema 1 & 3 Evening)
('dddddddd-dddd-dddd-dddd-dddddddddddd', '33333333-3333-3333-3333-333333333333', '21:45:00', 350.00),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', '23:00:00', 400.00);

-- 5. POPULATE TODAY'S SHOWTIMES IMMEDIATELY
SELECT public.reseed_today();
