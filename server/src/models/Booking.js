const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    expertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expert',
      required: [true, 'Expert ID is required'],
    },
    userName: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
    },
    userEmail: {
      type: String,
      required: [true, 'User email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    userPhone: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Booking date is required'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Time slot is required'],
      trim: true,
      // Expected format: "HH:MM-HH:MM", e.g. "10:00-11:00"
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'confirmed', 'cancelled'],
        message: '{VALUE} is not a valid status',
      },
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// ─── CRUCIAL: Compound Unique Index ───────────────────────────────────────────
// Prevents double-booking the same expert at the same date and time slot.
// MongoDB will throw error code 11000 if a duplicate is attempted.
bookingSchema.index(
  { expertId: 1, date: 1, timeSlot: 1 },
  { unique: true, name: 'unique_expert_date_timeslot' }
);

module.exports = mongoose.model('Booking', bookingSchema);
