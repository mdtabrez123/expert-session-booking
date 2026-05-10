import { useEffect, createContext } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { socket } from './socket'; // Import the single socket instance
import ExpertListing from './pages/ExpertListing';
import ExpertDetail  from './pages/ExpertDetail';
import MyBookings    from './pages/MyBookings';

export const SocketContext = createContext();

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0,         transition: { duration: 0.2,  ease: 'easeIn' } },
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <Routes location={location}>
          <Route path="/"            element={<ExpertListing />} />
          <Route path="/experts/:id" element={<ExpertDetail  />} />
          <Route path="/bookings"    element={<MyBookings    />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  useEffect(() => {
    socket.connect();

    const onConnect = () => {
      console.log('Connected to socket server:', socket.id);
    };

    const onDisconnect = () => {
      console.log('Disconnected from socket server');
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
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
