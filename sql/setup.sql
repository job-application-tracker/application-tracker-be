-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email VARCHAR NOT NULL,
    password_hash VARCHAR NOT NULL,
    app_goal INT DEFAULT 3, 
    network_goal INT DEFAULT 3, 
    meetup_goal INT DEFAULT 3, 
    linkedin_goal INT DEFAULT 3, 
    code_goal INT DEFAULT 3
);
