import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

/** Compare two date values by calendar day (ignores time) */
const sameDay = (a, b) =>
  new Date(a).toDateString() === new Date(b).toDateString();

/**
 * Fetches existing bookings for an expert on a given date,
 * then keeps the booked-slots Set updated in real time via Socket.io.
 */
export function useBookedSlots(expertId, selectedDate) {
  const [bookedSlots, setBookedSlots] = useState(new Set());
  const [loadingSlots, setLoadingSlots] = useState(false);

  const fetchBookings = useCallback(async () => {
    if (!expertId || !selectedDate) return;
    setLoadingSlots(true);
    try {
      const res  = await fetch(`/api/bookings/expert/${expertId}`);
      const data = await res.json();
      const booked = new Set(
        (data.data || [])
          .filter((b) => sameDay(b.date, selectedDate) && b.status !== 'cancelled')
          .map((b) => b.timeSlot)
      );
      setBookedSlots(booked);
    } catch {
      setBookedSlots(new Set());
    } finally {
      setLoadingSlots(false);
    }
  }, [expertId, selectedDate]);

  // Fetch on mount and whenever expertId / selectedDate changes
  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  // Real-time Socket.io listener
  useEffect(() => {
    if (!expertId) return;
    const socket = io('http://127.0.0.1:5000', { transports: ['websocket'] });

    socket.on('slotBooked', (data) => {
      // Match this expert
      if (String(data.expertId) !== String(expertId)) return;
      // Only update if the booked date matches the currently viewed date
      if (selectedDate && sameDay(data.date, selectedDate)) {
        setBookedSlots((prev) => new Set([...prev, data.timeSlot]));
      }
    });

    return () => socket.disconnect();
  }, [expertId, selectedDate]);

  return { bookedSlots, loadingSlots, refetch: fetchBookings };
}
