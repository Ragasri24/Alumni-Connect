# ER Diagram

The ER diagram represents the entities, attributes, keys, and relationships used in the College Alumni Connect system.

The final ER diagram will be added after the database relationships and constraints are finalized.

## Main Entities

* STUDENTS
* ALUMNI
* FACULTY
* ADMIN
* DEPARTMENTS
* MENTORSHIP_REQUESTS
* JOBS
* JOB_APPLICATIONS
* EVENTS
* EVENT_REGISTRATIONS

## Major Relationships

* DEPARTMENTS → STUDENTS
* DEPARTMENTS → ALUMNI
* DEPARTMENTS → FACULTY
* STUDENTS → MENTORSHIP_REQUESTS ← ALUMNI
* ALUMNI → JOBS
* STUDENTS → JOB_APPLICATIONS ← JOBS
* EVENTS → EVENT_REGISTRATIONS ← STUDENTS / ALUMNI

The final visual ER diagram will be added to this directory.
