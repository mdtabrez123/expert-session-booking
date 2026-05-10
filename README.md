# 🚀 ExpertBook - Premium Expert Session Booking Platform

ExpertBook is a sophisticated, full-stack web application designed for seamless session booking with industry experts. Featuring a premium **"Near-Black & Deep Violet"** design system, the platform offers a high-end user experience with fluid animations and real-time data synchronization.

![ExpertBook Screenshot](https://via.placeholder.com/1200x600/0c0c0e/7c3aed?text=ExpertBook+Premium+UI)

## ✨ Core Features

-   **💎 Premium UI/UX**: Crafted with a glassmorphic aesthetic, custom HSL-based color palettes, and modern typography (Outfit/Inter).
-   **🎬 Smooth Animations**: Powered by **Framer Motion** for spring-based transitions, hover effects, and layout animations.
-   **🔍 Dynamic Discovery**: Real-time expert search and category-based filtering with paginated results (6 per page).
-   **⚡ Real-Time Sync**: Integrated with **Socket.io** to reflect booked slots across all clients instantly.
-   **📅 Smart Scheduling**: Interactive calendar with local-date handling and intelligent time-slot validation.
-   **🛡️ Robust Backend**: Built with **Express 5** and **MongoDB**, featuring structured error handling and unified static serving.
-   **📦 Production Optimized**: A unified deployment architecture where the Express server serves the React production bundle.

---

## 🛠️ Tech Stack

### Frontend
-   **React 19** & **Vite 8**
-   **Tailwind CSS v4** (Utility-first styling)
-   **Framer Motion** (Orchestrated animations)
-   **Socket.io Client** (Real-time events)
-   **React Router 7** (Declarative routing)

### Backend
-   **Node.js** & **Express 5**
-   **MongoDB** & **Mongoose** (ODM)
-   **Socket.io** (WebSockets)
-   **Dotenv** (Environment management)

---

## 📂 Project Structure

```text
expert-session-booking/
├── client/                # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks (useExperts, useBookedSlots)
│   │   ├── pages/         # Page components (Home, ExpertDetail, MyBookings)
│   │   └── socket.js      # Socket.io client configuration
│   └── vite.config.js     # Vite & Proxy settings
├── server/                # Express Backend
│   ├── src/
│   │   ├── models/        # Mongoose schemas (Expert, Booking)
│   │   ├── routes/        # API route definitions
│   │   └── config/        # DB and Socket configurations
│   ├── server.js          # Entry point & unified static serving
│   └── seed.js            # Database seeding script
└── package.json           # Root scripts for unified management
```

---

## 🚦 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/experts` | Fetch experts (supports `page`, `limit`, and `category` query params) |
| `GET` | `/api/experts/:id` | Get detailed profile of a specific expert |
| `GET` | `/api/bookings` | Retrieve bookings for a user email (via `email` query param) |
| `POST` | `/api/bookings` | Create a new session booking (emits `slotBooked` socket event) |
| `GET` | `/api/bookings/expert/:id` | Get all existing bookings for an expert |

---

## 🚀 Installation & Setup

### 1. Clone & Install
```bash
git clone <repository-url>
cd expert-session-booking

# Install all dependencies (Root, Server, and Client)
npm run install-all
```

### 2. Environment Configuration
Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri_or_local_uri
NODE_ENV=development
```

### 3. Seed Database
To populate your database with initial experts:
```bash
cd server
node seed.js
```

---

## 🏃 Running the Application

### Development (Recommended for Coding)
Start both servers simultaneously in separate terminals:

**Backend (Port 5000):**
```bash
cd server
npm run dev
```

**Frontend (Port 5173):**
```bash
cd client
npm run dev
```

### Unified Production Mode (Deployment)
Serve the entire app from the backend server:
```bash
# From the root directory:
# 1. Build the frontend
npm run build

# 2. Start the unified server
npm start
```
Access the application at `http://localhost:5000`.

---

## 📄 License
Licensed under the **ISC License**. Created with ❤️ for expert collaboration.
