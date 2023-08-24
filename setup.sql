/*Operation to create the database*/
DROP DATABASE IF EXISTS cyberspace;
CREATE DATABASE cyberspace;
\c cyberspace;

CREATE TABLE userdata (
	username VARCHAR(50) PRIMARY KEY,
	password VARCHAR,
	wins INT DEFAULT 0,
	losses INT DEFAULT 0
);
