CREATE DATABASE IF NOT EXISTS team_data;
USE team_data;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100),
    name VARCHAR(100),
    pass_hash VARCHAR(100),
    emp_type VARCHAR(100),
    sick DECIMAL(6,2) DEFAULT 0,
    vacation DECIMAL(6,2) DEFAULT 0,
    personal DECIMAL(6,2) DEFAULT 0,
    non_work DECIMAL(6,2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS time_off (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status VARCHAR(50),
    user_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason VARCHAR(50) NOT NULL,
    leave_early BOOLEAN DEFAULT FALSE,
    return_late BOOLEAN DEFAULT FALSE,
    leave_time TIME NULL,
    return_time TIME NULL,
    total_hours DECIMAL(6,2) DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
);