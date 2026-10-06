# College Alumni Connect

## Project Overview

College Alumni Connect is a full-stack web platform designed to connect current students, alumni, faculty, and college administrators on a single platform.

The system provides a centralized space for alumni networking, mentorship, job and internship opportunities, and college events.

## Objectives

* Connect students with alumni.
* Provide mentorship opportunities.
* Allow alumni to share job and internship opportunities.
* Manage college and alumni events.
* Provide separate access based on user roles.
* Provide an organized platform for alumni networking.

## User Roles

### Student

* Manage profile
* Search alumni
* Request mentorship
* View and apply for jobs/internships
* Register for events

### Alumni

* Manage profile
* Share professional information
* Accept or reject mentorship requests
* Post jobs and internships
* Accept or reject event speaker invitations
* Participate in college events as invited speakers

### Faculty

* Manage profile
* View alumni information
* Create and manage events
* Invite alumni as event speakers

### Admin

* Manage users
* View platform statistics
* Manage jobs and internships
* Manage events
* Manage the overall platform

## Main Modules

* Authentication
* Role-Based Access Control
* Student Management
* Alumni Management
* Faculty Management
* Admin Management
* Alumni Directory
* Mentorship
* Jobs & Internships
* Events
* Event Registration

## Technology Stack

* Frontend: Next.js, TypeScript, Tailwind CSS
* Backend: Next.js API Routes
* Database: PostgreSQL
* Database Driver: node-postgres (`pg`)
* Authentication: Custom session-based authentication
* Password Hashing: bcrypt
* Charts: Recharts
* Version Control: Git & GitHub
* Deployment: Vercel

## Project Structure

```text
alumni-connect-db/
├── README.md
├── docs/
│   ├── database-design.md
│   ├── er-diagram.md
│   └── project-requirements.md
├── database/
│   └── schema.sql
└── frontend/
    ├── app/
    ├── lib/
    ├── public/
    ├── package.json
    └── ...