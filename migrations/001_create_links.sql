-- migrations/001_create_links.sql
-- Run with: psql "$DATABASE_URL" -f migrations/001_create_links.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  target_url text NOT NULL,
  total_clicks integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_clicked timestamptz NULL
);

-- index on code exists via unique; add index on last_clicked if desired
CREATE INDEX IF NOT EXISTS idx_links_last_clicked ON links (last_clicked);
