-- Adds profiles + team_members for user↔team mapping. Idempotent.

CREATE TABLE IF NOT EXISTS profiles (
  user_id       TEXT PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  display_name  TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(LOWER(email));

CREATE TABLE IF NOT EXISTS team_members (
  team_id        INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  player_index   INTEGER NOT NULL CHECK (player_index IN (1, 2)),
  user_id        TEXT REFERENCES profiles(user_id) ON DELETE SET NULL,
  assigned_email TEXT,
  PRIMARY KEY (team_id, player_index)
);

CREATE INDEX IF NOT EXISTS idx_team_members_user ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_email ON team_members(LOWER(assigned_email));

-- Seed empty member rows for any team that doesn't already have them
INSERT INTO team_members (team_id, player_index)
SELECT t.id, p.idx
FROM teams t
CROSS JOIN (VALUES (1), (2)) AS p(idx)
ON CONFLICT (team_id, player_index) DO NOTHING;
