const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookingById,
  getBookingsByExpert,
  updateBookingStatus,
  getBookings,
} = require('../controllers/bookingController');

// GET  /api/bookings?email=...      — Get bookings by email
// POST /api/bookings                — Create a new booking
// (duplicate slot → 409 Conflict from compound index)
router.route('/').get(getBookings).post(createBooking);

// GET  /api/bookings/expert/:expertId       — All bookings for a specific expert
// NOTE: This route must come BEFORE /:id to avoid "expert" being parsed as an ID
router.route('/expert/:expertId').get(getBookingsByExpert);

// GET   /api/bookings/:id                  — Get a single booking
// PATCH /api/bookings/:id/status           — Update booking status
router.route('/:id').get(getBookingById);
router.route('/:id/status').patch(updateBookingStatus);

module.exports = router;
