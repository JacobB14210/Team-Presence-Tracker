
INSERT INTO users(email,pass_hash,emp_type)
VALUES
('jacob@email.com','1','intern'),
('alice@email.com','2','full')

INSERT INTO users(email,pass_hash,emp_type)
VALUES
('jacob@email.com','1','intern')

SELECT email from users
where email = 'angelica@gmail.com'

DROp TABLE users