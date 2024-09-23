DROP TABLE IF EXISTS users.user;
DROP TABLE IF EXISTS users.post;

CREATE TABLE users.user (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE users.post (
  id SERIAL PRIMARY KEY,
  -- author_id INTEGER NOT NULL,
  author TEXT NOT NULL,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  message TEXT NOT NULL
  -- FOREIGN KEY (author_id) REFERENCES user (id)
);