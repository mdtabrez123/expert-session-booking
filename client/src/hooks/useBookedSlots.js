import { useState, useEffect, useContext, useCallback } from 'react';
import { SocketContext } from '../App';

export function useBookedSlots(expertId, selectedDate) {
  const socket = useContext(SocketContext);
  const [bookedSlots, setBookedSlots] = useState(new Set());
  const [loadingSlots, setLoadingSlots] = useState(true);

  const fetchBookings = useCallback(async () => {
    if (!expertId || !selectedDate) return;
    
    setLoadingSlots(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${baseUrl}/api/bookings/expert/${expertId}`);
      const json = await res.json();
      
      if (json.success) {
        // Extract YYYY-MM-DD from the booking date and check it against selectedDate
        const slotsForDate = json.data
          .filter(b => b.status !== 'cancelled' && b.date.split('T')[0] === selectedDate)
          .map(b => b.timeSlot);
          
        setBookedSlots(new Set(slotsForDate));
      } else {
        setBookedSlots(new Set());
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setBookedSlots(new Set());
    } finally {
      setLoadingSlots(false);
    }
  }, [expertId, selectedDate]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    if (!socket) return;

    const handleSlotBooked = (booking) => {
      // Check if the booking is for the current expert and selected date
      if (
        booking.expertId === expertId && 
        booking.date.split('T')[0] === selectedDate &&
        booking.status !== 'cancelled'
      ) {
        setBookedSlots((prev) => {
          const next = new Set(prev);
          next.add(booking.timeSlot);
          return next;
        });
      }
    };

    socket.on('slotBooked', handleSlotBooked);

    return () => {
      socket.off('slotBooked', handleSlotBooked);
    };
  }, [socket, expertId, selectedDate]);

  return { bookedSlots, loadingSlots, refetch: fetchBookings };
}
