# 📘 Student Management System — Client

![Status](https://img.shields.io/badge/Status-Active-success)
![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-6.0-purple)
![License](https://img.shields.io/badge/License-MIT-green)

A professional, enterprise-grade frontend application for managing student records. This Secure Single Page Application (SPA) allows authorized administrators to perform CRUD operations, track usage, and manage users within a secure environment.

---

## 📌 Project Overview

This client-side application serves as the user interface for the Student Management System. It acts as a dashboard for `Admin` users to manage student enrollment data securely.

**Key Capabilities:**
- 🛡️ **Secure Access:** Role-based access control protecting sensitive student data.
- ⚡ **Real-time UX:** Instant feedback with toast notifications and optimistic UI updates.
- 🌓 **Theme Support:** Native dark mode / light mode toggle.
- 📱 **Mobile First:** Fully responsive design that works on desktop, tablets, and mobile devices.

---

## ✨ Features

- **🔐 Authentication System:**
  - Secure Login & Signup with JWT handling.
  - Automatic session expiration & silent refresh.
  - Role-based route guards (Admin-only areas).
  - Account deletion and Profile management.

- **🎓 Student Management:**
  - Full CRUD operations (Create, Read, Update, Delete).
  - Advanced tabular view with pagination and search.
  - Detail view for individual student profiles.

- **🖌️ User Interface:**
  - **Dashboard:** Overview of system status.
  - **Notifications:** Integrated toast notification system for success/error feedback.
  - **Loaders:** Custom skeleton loaders and splash screens for smooth transitions.
  - **Modals:** Accessible, portal-based modals for actions (Delete/Edit).

---

## 🛠 Tech Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black) | React 19 with TypeScript |
| **Build Tool** | ![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white) | Fast HMR bundler |
| **Styling** | ![Tailwind](https://img.shields.io/badge/-TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white) | Utility-first CSS framework (v4) |
| **HTTP Client** | ![Axios](https://img.shields.io/badge/-Axios-5A29E4?logo=axios&logoColor=white) | Promise-based HTTP client |
| **Animations** | `framer-motion` | Declarative animations for UI components |
| **Icons** | `lucide-react` | Clean, consistent SVG icons |
| **Routing** | `react-router-dom` | Client-side routing with v7 |

---

## 📁 Project Structure

```bash
Client/src/
├── api/                 # Axios configuration and API endpoints
├── components/          # Reusable UI components
│   ├── students/        # Student-feature specific components
│   ├── ui/              # Generic UI elements (Modals, Icons)
│   ├── Footer.tsx
│   ├── LoginSignup.tsx
│   ├── Navbar.tsx
│   ├── ProfileModal.tsx
│   └── Sidebar.tsx
├── context/             # React Context (AuthContext, NotificationContext)
├── guards/              # Route guards (RoleGuard, AuthGuard)
├── pages/               # Page components (Home, Students, Unauthorized)
├── App.tsx              # Main application entry & routing rules
├── main.tsx             # DOM entry point
└── index.css            # Global styles & Tailwind configuration
```

---

## ⚙️ Prerequisites

Ensure you have the following installed before starting:
- **Node.js**: v18 or higher
- **npm** or **yarn**
- **Backend API**: The server must be running on `http://localhost:5000` (default) or configured in `.env`.

---

## 🚀 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/student-management-app.git
   cd student-management-app/Client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root of the `Client` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   > The app will launch at `http://localhost:5173`.

---

## 🔐 Authentication Flow

1. **Login:** Users authenticate via email/password.
2. **Token Storage:** Upon success, the server returns a **JWT** which is stored in `localStorage`.
3. **Guard Checking:** 
   - `RoleGuard` checks the user's role (e.g., `admin`).
   - If unauthorized, the user is redirected to `/unauthorized`.
4. **Interceptors:** Axios interceptors attach the `Bearer [token]` to every outgoing request and handle global `401 Unauthorized` errors by logging the user out.

---

## 🌐 API Integration

We use a centralized **Axios Client** (`src/api/axiosClient.ts`) to manage all HTTP requests.

- **Auto-Injection:** Authentication headers are automatically injected into requests.
- **Error Types:**
  - `401`: Token expired/invalid → Redirect to Login.
  - `403`: Forbidden access → Redirect to Unauthorized page.
  - `404`: Resource not found → Show specific error UI.

---

## 🧪 Testing the Client

To manually verify the application:

1. **Start the App:** `npm run dev`.
2. **Test Auth:** 
   - Try accessing `/students` without logging in (Should redirect to Home/Login).
   - Log in with valid credentials.
3. **Test Features:**
   - Create a new student (Admin only).
   - Edit that student's details (Admin only).
   - Delete the student (verify the confirmation modal).
   - Toggle Dark/Light mode in the Navbar.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

