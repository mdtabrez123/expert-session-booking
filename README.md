# 🚀 ExpertBook: Real-Time Expert Session Booking System

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

ExpertBook is a high-performance, full-stack booking platform that connects users with industry experts for 1-on-1 sessions. Designed with a focus on **real-time synchronization** and **concurrency safety**, it provides a premium user experience with zero-latency updates and a sleek, modern aesthetic.

---

## 🔗 Live Demo
-   **Frontend**: [expertbook-client.onrender.com](https://expertbook-client.onrender.com) (Placeholder)
-   **API**: [expertbook-api.onrender.com](https://expertbook-api.onrender.com) (Placeholder)

---

## ✨ Features

### 📡 Real-Time Slot Synchronization
Never see a stale slot again. Using **WebSockets (Socket.io)**, the platform broadcasts booking events to all connected clients instantly. When a user books a slot, it is disabled on every other user's screen in real-time, preventing frustration and unnecessary clicks.

### 🛡️ Race Condition Prevention
We handle high-traffic booking scenarios with a double-layered defense:
1.  **Application-Level Validation**: The server checks slot availability before processing.
2.  **Database-Level Atomic Locks**: A compound unique index in MongoDB (`expertId` + `date` + `timeSlot`) ensures that even if two requests hit the server at the exact same millisecond, only one will succeed.

### 🎨 Premium UI/UX
-   **Near-Black / Deep Violet Aesthetic**: A professional, dark-themed design system.
-   **Framer Motion Animations**: Smooth, spring-based transitions and micro-animations.
-   **Responsive Design**: Fully optimized for mobile, tablet, and desktop.

---

## 📸 Screenshots

### 🏠 Expert Listing & Search
![Home Screen](https://github.com/user-attachments/assets/ea0a05ea-078b-4d42-bce4-1f0ce083570f)

### 📅 Real-Time Slot Booking
![Booking Screen](https://github.com/user-attachments/assets/a22f92c8-2d58-4983-847e-d068b07bbaee)

### 📝 Booking Details
![Booking Modal](https://github.com/user-attachments/assets/434ed0c8-cc53-4cb3-8fad-8e115e53ba4c)

### ✅ Booking Confirmation
![Success Screen](https://github.com/user-attachments/assets/3fcb75a8-5e38-49f2-9e50-940795da1fc9)

### 📋 Personal Booking History
![My Bookings](https://github.com/user-attachments/assets/e0175b01-510c-49de-8ec8-50114a803dd3)

---

## 📁 Project Structure (MVC)

The project follows a clean **Model-View-Controller** architecture for maximum scalability.

```text
expert-session-booking/
├── client/                # VIEW Layer (React)
│   ├── src/
│   │   ├── components/    # Reusable UI Components
│   │   ├── hooks/         # Custom Business Logic Hooks
│   │   ├── pages/         # Page Views (Home, Details, History)
│   │   └── socket.js      # WebSocket Client Configuration
├── server/                # CONTROLLER & MODEL Layer (Express/Mongoose)
│   ├── src/
│   │   ├── models/        # Mongoose Schemas (Data Models)
│   │   ├── controllers/   # Business Logic (Request Handlers)
│   │   ├── routes/        # API Endpoints
│   │   └── config/        # DB & Socket Initialization
│   └── server.js          # App Entry Point
```

---

## 🚀 Installation Guide

### Prerequisites
-   Node.js (v18+)
-   MongoDB Atlas account or local MongoDB instance

### Step 1: Clone & Install Dependencies
```bash
git clone https://github.com/your-username/expert-booking.git
cd expert-booking
npm run install-all
```

### Step 2: Configure Environment
Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
NODE_ENV=development
```

### Step 3: Seed Dummy Data
Populate the database with initial expert profiles:
```bash
cd server
node seed.js
```

### Step 4: Run the Application
```bash
# In the root directory:
npm run build   # Build frontend
npm start       # Start unified server
```

---

## 🚦 API Documentation

### Experts API
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/experts` | Get all experts (supports pagination & category filters) |
| `GET` | `/api/experts/:id` | Get detailed expert profile |

### Bookings API
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/bookings` | Create a new booking (with race-condition check) |
| `GET` | `/api/bookings` | Fetch bookings by user email (`?email=...`) |
| `GET` | `/api/bookings/expert/:id` | Get all booked slots for a specific expert |
| `PATCH` | `/api/bookings/:id/status` | Update booking status (confirm/cancel) |

---

## 📄 License
Licensed under the **ISC License**. Developed with ❤️ for the developer community.
