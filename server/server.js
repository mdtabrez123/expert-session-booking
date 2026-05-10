require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./src/config/db');
const socketConfig = require('./src/config/socket');
const expertRoutes = require('./src/routes/expertRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const errorHandler = require('./src/middleware/errorHandler');

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
connectDB();

const app = express();

const allowedOrigins = [
  'https://expert-session-booking-sand.vercel.app',
  'http://localhost:5173'
];

// --- CORS Configuration ----------------------------------------------------
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Expert Session Booking API is running 🚀',
    version: '1.0.0',
    endpoints: {
      experts: '/api/experts',
      bookings: '/api/bookings',
    },
  });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/experts', expertRoutes);
app.use('/api/bookings', bookingRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route '${req.originalUrl}' not found` });
});

// ─── Global Error Handler (must be last) ─────────────────────────────────────
app.use(errorHandler);

// ─── HTTP Server + Socket.io ──────────────────────────────────────────────────
// Wrap Express in a raw http.Server so Socket.io can share the same port.
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Store the io instance in the singleton so controllers can reach it via getIO()
socketConfig.init(io);

io.on('connection', (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`🔌 Socket disconnected: ${socket.id}`);
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`🔌 Socket.io ready on ws://localhost:${PORT}`);
});
