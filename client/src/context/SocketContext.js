import { createContext, useContext } from 'react';
import { io } from 'socket.io-client';

const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const socket = io(socketUrl, {
  transports: ['websocket'],
  autoConnect: false, // We will connect manually
});

export const SocketContext = createContext(socket);

export function useSocket() {
  return useContext(SocketContext);
}
