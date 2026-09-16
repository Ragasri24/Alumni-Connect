-- College Alumni Connect
-- Complete PostgreSQL Database Schema

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

-- 6. Mentorship Requests
CREATE TABLE mentorship_requests (
    request_id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,
    alumni_id INT NOT NULL,
    message TEXT,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP,

    FOREIGN KEY (student_id)
        REFERENCES students(student_id),

    FOREIGN KEY (alumni_id)
        REFERENCES alumni(alumni_id)
);

-- 7. Jobs
CREATE TABLE jobs (
    job_id SERIAL PRIMARY KEY,
    alumni_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    company VARCHAR(150) NOT NULL,
    type VARCHAR(20) NOT NULL,
    location VARCHAR(150),
    work_mode VARCHAR(20),
    description TEXT,
    application_link VARCHAR(500),
    deadline DATE,

    FOREIGN KEY (alumni_id)
        REFERENCES alumni(alumni_id)
);

-- 8. Job Applications
CREATE TABLE job_applications (
    application_id SERIAL PRIMARY KEY,
    job_id INT NOT NULL,
    student_id INT NOT NULL,
    status VARCHAR(20) DEFAULT 'APPLIED',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (job_id)
        REFERENCES jobs(job_id),

    FOREIGN KEY (student_id)
        REFERENCES students(student_id)
);

-- 9. Events
CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    event_type VARCHAR(50),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    location VARCHAR(150),
    max_capacity INT,
    registration_deadline DATE,
    created_by INT NOT NULL,

    FOREIGN KEY (created_by)
        REFERENCES faculty(faculty_id)
);

-- 10. Event Alumni Requests
CREATE TABLE event_alumni_requests (
    request_id SERIAL PRIMARY KEY,
    event_id INT NOT NULL,
    alumni_id INT NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP,

    FOREIGN KEY (event_id)
        REFERENCES events(event_id),

    FOREIGN KEY (alumni_id)
        REFERENCES alumni(alumni_id)
);

-- 11. Event Registrations
CREATE TABLE event_registrations (
    registration_id SERIAL PRIMARY KEY,
    event_id INT NOT NULL,
    student_id INT NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    attendance_status VARCHAR(20) DEFAULT 'REGISTERED',

    FOREIGN KEY (event_id)
        REFERENCES events(event_id),

    FOREIGN KEY (student_id)
        REFERENCES students(student_id)
);