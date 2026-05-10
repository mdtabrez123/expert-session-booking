import { io } from 'socket.io-client';

const SOCKET_URL =
  import.meta.env.VITE_API_URL ||
  'https://expert-session-booking-hbdq.onrender.com';

export const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  withCredentials: true,
});