/*Operation to create the database*/
/*CREATE DATABASE userlogin;*/
\c userlogin;

CREATE TABLE userdata (
	username VARCHAR(50) PRIMARY KEY,
	password VARCHAR,
	loggedin BOOLEAN
);

