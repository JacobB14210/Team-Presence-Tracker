CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100),
    pass_hash VARCHAR(100),
    emp_type VARCHAR(100),
    sick INT DEFAULT 0,
    vacation INT DEFAULT 0,
    personal INT DEFAULT 0,
    non_work INT DEFAULT 0
);