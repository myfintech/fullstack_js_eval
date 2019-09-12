CREATE TABLE addresses (
  id BIGSERIAL PRIMARY KEY,
  person_id BIGINT NOT NULL references people(id),
  line1 VARCHAR(256) NOT NULL,
  line2 VARCHAR(256),
  city VARCHAR(256) NOT NULL,
  state VARCHAR(256) NOT NULL,
  zip VARCHAR(256) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);