-- College Alumni Connect
-- Initial PostgreSQL Database Schema

-- 1. Departments
CREATE TABLE departments (
    dept_id SERIAL PRIMARY KEY,
    dept_name VARCHAR(100) NOT NULL,
    dept_code VARCHAR(20) UNIQUE NOT NULL
);

-- 2. Students
CREATE TABLE students (
    student_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    current_year INT NOT NULL,
    dept_id INT NOT NULL,
    rollno VARCHAR(30) UNIQUE NOT NULL,
    gender VARCHAR(20),
    email VARCHAR(150) UNIQUE NOT NULL,
    batch INT NOT NULL,
    section VARCHAR(10),

    FOREIGN KEY (dept_id)
        REFERENCES departments(dept_id)
);

-- 3. Alumni
CREATE TABLE alumni (
    alumni_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    batch INT NOT NULL,
    dept_id INT NOT NULL,
    rollno VARCHAR(30),
    section VARCHAR(10),
    email VARCHAR(150) UNIQUE NOT NULL,
    gender VARCHAR(20),
    location VARCHAR(150),
    company VARCHAR(150),
    job_role VARCHAR(100),
    skills TEXT,
    mentorships_done INT DEFAULT 0,
    linkedin VARCHAR(255),
    past_job_roles TEXT,
    events_attended INT DEFAULT 0,

    FOREIGN KEY (dept_id)
        REFERENCES departments(dept_id)
);

-- 4. Faculty
CREATE TABLE faculty (
    faculty_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    designation VARCHAR(100),
    dept_id INT NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    gender VARCHAR(20),

    FOREIGN KEY (dept_id)
        REFERENCES departments(dept_id)
);

-- 5. Admin
CREATE TABLE admin (
    admin_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);