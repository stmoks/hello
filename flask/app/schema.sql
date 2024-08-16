DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS post;

CREATE TABLE users.user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE users.post (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  -- author_id INTEGER NOT NULL,
  author TEXT NOT NULL,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  message TEXT NOT NULL
  -- FOREIGN KEY (author_id) REFERENCES user (id)
);