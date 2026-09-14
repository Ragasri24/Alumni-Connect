# Database Design

The project uses PostgreSQL as the relational database.

## Main Tables

1. STUDENTS
2. ALUMNI
3. FACULTY
4. ADMIN
5. DEPARTMENTS
6. MENTORSHIP_REQUESTS
7. JOBS
8. JOB_APPLICATIONS
9. EVENTS
10. EVENT_REGISTRATIONS

## STUDENTS

Stores information about current students.

* student_id — Primary Key
* name
* current_year
* dept
* rollno
* gender
* email
* batch
* section

## ALUMNI

Stores information about alumni and their professional details.

* alumni_id — Primary Key
* name
* batch
* dept
* rollno
* section
* email
* gender
* location
* company
* job_role
* skills
* mentorships_done
* linkedin
* past_job_roles
* events_attended

## FACULTY

Stores faculty information.

* faculty_id — Primary Key
* name
* designation
* dept
* email
* gender

## ADMIN

Stores administrator information.

* admin_id — Primary Key
* name
* password_hash

## DEPARTMENTS

Stores department information.

* dept_id — Primary Key
* dept_name
* dept_code

## MENTORSHIP_REQUESTS

Stores mentorship requests between students and alumni.

* request_id — Primary Key
* student_id — Foreign Key
* alumni_id — Foreign Key
* message
* status
* created_at
* responded_at

## JOBS

Stores jobs and internship opportunities posted by alumni.

* job_id — Primary Key
* alumni_id — Foreign Key
* title
* company
* type
* location
* work_mode
* description
* application_link
* deadline
* status

## JOB_APPLICATIONS

Stores student applications for jobs and internships.

* application_id — Primary Key
* job_id — Foreign Key
* student_id — Foreign Key
* status
* applied_at

## EVENTS

Stores college and alumni events.

* event_id — Primary Key
* title
* description
* event_type
* start_time
* end_time
* location
* max_capacity
* registration_deadline
* created_by
* status

## EVENT_REGISTRATIONS

Stores registrations for events.

* registration_id — Primary Key
* event_id — Foreign Key
* student_id — Foreign Key
* alumni_id — Foreign Key
* registered_at
* attendance_status

## Main Relationships

* One department can have many students.
* One department can have many alumni.
* One department can have many faculty members.
* One alumni can receive many mentorship requests.
* One student can send many mentorship requests.
* One alumni can post many jobs.
* One student can submit many job applications.
* One job can receive many applications.
* One event can have many registrations.
* A student or alumni can register for multiple events.

## Design Notes

The initial version intentionally keeps the database simple. Separate tables are maintained for students, alumni, faculty, and administrators.

Company and skills are stored directly in the ALUMNI table for the initial version rather than using separate COMPANY and SKILLS tables.

Q&A, notifications, and a separate alumni verification table are not included in the initial database design.
