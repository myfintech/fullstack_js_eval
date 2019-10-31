/**
 * Write SQL that creates a table named 'addresses'
 * it should match this schema
 * id BIGSERIAL PRIMARY KEY
 * person_id BIGINT not null Foreign Key to people.id
 * line1 string with length 256 not null
 * line2 string with length 256
 * city string with length 256 not null
 * state string with length 256 not null
 * zip string with length 256 not null
 * created_at timetsamp with timezone not null default now()
 * updated_at timetsamp with timezone
 * deleted_at timetsamp with timezone
 ***/

CREATE TABLE addresses
(
    id BIGSERIAL PRIMARY KEY,
    person_id BIGINT REFERENCES people(id) NOT NULL,
    line1 VARCHAR(256) NOT NULL,
    line2 VARCHAR(256),
    city VARCHAR(256) NOT NULL,
    state VARCHAR(256) NOT NULL,
    zip VARCHAR(256) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE
)
