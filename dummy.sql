\c userlogin;
DELETE FROM userdata;

-- Insert 10 different users into the "users" table

INSERT INTO userdata (username, password, loggedin) VALUES
  ('user1', '00000', TRUE),
  ('user2', '11111', FALSE),
  ('user3', '22222', TRUE),
  ('user4', '33333', FALSE),
  ('user5', '44444', TRUE),
  ('user6', '55555', FALSE),
  ('user7', '66666', TRUE),
  ('user8', '77777', FALSE),
  ('user9', '88888', TRUE),
  ('user10', '99999', FALSE);
  