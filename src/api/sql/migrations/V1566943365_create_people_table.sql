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
     id bigserial PRIMARY KEY,
     first_name varchar(256) not null,
     last_name varchar(256) not null,
     birthday date not null,
     company varchar(256),
     title varchar(256),
     created_at timestamptz not null default now(),
     updated_at timestamptz,
     deleted_at timestamptz
 )

 