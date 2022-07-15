-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`

DROP TABLE IF EXISTS trackers;
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
INSERT INTO users (email, password_hash) VALUES ('email', 'pass');


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


INSERT INTO trackers (
    user_id,
    position,
    company,
    status,
  	index
    )

VALUES 
(1, 'Full-stack Engineer', 'Spotify', 'Saved', 0), 
(1, 'Developer 1', 'Peloton', 'Applied', 0), 
(1, 'Junior Developer', 'Netflix', 'Interviewing', 0),  
(1, 'Full-stack Engineer', 'Google', 'Ghosted', 0), 
(1, 'Developer 1', 'Hydroflask', 'Rejected', 0), 
(1, 'Junior Developer', 'Samsung', 'Accepted', 0),
(1, 'Full-stack Engineer Jr.', 'Amazon', 'Saved', 1), 
(1, 'Developer 1', 'IBM', 'Applied', 1), 
(1, 'Junior Developer', 'Dell', 'Interviewing', 1),  
(1, 'Full-stack Engineer', 'Apple', 'Ghosted', 1), 
(1, 'Developer 1', 'Chase', 'Rejected', 1), 
(1, 'Junior Developer', 'Microsoft', 'Accepted', 1)


