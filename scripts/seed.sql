-- PDP Golf League seed
-- Idempotent: drops and recreates all tables, then populates.
-- Run with: node scripts/seed.mjs   (uses @neondatabase/serverless)
-- Or via psql: psql "$DATABASE_URL" -f scripts/seed.sql

DROP TABLE IF EXISTS weekly_standings CASCADE;
DROP TABLE IF EXISTS score_submissions CASCADE;
DROP TABLE IF EXISTS schedule CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS weeks CASCADE;

CREATE TABLE weeks (
  id           SERIAL PRIMARY KEY,
  week_number  INTEGER NOT NULL UNIQUE,
  start_date   DATE NOT NULL,
  is_current   BOOLEAN NOT NULL DEFAULT FALSE,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE teams (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  player1_name TEXT NOT NULL,
  player2_name TEXT NOT NULL
);

CREATE TABLE schedule (
  id        SERIAL PRIMARY KEY,
  week_id   INTEGER NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
  team1_id  INTEGER NOT NULL REFERENCES teams(id),
  team2_id  INTEGER NOT NULL REFERENCES teams(id),
  tee_time  TEXT NOT NULL,
  UNIQUE (week_id, team1_id, team2_id)
);

CREATE TABLE score_submissions (
  id            SERIAL PRIMARY KEY,
  week_id       INTEGER NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
  team_id       INTEGER NOT NULL REFERENCES teams(id),
  player1_score INTEGER NOT NULL,
  player2_score INTEGER NOT NULL,
  total_score   INTEGER NOT NULL,
  submitted_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (week_id, team_id)
);

CREATE TABLE weekly_standings (
  id            SERIAL PRIMARY KEY,
  week_id       INTEGER NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
  team_id       INTEGER NOT NULL REFERENCES teams(id),
  total_score   INTEGER,
  rank          INTEGER,
  points_earned INTEGER NOT NULL DEFAULT 0,
  UNIQUE (week_id, team_id)
);

-- 12 weeks starting May 19, 2026 (Tuesdays)
INSERT INTO weeks (week_number, start_date, is_current, is_completed) VALUES
  ( 1, '2026-05-19', TRUE,  FALSE),
  ( 2, '2026-05-26', FALSE, FALSE),
  ( 3, '2026-06-02', FALSE, FALSE),
  ( 4, '2026-06-09', FALSE, FALSE),
  ( 5, '2026-06-16', FALSE, FALSE),
  ( 6, '2026-06-23', FALSE, FALSE),
  ( 7, '2026-06-30', FALSE, FALSE),
  ( 8, '2026-07-07', FALSE, FALSE),
  ( 9, '2026-07-14', FALSE, FALSE),
  (10, '2026-07-21', FALSE, FALSE),
  (11, '2026-07-28', FALSE, FALSE),
  (12, '2026-08-04', FALSE, FALSE);

-- 12 teams
INSERT INTO teams (name, player1_name, player2_name) VALUES
  ('Bogey Brothers',   'Mike Anderson',   'Tom Reilly'),
  ('Fairway Kings',    'Sarah Chen',      'Dave Patel'),
  ('Slice & Dice',     'Jenna Brooks',    'Carlos Diaz'),
  ('Putter Pirates',   'Ryan O''Connor',  'Sam Whitfield'),
  ('Eagle Hunters',    'Liam Foster',     'Priya Shah'),
  ('Birdie Bandits',   'Nora Vance',      'Greg Hollis'),
  ('Mulligan Mafia',   'Alex Park',       'Jordan Lee'),
  ('Tee Total',        'Kevin Murphy',    'Bryan Castillo'),
  ('Green Machine',    'Maya Iyer',       'Derek Walsh'),
  ('Sand Trappers',    'Chris Bowman',    'Erin Sutton'),
  ('Driving Force',    'Owen Pritchard',  'Tariq Ahmed'),
  ('Par-Tee Animals',  'Beth Calloway',   'Marco Russo');

-- Berger round-robin for 12 teams across 11 unique weeks.
-- Pattern: team 12 is fixed; teams 1..11 rotate clockwise each round.
-- Week 12 repeats Week 1.
--
-- Round   Pairings (team numbers)
--   1     1-12  2-11  3-10  4-9   5-8   6-7
--   2    12-7   8-6   9-5  10-4  11-3   1-2
--   3     2-12  3-1   4-11  5-10  6-9   7-8
--   4    12-8   9-7  10-6  11-5   1-4   2-3
--   5     3-12  4-2   5-1   6-11  7-10  8-9
--   6    12-9  10-8  11-7   1-6   2-5   3-4
--   7     4-12  5-3   6-2   7-1   8-11  9-10
--   8    12-10 11-9   1-8   2-7   3-6   4-5
--   9     5-12  6-4   7-3   8-2   9-1  10-11
--  10    12-11  1-10  2-9   3-8   4-7   5-6
--  11     6-12  7-5   8-4   9-3  10-2  11-1
--
-- Tee times: 16:00, 16:10, 16:20, 16:30, 16:40, 16:50

INSERT INTO schedule (week_id, team1_id, team2_id, tee_time) VALUES
  -- Week 1
  (1, 1, 12, '4:00 PM'), (1, 2, 11, '4:10 PM'), (1, 3, 10, '4:20 PM'),
  (1, 4,  9, '4:30 PM'), (1, 5,  8, '4:40 PM'), (1, 6,  7, '4:50 PM'),
  -- Week 2
  (2, 12, 7, '4:00 PM'), (2, 8,  6, '4:10 PM'), (2, 9,  5, '4:20 PM'),
  (2, 10, 4, '4:30 PM'), (2, 11, 3, '4:40 PM'), (2, 1,  2, '4:50 PM'),
  -- Week 3
  (3, 2, 12, '4:00 PM'), (3, 3,  1, '4:10 PM'), (3, 4, 11, '4:20 PM'),
  (3, 5, 10, '4:30 PM'), (3, 6,  9, '4:40 PM'), (3, 7,  8, '4:50 PM'),
  -- Week 4
  (4, 12, 8, '4:00 PM'), (4, 9,  7, '4:10 PM'), (4, 10, 6, '4:20 PM'),
  (4, 11, 5, '4:30 PM'), (4, 1,  4, '4:40 PM'), (4, 2,  3, '4:50 PM'),
  -- Week 5
  (5, 3, 12, '4:00 PM'), (5, 4,  2, '4:10 PM'), (5, 5,  1, '4:20 PM'),
  (5, 6, 11, '4:30 PM'), (5, 7, 10, '4:40 PM'), (5, 8,  9, '4:50 PM'),
  -- Week 6
  (6, 12, 9, '4:00 PM'), (6, 10, 8, '4:10 PM'), (6, 11, 7, '4:20 PM'),
  (6, 1,  6, '4:30 PM'), (6, 2,  5, '4:40 PM'), (6, 3,  4, '4:50 PM'),
  -- Week 7
  (7, 4, 12, '4:00 PM'), (7, 5,  3, '4:10 PM'), (7, 6,  2, '4:20 PM'),
  (7, 7,  1, '4:30 PM'), (7, 8, 11, '4:40 PM'), (7, 9, 10, '4:50 PM'),
  -- Week 8
  (8, 12, 10, '4:00 PM'), (8, 11, 9, '4:10 PM'), (8, 1,  8, '4:20 PM'),
  (8, 2,   7, '4:30 PM'), (8, 3,  6, '4:40 PM'), (8, 4,  5, '4:50 PM'),
  -- Week 9
  (9, 5, 12, '4:00 PM'), (9, 6,  4, '4:10 PM'), (9, 7,  3, '4:20 PM'),
  (9, 8,  2, '4:30 PM'), (9, 9,  1, '4:40 PM'), (9, 10, 11, '4:50 PM'),
  -- Week 10
  (10, 12, 11, '4:00 PM'), (10, 1, 10, '4:10 PM'), (10, 2,  9, '4:20 PM'),
  (10,  3,  8, '4:30 PM'), (10, 4,  7, '4:40 PM'), (10, 5,  6, '4:50 PM'),
  -- Week 11
  (11, 6, 12, '4:00 PM'), (11, 7,  5, '4:10 PM'), (11, 8,  4, '4:20 PM'),
  (11, 9,  3, '4:30 PM'), (11, 10, 2, '4:40 PM'), (11, 11, 1, '4:50 PM'),
  -- Week 12 (repeat of Week 1)
  (12, 1, 12, '4:00 PM'), (12, 2, 11, '4:10 PM'), (12, 3, 10, '4:20 PM'),
  (12, 4,  9, '4:30 PM'), (12, 5,  8, '4:40 PM'), (12, 6,  7, '4:50 PM');
