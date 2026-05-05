# Team Task Manager (Full-Stack)

A role-based full-stack web application where Admins can create projects and assign tasks, and Members can track and complete their assigned work with timelines and status updates.

---

## Features

### Admin

* Create projects (title, description, deadline, submission type)
* Assign projects/tasks to members
* Search projects and members
* View all tasks and timelines
* Track project status (Running / Completed / Overdue)

### 👤 Member

* View assigned projects
* Expand project details
* Submit work (based on submission type)
* Update task status:

  * Assigned → Accepted → In Progress → Submitted
* View timeline history

---

## Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS / Inline Styling
* Axios

### Backend

* Node.js
* Express.js
* File-based storage (JSON)

---

## Project Structure

```
team-task-manager/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── data/
│   ├── server.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │
│   ├── index.html
│
├── package.json
└── README.md
```

---

## Default Login Credentials

### Admin

```
Email: admin@test.com
Password: 123456
```

###  Member

```
Email: member@test.com
Password: 123456
```

---

##  Setup Instructions

###  1. Clone Repository

```bash
git clone https://github.com/harshita-0717/team-task-manager.git
cd team-task-manager
```

---

### 2️. Run Backend

```bash
cd backend
npm install
node server.js
```

Backend runs on:

```
http://localhost:5000
```

---

### 3️. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 👩‍💻 Author

**Harshita**

---
