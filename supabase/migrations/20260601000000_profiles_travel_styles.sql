-- Travel style tags for member profiles.
-- Members choose up to 8 editorial phrases that describe how they travel.
-- These travel alongside profile identity and can power future discovery filters.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS travel_styles text[] NOT NULL DEFAULT '{}';

ALTER TABLE profiles
  ADD CONSTRAINT profiles_travel_styles_cardinality
  CHECK (cardinality(travel_styles) <= 8);

-- GIN index: enables future @> / && operator queries (e.g. find members by travel style).
CREATE INDEX IF NOT EXISTS profiles_travel_styles_gin
  ON profiles USING GIN (travel_styles);
