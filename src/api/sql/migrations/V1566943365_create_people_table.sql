/**
 * Write SQL that creates a table named 'people'
 * it should match this schema
 * id BIGSERIAL PRIMARY KEY
 * first_name string with length 256 not null
 * last_name string with length 256 not null
 * birthday date not null
 * company string with length 256
 * title string with length 256
 * created_at timestamp with timezone not null defaults to now
 * updated_at timestamp with timezone
 * deleted_at timestamp with timezone
 ***/
 CREATE TABLE people (
  id BIGSERIAL PRIMARY KEY,
  first_name CHARACTER VARYING(256) NOT NULL,
  last_name CHARACTER VARYING(256) NOT NULL,
  birthday DATE NOT NULL,
  company CHARACTER VARYING(256),
  title CHARACTER VARYING(256),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE
)