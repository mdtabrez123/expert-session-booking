const Booking = require('../models/Booking');
const Expert = require('../models/Expert');
const { getIO } = require('../config/socket');

// ─── GET /api/bookings?email=... ──────────────────────────────────────────────
const getBookings = async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email query parameter is required' });
    }
    const bookings = await Booking.find({ userEmail: email })
      .populate('expertId', 'name category')
      .sort({ date: -1, timeSlot: 1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/bookings ───────────────────────────────────────────────────────
const createBooking = async (req, res, next) => {
  try {
    const { expertId, userName, userEmail, userPhone, notes, date, timeSlot } = req.body;

    // 1️⃣  Validate that the expert exists
    const expert = await Expert.findById(expertId);
    if (!expert) {
      return res.status(404).json({ success: false, message: 'Expert not found' });
    }

    // 2️⃣  Explicit slot-conflict check (application-level, before hitting the DB index)
    //     Normalise the date to midnight UTC so comparisons are date-only.
    const bookingDate = new Date(date);
    bookingDate.setUTCHours(0, 0, 0, 0);
    const nextDay = new Date(bookingDate);
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);

    const existingBooking = await Booking.findOne({
      expertId,
      date: { $gte: bookingDate, $lt: nextDay },
      timeSlot,
      status: { $ne: 'cancelled' }, // Cancelled slots are available again
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: `The slot '${timeSlot}' on ${bookingDate.toDateString()} is already booked for this expert. Please choose a different slot.`,
        conflictingBookingId: existingBooking._id,
      });
    }

    // 3️⃣  Save the booking
    const booking = await Booking.create({ expertId, userName, userEmail, userPhone, notes, date, timeSlot });

    // 4️⃣  Emit real-time 'slotBooked' event to ALL connected Socket.io clients
    const slotDetails = {
      bookingId:  booking._id,
      expertId:   booking.expertId,
      expertName: expert.name,
      userName:   booking.userName,
      date:       booking.date,
      timeSlot:   booking.timeSlot,
      status:     booking.status,
      bookedAt:   booking.createdAt,
    };

    getIO().emit('slotBooked', slotDetails);
    console.log(`📡 Emitted 'slotBooked' for expert ${expert.name} — slot ${timeSlot}`);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error) {
    // 5️⃣  DB-level safety net — compound unique index (code 11000)
    //     Catches race conditions that slip past the application-level check.
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked for the selected expert (concurrent request). Please choose a different slot.',
      });
    }
    next(error);
  }
};


// ─── GET /api/bookings/:id ────────────────────────────────────────────────────
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('expertId', 'name category');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/bookings/expert/:expertId ───────────────────────────────────────
const getBookingsByExpert = async (req, res, next) => {
  try {
    const { expertId } = req.params;

    const expert = await Expert.findById(expertId);
    if (!expert) {
      return res.status(404).json({ success: false, message: 'Expert not found' });
    }

    const bookings = await Booking.find({ expertId }).sort({ date: 1, timeSlot: 1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// ─── PATCH /api/bookings/:id/status ──────────────────────────────────────────
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${validStatuses.join(', ')}`,
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.status(200).json({
      success: true,
      message: `Booking status updated to '${status}'`,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createBooking, getBookingById, getBookingsByExpert, updateBookingStatus, getBookings };
