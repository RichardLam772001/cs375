/*Operation to create the database*/
DROP DATABASE IF EXISTS cyberspace;
CREATE DATABASE cyberspace;
\c cyberspace;

DROP TABLE IF EXISTS userdata;
CREATE TABLE userdata (
	username VARCHAR(50) PRIMARY KEY,
	password VARCHAR,
	wins INT DEFAULT 0,
	losses INT DEFAULT 0
);
