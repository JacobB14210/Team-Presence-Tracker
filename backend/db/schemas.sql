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

CREATE TABLE IF NOT EXISTS time_off (
    id INT AUTO_INCREMENT PRIMARY KEY,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason VARCHAR(50) NOT NULL,
    leave_early BOOLEAN DEFAULT FALSE,
    return_late BOOLEAN DEFAULT FALSE,
    leave_time TIME NULL,
    return_time TIME NULL
)