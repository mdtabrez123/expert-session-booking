import { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../App'; // Assuming App.jsx exports SocketContext

export function useBookedSlots(expertId) {
  const socket = useContext(SocketContext);
  const [bookedSlots, setBookedSlots] = useState([]);

  useEffect(() => {
    if (!socket || !expertId) return;

    // Join the room for this expert
    socket.emit('join-expert-room', expertId);

    // Listen for initial booked slots
    socket.on('initial-booked-slots', (slots) => {
      setBookedSlots(slots);
    });

    // Listen for real-time updates
    socket.on('booking-update', (updatedBooking) => {
      setBookedSlots((prevSlots) => [...prevSlots, updatedBooking.slot]);
    });

    // Clean up on component unmount or when expertId changes
    return () => {
      socket.emit('leave-expert-room', expertId);
      socket.off('initial-booked-slots');
      socket.off('booking-update');
    };
  }, [socket, expertId]);

  return bookedSlots;
}
