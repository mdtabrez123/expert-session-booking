import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatSlot } from '../utils/slots';

export default function BookingModal({ expert, selectedDate, timeSlot, onClose, onBooked }) {
  const [form, setForm]       = useState({ userName: '', userEmail: '', userPhone: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);
  const firstInputRef          = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    setTimeout(() => firstInputRef.current?.focus(), 120);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const { start, end } = formatSlot(timeSlot);
  const dateLabel = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/bookings', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expertId:  expert._id,
          userName:  form.userName.trim(),
          userEmail: form.userEmail.trim(),
          userPhone: form.userPhone.trim(),
          notes:     form.notes.trim(),
          date:      selectedDate,
          timeSlot,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Booking failed');
      setSuccess(true);
      onBooked?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const initials = expert.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(6,6,7,0.85)', backdropFilter: 'blur(12px)' }}
        onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background: '#111113',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 24px 80px rgba(0,0,0,0.7)',
          }}
        >
          <AnimatePresence mode="wait">
            {success ? (
              /* ── Success State ── */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                className="flex flex-col items-center gap-6 p-10 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                  className="relative"
                >
                  <div className="h-20 w-20 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(16,185,129,0.12)', border: '1.5px solid rgba(16,185,129,0.3)' }}
                  >
                    <svg className="h-9 w-9" style={{ color: '#6ee7b7' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 rounded-full animate-ping opacity-20"
                    style={{ background: 'rgba(16,185,129,0.4)', animationDuration: '1.5s' }} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <h3 className="text-xl font-semibold text-zinc-100 tracking-tight mb-2">Session Booked!</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Your session with <strong className="text-zinc-200 font-medium">{expert.name}</strong> is confirmed
                    for <strong className="text-zinc-200 font-medium">{start} – {end}</strong><br/>
                    <span className="text-zinc-500">{dateLabel}</span>
                  </p>
                  <p className="text-zinc-600 text-xs mt-2">Confirmation sent to {form.userEmail}</p>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  onClick={onClose}
                  className="btn-primary px-10"
                >
                  Done
                </motion.button>
              </motion.div>
            ) : (
              /* ── Booking Form ── */
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Header */}
                <div className="px-6 pt-6 pb-4 flex items-start justify-between gap-4"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
                    >
                      {initials}
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-zinc-100 tracking-tight leading-tight">Book a Session</h2>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        with <span className="text-zinc-300">{expert.name}</span>
                      </p>
                    </div>
                  </div>
                  <button onClick={onClose} className="btn-ghost p-1.5 -mr-1 -mt-0.5 rounded-lg">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>

                {/* Session summary chip */}
                <div className="mx-6 mt-4 px-4 py-3 rounded-xl flex items-center gap-3 text-sm"
                  style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.18)' }}
                >
                  <svg className="h-4 w-4 flex-shrink-0 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                  </svg>
                  <span className="text-violet-300 font-medium">{start} – {end}</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-400 text-xs">{dateLabel}</span>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="bm-name" className="block text-xs font-medium text-zinc-500 mb-1.5 tracking-wide">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      ref={firstInputRef}
                      id="bm-name" name="userName" type="text" required
                      placeholder="Jane Doe"
                      value={form.userName} onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  {/* Email + Phone (2-col) */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="bm-email" className="block text-xs font-medium text-zinc-500 mb-1.5 tracking-wide">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="bm-email" name="userEmail" type="email" required
                        placeholder="jane@example.com"
                        value={form.userEmail} onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                    <div>
                      <label htmlFor="bm-phone" className="block text-xs font-medium text-zinc-500 mb-1.5 tracking-wide">
                        Phone
                      </label>
                      <input
                        id="bm-phone" name="userPhone" type="tel"
                        placeholder="+1 555 000"
                        value={form.userPhone} onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label htmlFor="bm-notes" className="block text-xs font-medium text-zinc-500 mb-1.5 tracking-wide">
                      Notes <span className="text-zinc-700">(optional)</span>
                    </label>
                    <textarea
                      id="bm-notes" name="notes" rows={2}
                      placeholder="What would you like to discuss?"
                      value={form.notes} onChange={handleChange}
                      className="form-control resize-none"
                    />
                  </div>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl text-sm"
                        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5' }}
                      >
                        <svg className="h-4 w-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"/>
                        </svg>
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3 text-sm mt-1"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 rounded-full border-2 border-zinc-900/40 border-t-zinc-900 animate-spin" />
                        Processing…
                      </>
                    ) : 'Confirm Booking'}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
