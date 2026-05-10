import { createContext, useContext } from 'react';
import { io } from 'socket.io-client';

// Use the VITE_API_URL from environment variables for production,
// with a fallback to your Render URL for safety.
// Local development will use the proxy.
const SOCKET_URL = import.meta.env.VITE_API_URL || 'https://expert-session-booking-hbdq.onrender.com';

export const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  withCredentials: true,
  autoConnect: false, // We will connect manually in App.jsx
});

export const SocketContext = createContext(socket);

export function useSocket() {
  return useContext(SocketContext);
}
