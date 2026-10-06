# Database Design

The project uses PostgreSQL as the relational database.

## Main Tables

1. DEPARTMENTS
2. STUDENTS
3. ALUMNI
4. FACULTY
5. ADMIN
6. MENTORSHIP_REQUESTS
7. JOBS
8. JOB_APPLICATIONS
9. EVENTS
10. EVENT_ALUMNI_REQUESTS
11. EVENT_REGISTRATIONS

## STUDENTS

Stores information about current students.

* student_id — Primary Key
* name
* current_year
* dept_id — Foreign Key
* rollno
* gender
* email
* batch
* section
* password_hash — Authentication credential

## ALUMNI

Stores information about alumni and their professional details.

* alumni_id — Primary Key
* name
* batch
* dept_id — Foreign Key
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
* mentorship_available
* password_hash — Authentication credential

## FACULTY

Stores faculty information.

* faculty_id — Primary Key
* name
* designation
* dept_id — Foreign Key
* email
* gender
* password_hash — Authentication credential

## ADMIN

Stores administrator information.

* admin_id — Primary Key
* name
* password_hash — Authentication credential

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

Alumni can directly post jobs and internships. No separate approval status is used.

## JOB_APPLICATIONS

Stores student applications for jobs and internships.

* application_id — Primary Key
* job_id — Foreign Key
* student_id — Foreign Key
* status
* applied_at

## EVENTS

Stores college events created by faculty.

* event_id — Primary Key
* title
* description
* event_type
* start_time
* end_time
* location
* max_capacity
* registration_deadline
* created_by — Foreign Key to FACULTY

Faculty members create events and invite alumni to participate as speakers.

## EVENT_ALUMNI_REQUESTS

Stores invitations sent by faculty to alumni to participate as event speakers.

* request_id — Primary Key
* event_id — Foreign Key
* alumni_id — Foreign Key
* status
* requested_at
* responded_at

Possible statuses include:

* PENDING
* ACCEPTED
* REJECTED

Accepted requests represent the alumni speakers for an event.

## EVENT_REGISTRATIONS

Stores student registrations for events.

* registration_id — Primary Key
* event_id — Foreign Key
* student_id — Foreign Key
* registered_at
* attendance_status

Only students register for events. Alumni participate as invited speakers.

## AUTH_SESSIONS

Stores authenticated user sessions.

* session_id — Primary Key
* user_id
* role
* expires_at
* created_at

The role identifies which user table the user_id belongs to.

For example:

* STUDENT + user_id 1 → students.student_id = 1
* ALUMNI + user_id 1 → alumni.alumni_id = 1
* FACULTY + user_id 1 → faculty.faculty_id = 1
* ADMIN + user_id 1 → admin.admin_id = 1

## Main Relationships

* One department can have many students.
* One department can have many alumni.
* One department can have many faculty members.
* One student can send many mentorship requests.
* One alumni can receive many mentorship requests.
* One alumni can post many jobs.
* One student can submit many job applications.
* One job can receive many applications.
* One faculty member can create many events.
* One event can have many alumni speaker invitations.
* One alumni can receive many event speaker invitations.
* One event can have many student registrations.
* One student can register for multiple events.

## Authentication Design

Authentication is handled separately from the core profile information.

Each user role maintains its own table:

* STUDENTS
* ALUMNI
* FACULTY
* ADMIN

Each table stores a password hash rather than a plain-text password.

Authenticated sessions are stored in AUTH_SESSIONS.

The application uses the authenticated session to determine the current user's identity and role instead of using hardcoded user IDs.

## Design Notes

The initial version intentionally keeps the database simple. Separate tables are maintained for students, alumni, faculty, and administrators.

Company and skills are stored directly in the ALUMNI and JOBS tables rather than using separate COMPANY and SKILLS tables.

Q&A, notifications, and a separate alumni verification table are not included in the initial database design.