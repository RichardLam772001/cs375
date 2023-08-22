/*Operation to create the database*/
DROP DATABASE IF EXISTS cyberspace;
CREATE DATABASE cyberspace;
\c cyberspace;

CREATE TABLE userdata (
	username VARCHAR(50) PRIMARY KEY,
	password VARCHAR
);

ALTER TABLE userdata;
ADD COLUMN wins INT DEFAULT 0;
ADD COLUMN losses INT DEFAULT 0;
