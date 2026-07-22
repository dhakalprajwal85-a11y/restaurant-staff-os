# Restaurant Staff OS

## Project Overview

Restaurant Staff OS is a complete restaurant management system built for restaurant owners and employees.

### Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase
- AWS Amplify (Deployment)
- GitHub

---

# Current Version

v0.4

---

# Project Structure

```
app/
components/
docs/
hooks/
lib/
public/
```

---

# Manager Module

## Authentication

- ✅ Manager Login
- ✅ Logout

## Dashboard

- ✅ Dashboard UI

## Workers

- ✅ Create Worker
- ✅ Edit Worker
- ✅ Delete Worker

## Schedule

- ✅ Add Schedule
- ✅ Delete Schedule
- ⏳ Edit Schedule

## Attendance

- ✅ Attendance Page
- ⏳ Live Attendance

## Tasks

- ✅ Create Task
- ✅ Delete Task
- ✅ Upload Photo

## Settings

- ✅ Account Settings
- ✅ Restaurant Name

---

# Worker Module

## Authentication

- ✅ Worker Login

## Dashboard

- ✅ Worker Dashboard

## Attendance

- ⏳ Clock In
- ⏳ Clock Out
## Tasks

- ⏳ My Tasks

## Schedule

- ⏳ My Schedule

## Profile

- ⏳ Profile Page

---

# Database Tables

## workers

- id
- name
- email
- login_id
- password
- phone
- position
- hourly_wage
- role
- status
- created_at

---

## profiles

- id
- worker_id
- role
- full_name

---

## attendance

- id
- worker_id
- work_date
- clock_in
- clock_out
- status

---

## schedules

- id
- worker_id
- work_date
- start_time
- end_time
- position
- note
- status

---

## tasks

- id
- title
- description
- worker_id
- status
- photo_url

---

# Routes

## Manager

/login

/dashboard

/workers

/attendance

/tasks

/schedule

/settings

---

## Worker

/worker-login

/worker-app

/worker-app/attendance

/worker-app/tasks

/worker-app/schedule

/worker-app/profile

---

# Completed Features

- Manager Authentication
- Worker Authentication
- Worker Dashboard
- Worker Account Creation
- Workers CRUD
- Tasks
- Schedule
- Attendance Page
- Settings
- Multi-language Support (Basic)

---

# Current Development

## Current Task

Worker Attendance System

---

# Future Features

## High Priority

- Worker Attendance
- Worker Schedule
- Worker Tasks
- Payroll
- Leave Request

---

## Medium Priority

- QR Attendance
- Push Notifications
- Announcements
- Payslip

---

## Advanced

- Inventory
- Sales Dashboard
- Analytics
- Multi Restaurant
- AI Assistant
- Mobile PWA

---

# Known Issues

- Worker attendance not connected to database
- Worker tasks not connected
- Schedule needs editing feature
- Payroll not started

---

# Development Rules

- Always use TypeScript
- Use Server Components when possible
- Use Client Components only when necessary
- Use Supabase as the single database
- Keep Manager and Worker modules separate
- Do not duplicate pages
- Every new feature must update this MASTER document

---

# Next Feature

Build the complete Worker Attendance System.

---

# Notes

Manager login:

/login

Worker login:

/worker-login

Worker dashboard:

/worker-app

Manager dashboard:

/dashboard

---

# Version History

v0.1

- Project Started

v0.2

- Manager Module

v0.3

- Worker Authentication

v0.4

- Worker Dashboard