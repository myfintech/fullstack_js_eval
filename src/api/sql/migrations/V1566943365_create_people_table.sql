CREATE TABLE people (
  id BIGSERIAL PRIMARY KEY,
  first_name VARCHAR(256) NOT NULL,
  last_name VARCHAR(256) NOT NULL,
  birthday DATE NOT NULL,
  company VARCHAR(256),
  title VARCHAR(256),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);