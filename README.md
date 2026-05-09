# Expert Session Booking

This is a full-stack web application for booking sessions with experts. Users can browse a list of experts, filter them by category, view their details, and book available time slots.

## Features

*   Browse and search for experts.
*   Filter experts by category.
*   View detailed expert profiles with availability.
*   Book a session with an expert.
*   View a list of personal bookings.
*   Real-time updates for bookings.

## Tech Stack

*   **Frontend:**
    *   React
    *   Vite
    *   JavaScript
    *   CSS
*   **Backend:**
    *   Node.js
    *   Express.js
    *   MongoDB (with Mongoose)
    *   Socket.IO for real-time communication.

## Project Structure

The project is divided into two main parts:

*   `client/`: Contains the React frontend application.
*   `server/`: Contains the Node.js/Express.js backend server and API.

## Getting Started

### Prerequisites

*   Node.js (v14 or later)
*   npm
*   MongoDB (running on `mongodb://localhost:27017/expert-booking`)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd expert-session-booking
    ```

2.  **Setup the Server:**
    ```bash
    cd server
    npm install
    ```
    You may need to create a `.env` file in the `server` directory to configure environment variables like the database connection string if it's not hardcoded.

3.  **Setup the Client:**
    ```bash
    cd ../client
    npm install
    ```

### Running the Application

1.  **Start the Backend Server:**
    From the `server` directory, run:
    ```bash
    npm start
    ```
    The server will start on `http://localhost:5000` by default.

2.  **Start the Frontend Development Server:**
    From the `client` directory, run:
    ```bash
    npm run dev
    ```
    The client application will be available at `http://localhost:5173` by default.
