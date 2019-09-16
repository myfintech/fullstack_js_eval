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

create table addresses (
    id BIGSERIAL PRIMARY KEY, /*Creating the primary key for the entry in the table*/
    /*Foreign key associating this entry to an id in the people table*/
    person_id BIGINT NOT NULL, 
    FOREIGN KEY (person_id) REFERENCES people(id),
    line1 VARCHAR(256) NOT NULL, /*Line 1 for the address*/
    line2 VARCHAR(256), /*Line 2 for the address*/
    city VARCHAR(256) NOT NULL, /*City for the address*/
    state VARCHAR(256) NOT NULL, /*State for the address*/
    zip VARCHAR(256) NOT NULL, /*Zipcode for the address*/
    /*Timestamps for when the address was created/updated/deleted*/
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE
);