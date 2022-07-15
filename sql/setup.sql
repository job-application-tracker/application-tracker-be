-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`

DROP TABLE IF EXISTS trackers;
DROP TABLE IF EXISTS achievements;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email VARCHAR NOT NULL UNIQUE,
    password_hash VARCHAR NOT NULL,
    app_goal INT DEFAULT 3, 
    network_goal INT DEFAULT 3, 
    meetup_goal INT DEFAULT 3, 
    linkedin_goal INT DEFAULT 3, 
    code_goal INT DEFAULT 3
);


CREATE TABLE trackers (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   	index INT NOT NULL,
    status VARCHAR NOT NULL,
    user_id BIGINT NOT NULL,
    position VARCHAR NOT NULL,
    company VARCHAR NOT NULL,
    description VARCHAR,
    notes VARCHAR,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
    applied_at TIMESTAMPTZ,
    interviewed_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,  
    foreign key (user_id) references users(id)
);

CREATE TABLE achievements (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL,
  app_num INT DEFAULT 0,
  network_num INT DEFAULT 0,
  meetup_num INT DEFAULT 0,
  linkedin_num INT DEFAULT 0,
  code_num INT DEFAULT 0,
  year INT NOT NULL,
  week INT NOT NULL,
  foreign key (user_id) references users(id)
)
