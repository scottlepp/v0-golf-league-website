-- Adds per-hole score detail and course config.
-- Idempotent: safe to re-run.

CREATE TABLE IF NOT EXISTS course_config (
  id          INTEGER PRIMARY KEY DEFAULT 1,
  name        TEXT NOT NULL DEFAULT 'Pine Dell Public',
  tees        TEXT NOT NULL DEFAULT 'white',
  holes       INTEGER NOT NULL DEFAULT 9,
  pars        INTEGER[] NOT NULL DEFAULT ARRAY[4,3,5,4,4,3,4,5,4],
  yardages    INTEGER[] NOT NULL DEFAULT ARRAY[385,175,510,410,360,195,395,525,420],
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (id = 1)
);

INSERT INTO course_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS score_holes (
  id             SERIAL PRIMARY KEY,
  submission_id  INTEGER NOT NULL REFERENCES score_submissions(id) ON DELETE CASCADE,
  hole_number    INTEGER NOT NULL CHECK (hole_number BETWEEN 1 AND 18),
  player_index   INTEGER NOT NULL CHECK (player_index IN (1, 2)),
  strokes        INTEGER NOT NULL CHECK (strokes >= 1),
  UNIQUE (submission_id, hole_number, player_index)
);

CREATE INDEX IF NOT EXISTS idx_score_holes_submission ON score_holes(submission_id);
