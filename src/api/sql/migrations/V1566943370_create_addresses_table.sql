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

 CREATE TABLE addresses (
    id bigserial PRIMARY KEY,
    person_id bigint NOT NULL REFERENCES people (id),
    line1 character varying(256) NOT NULL,
    line2 character varying(256),
    city character varying(256) NOT NULL,
    state character varying(256) NOT NULL,
    zip character varying(256) NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
 );
