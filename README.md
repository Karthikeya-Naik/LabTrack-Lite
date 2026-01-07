# 🧪 LabTrack Lite  
### R&D Asset & Ticketing Platform

LabTrack Lite is a lightweight web-based platform designed to manage **lab assets**, **issue tickets**, and **maintenance workflows** with **role-based access control**, **secure APIs**, and an **interactive dashboard**.

---

## 🚀 Live Demo

- **Frontend (Netlify):** [https://your-frontend-url.netlify.app](https://vision-labtracklite.netlify.app/)  
- **Backend API (Render):** [https://labtrack-backend.onrender.com](https://labtrack-backend-05i5.onrender.com/)

---

## 🎯 Problem Statement

Research labs often lack a centralized system to:
- Track lab assets
- Report and resolve issues
- Assign responsibilities

**LabTrack Lite** solves this by providing a secure, role-based, and accessible platform.

---

## 🧩 Key Features

### 🔐 Authentication & Security
- JWT-based authentication
- Role-Based Access Control (RBAC)
- Admin-controlled user provisioning

### 👥 User Roles
- **Admin** – Manage users, assets, assign tickets
- **Engineer** – Create tickets, update status, comment
- **Technician** – Resolve tickets, update status, comment

### 🧰 Asset Management
- Asset CRUD operations
- Asset status tracking (Active, Maintenance, Damaged, etc.)

### 🎫 Ticketing System
- Create and manage tickets
- Status lifecycle (Open → In Progress → Resolved → Closed)
- Commenting and assignment

### 🤖 Chatbot (NLQ)
- Rule-based Natural Language Query system
- Query assets and tickets using plain English
- Secure, backend-driven responses

### 📊 Dashboard & Analytics
- KPI cards
- Bar charts for ticket and asset status
- Role-based quick actions
- Real-time data from backend

### ♿ Accessibility
- WCAG 2.2 AA compliant UI
- Keyboard navigation
- ARIA roles and labels
- High-contrast, readable design

---

## 🏗️ Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Recharts (Charts)
- Axios
- React Router

### Backend
- Node.js
- Express.js
- Prisma ORM
- JWT Authentication
- bcrypt.js

### Database
- PostgreSQL (Supabase)

### Deployment
- Frontend: **Netlify**
- Backend: **Render**
- Database: **Supabase**

---

## 📁 Project Structure
```
labtrack-lite/
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── services/
│ │ ├── context/
│ │ └── hooks/
│ └── netlify.toml
│
├── backend/
│ ├── controllers/
│ ├── routes/
│ ├── middlewares/
│ ├── prisma/
│ └── server.js
│
└── README.md
```
---

---

## 🎤 Demo Flow

Login as Admin
View dashboard analytics
Create a user
Manage assets
Create & update tickets
Use chatbot queries

---

## 📌 Future Enhancements

Advanced analytics
Export reports

---

## 🧩 Clone & Run Locally

Follow these steps to set up **LabTrack Lite** on your local machine.

---

### 🔹 Prerequisites

Make sure you have the following installed:

- **Node.js** (v18 or higher)
- **Git**
- **PostgreSQL** (or a **Supabase** account)
- **npm** (comes with Node.js)

---

### 🔹 Step 1: Clone the Repository

```bash
git clone https://github.com/<your-username>/labtrack-lite.git
cd labtrack-lite
```

### 🔹 Step 2: Backend Setup

```bash
cd backend
npm install
npm run dev
http://localhost:5000
```

### 🔹 Step 3: Frontend Setup

```bash
cd frontend
npm install
npm run dev
http://localhost:5173
```

### 🔹 Step 4: Login Credentials

```bash
Email: admin@labtrack.com
Password: admin123
```

### 🔹 Step 5: Access the Application

```bash
http://localhost:5173
```
