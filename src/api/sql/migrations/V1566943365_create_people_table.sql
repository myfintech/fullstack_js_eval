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

create table people (
    id BIGSERIAL PRIMARY KEY, /*Creating the primary key for the entry in the table*/
    first_name VARCHAR(256) NOT NULL, /*First name of the person in the table*/
    last_name VARCHAR(256) NOT NULL, /*Last name of the person in the table*/
    birthday DATE NOT NULL, /*Birthday of the person in the table*/
    company VARCHAR(256) NOT NULL, /*Company of the person in the table*/
    title VARCHAR(256) NOT NULL, /*Title of the person in the table*/
    /*Timestamps for when the person was created/updated/deleted*/
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), 
    updated_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE
);