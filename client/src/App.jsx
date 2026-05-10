import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { SocketContext, socket } from './context/SocketContext';
import AnimatedRoutes from './AnimatedRoutes'; // Assuming AnimatedRoutes is in a separate file

export default function App() {
  useEffect(() => {
    // Manually connect the socket when the app mounts
    socket.connect();

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </SocketContext.Provider>
  );
}
