# TaskManager 📋

A modern, highly-responsive, and minimalist Task Management system featuring Kanban boards, role-based access control, and a sleek Pitch-Black Dark Mode aesthetic.

## ✨ Features

- **Role-Based Access Control (RBAC):**
  - **Admin:** Can create Managers, view all project statistics, and manage system resources.
  - **Manager:** Can create projects (boards), invite employees, create/edit tasks, and move tasks across the Kanban board.
  - **Employee:** Can view assigned boards, view assigned tasks, and move tasks to update their status (e.g., from 'Todo' to 'Done').
- **Interactive Kanban Boards:** Full drag-and-drop support for tasks across custom lists.
- **Activity Logging:** Real-time tracking of task movements, creations, and edits by team members.
- **Minimalist Aesthetic:** A highly professional UI design with support for System, Light, and a true Pitch-Black Dark theme.
- **Secure Authentication:** JWT-based authentication with encrypted passwords and secure endpoints.

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- Context API (for Global State Management and Theming)
- CSS Variables (for seamless theme transitions)
- `@hello-pangea/dnd` (for Drag & Drop)
- `lucide-react` (for SVG Icons)

**Backend:**
- Java 17+
- Spring Boot 3
- Spring Security (JWT)
- Spring Data JPA
- PostgreSQL Database

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Java 17 (JDK)
- PostgreSQL running locally or remotely

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Configure your database settings in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/taskmanager
   spring.datasource.username=your_db_username
   spring.datasource.password=your_db_password
   ```
3. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
   *(The server will start on port 8080)*

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *(The Vite server will start on port 5173)*

## 🎨 Theme System

TaskManager uses a modern CSS-variable approach to theming. To override or adjust the UI colors, you can find the design tokens inside `frontend/src/index.css`. The application supports `System` preference out-of-the-box.

## 🔒 Security Notes

- Employees are restricted from creating or deleting tasks. They may only move tasks they have access to.
- Spring Method Security (`@PreAuthorize`) is actively used to block unauthorized backend API access even if frontend elements are manipulated.

---
### Screenshots
<img width="1320" height="774" alt="brave_R4qjGGzc5n" src="https://github.com/user-attachments/assets/90b841b4-bcc2-483b-86cb-77652fd30044" />
<img width="1320" height="774" alt="brave_ghTTuVvjrT" src="https://github.com/user-attachments/assets/7bbfe66b-b477-4a3f-bd2d-cb1852c8c88e" />
<img width="1320" height="774" alt="brave_5TnR6Pbp5M" src="https://github.com/user-attachments/assets/46c52e29-f48d-4e4d-91ae-3fbcec6f2dbb" />
<img width="1320" height="774" alt="brave_0XEYabf6bE" src="https://github.com/user-attachments/assets/df3b6057-38a6-4512-996b-86011d339808" />


