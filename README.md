# Campus Placement Management Portal 🚀

A modern, high-performance career and placement management system designed for **Campus Placement**. This platform streamlines the recruitment workflow for students, companies, and administrators, featuring AI-powered optimizations and a premium user experience.

---

## 🌟 Key Features

### 👨‍🎓 For Students
- **Smart Job Search**: Filter and discover opportunities across various domains with a global search autocomplete.
- **AI Match Score**: Integration with Google Gemini AI to analyze resume-to-job compatibility.
- **Portfolio Management**: Build and manage detailed profiles, including education, skills, and projects.
- **Application Tracking**: Real-time status updates on submitted applications.
- **Native Experience**: Full support for standard browser navigation (Ctrl+Click, Open in New Tab) for all job listings.

### 🏢 For Companies
- **Job Lifecycle Management**: Post, edit, and manage job openings through a dedicated dashboard.
- **Applicant Tracking System (ATS)**: Review student profiles and download resumes directly.
- **Company Branding**: Customizable profile section to showcase the organization's culture and "Life at Company."

### 🛡️ For Administrators
- **Global Overview**: Manage all student registrations, company partnerships, and job postings.
- **Data-Driven Insights**: Export reports and placement statistics (PDF/CSV).
- **Secure Control**: Role-based access control (RBAC) ensuring data integrity and privacy.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js (Vite), Tailwind CSS (JIT Engine), React Router v6 |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (NoSQL) |
| **Authentication** | JSON Web Tokens (JWT) with HTTP-only cookies |
| **AI Integration** | Google Gemini API (Matched Skills & Placement Tips) |
| **Icons** | Google Material Symbols |

---

## 📂 Project Structure

```text
placement-management-portal/
├── frontend/               # React Vite Application
│   ├── src/
│   │   ├── components/     # Reusable UI (Navbar, Layout, Auth)
│   │   ├── pages/          # Core views (Home, Dashboard, JobDetails)
│   │   ├── services/       # Axios API configurations
│   │   └── styles/         # Tailwind CSS & Global design tokens
├── campus-placement-backend/ # Node.js Express Server
│   ├── controllers/        # Business logic for Jobs, Users, Apps
│   ├── models/             # Mongoose schemas (Job, User, Application)
│   ├── routes/             # API routing definitions
│   └── middleware/         # Auth & File upload handlers
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16.x or higher)
- MongoDB (Local or Atlas)
- NPM or Yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-link>
   cd placement-management-portal
   ```

2. **Backend Setup**
   ```bash
   cd campus-placement-backend
   npm install
   # Create a .env file with:
   # MONGO_URI, JWT_SECRET, PORT, GEMINI_API_KEY
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

---

## ⚡ Performance Optimizations
The current version of the portal has been optimized for speed and modern browsing:
- **Pruned Codebase**: Removed all redundant console logs and unused hooks/dependencies.
- **SPA Navigation**: Converted all navigation triggers to React Router `<Link>` components to enable faster, native browser-level transitions.
- **Optimized DOM**: Resolved invalid DOM nesting (no nested `<a>` or `<button>` tags) to ensure smooth rendering and strict React compliance.

---

## 📄 License
Designed and Developed (College Name). All rights reserved.
