import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TIME_SLOTS, formatSlot, nameGradient, initials } from '../utils/slots';
import { useBookedSlots } from '../hooks/useBookedSlots';
import BookingModal   from '../components/BookingModal';
import LoadingSpinner, { SlotSkeleton } from '../components/LoadingSpinner';
import ErrorMessage   from '../components/ErrorMessage';

const GRADIENTS = [
  ['#4f46e5','#7c3aed'],
  ['#0ea5e9','#6366f1'],
  ['#10b981','#059669'],
  ['#f59e0b','#d97706'],
  ['#ec4899','#db2777'],
  ['#8b5cf6','#a855f7'],
];

function getGradient(name = '') {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xFFFFFFFF;
  return GRADIENTS[Math.abs(h) % GRADIENTS.length];
}

export default function ExpertDetail() {
  const { id }    = useParams();
  const navigate  = useNavigate();

  const [expert,        setExpert]        = useState(null);
  const [loadingExpert, setLoadingExpert] = useState(true);
  const [expertError,   setExpertError]   = useState(null);

  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal,    setShowModal]    = useState(false);

  const { bookedSlots, loadingSlots, refetch } = useBookedSlots(id, selectedDate);

  useEffect(() => {
    setLoadingExpert(true);
    setExpertError(null);
    const baseUrl = import.meta.env.VITE_API_URL || '';
    fetch(`${baseUrl}/api/experts/${id}`)
      .then((r) => { if (!r.ok) throw new Error('Expert not found'); return r.json(); })
      .then((d) => setExpert(d.data))
      .catch((e) => setExpertError(e.message))
      .finally(() => setLoadingExpert(false));
  }, [id]);

  useEffect(() => { setSelectedSlot(null); }, [selectedDate]);

  const handleSlotClick = (slot) => {
    if (bookedSlots.has(slot)) return;
    setSelectedSlot(slot);
    setTimeout(() => setShowModal(true), 0);
  };

  const handleModalClose = () => { setShowModal(false); setSelectedSlot(null); };
  const handleBooked     = () => { refetch(); };

  if (loadingExpert) return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner label="Loading expert profile…" />
    </div>
  );
  if (expertError) return (
    <div className="min-h-screen flex items-center justify-center">
      <ErrorMessage message={expertError} onRetry={() => navigate('/')} />
    </div>
  );

  const [c1, c2]    = getGradient(expert.name);
  const abbr        = initials(expert.name);
  const available   = TIME_SLOTS.filter((s) => !bookedSlots.has(s)).length;
  const dateLabel   = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const availPct    = Math.round((available / TIME_SLOTS.length) * 100);

  // 14 selectable days starting from today, with local date formatting (no UTC shift)
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const iso = [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, '0'),
      String(d.getDate()).padStart(2, '0'),
    ].join('-');
    return { iso, num: d.getDate(), weekday: d.getDay() };
  });

  // How many empty cells to prepend so the first day lands on the correct weekday column
  const leadingBlanks = days[0]?.weekday ?? 0;

  return (
    <div className="min-h-screen">

      {/* ── Sticky Nav ── */}
      <header className="nav-header">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex h-14 items-center gap-3">
          <Link
            to="/"
            className="btn-ghost py-1.5 px-3 gap-2 text-sm"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"/>
            </svg>
            All Experts
          </Link>

          <div className="h-4 w-px bg-white/10" />

          <Link to="/" className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-white flex items-center justify-center">
              <svg className="h-3.5 w-3.5 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-zinc-200 tracking-tight">ExpertBook</span>
          </Link>

          <div className="ml-auto flex items-center gap-3">
            <Link to="/bookings" className="btn-ghost text-sm py-1.5 px-3 hidden sm:flex">
              My Bookings
            </Link>
            <span className="tag tag-success py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-[pulseDot_2s_ease-in-out_infinite]" />
              Live
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-start">

          {/* ── Left: Sticky Profile ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-[340px] lg:sticky lg:top-24 flex flex-col gap-8 shrink-0"
          >
            {/* Avatar + Name */}
            <div className="flex flex-col gap-5">
              <div className="relative w-fit">
                <div
                  className="h-20 w-20 rounded-2xl flex items-center justify-center text-white font-semibold text-2xl shadow-xl"
                  style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
                >
                  {abbr}
                </div>
                <div
                  className="absolute inset-0 rounded-2xl blur-lg opacity-40 -z-10"
                  style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
                />
              </div>

              <div>
                <h1 className="text-3xl font-semibold text-zinc-100 tracking-tight leading-tight">
                  {expert.name}
                </h1>
                <span
                  className="inline-flex items-center mt-2 px-3 py-1 rounded-full text-sm font-medium text-zinc-300"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {expert.category}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Experience', value: `${expert.experience} yrs` },
                { label: 'Rating',     value: `${Number(expert.rating).toFixed(1)} / 5` },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-xl px-4 py-3"
                  style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <p className="text-[10px] font-medium text-zinc-600 uppercase tracking-widest mb-1">{label}</p>
                  <p className="text-sm font-semibold text-zinc-200">{value}</p>
                </div>
              ))}
            </div>

            <div className="h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />

            {/* ── Date Picker ── */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: '#0c0c0e', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {/* Calendar header */}
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div>
                  <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">
                    Select Date
                  </p>
                  <p className="text-sm font-semibold text-zinc-200 mt-0.5">
                    {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
                {/* Selected full label */}
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium"
                  style={{ background: `rgba(${parseInt(c1.slice(1,3),16)},${parseInt(c1.slice(3,5),16)},${parseInt(c1.slice(5,7),16)},0.12)`, border: `1px solid ${c1}30` }}
                >
                  <svg className="h-3 w-3" style={{ color: c1 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"/>
                  </svg>
                  <span style={{ color: c1 }}>
                    {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Weekday labels */}
              <div className="grid grid-cols-7 px-3 pt-3 pb-1">
                {['S','M','T','W','T','F','S'].map((d, i) => (
                  <div key={i} className="flex items-center justify-center">
                    <span className="text-[10px] font-semibold text-zinc-700 uppercase">{d}</span>
                  </div>
                ))}
              </div>

              {/* Day tiles — 2 weeks (14 cells + leading blanks) in 7-col grid */}
              <div className="grid grid-cols-7 gap-0.5 px-3 pb-3">
                {/* Empty cells to align first day with correct weekday */}
                {Array.from({ length: leadingBlanks }).map((_, i) => (
                  <div key={`blank-${i}`} className="h-9 w-full" />
                ))}

                {days.map(({ iso, num, isPast }) => {
                  const isActive = iso === selectedDate;
                  const isToday  = iso === today;
                  return (
                    <button
                      key={iso}
                      onClick={() => !isPast && setSelectedDate(iso)}
                      disabled={isPast}
                      className="relative flex flex-col items-center justify-center h-9 w-full rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                      style={
                        isActive
                          ? {
                              background: `linear-gradient(135deg, ${c1}, ${c2})`,
                              boxShadow: `0 2px 14px ${c1}50`,
                            }
                          : isPast
                          ? { cursor: 'not-allowed' }
                          : undefined
                      }
                      title={isPast ? 'Past date' : iso}
                    >
                      {/* Today underline dot */}
                      {isToday && !isActive && (
                        <span
                          className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full"
                          style={{ background: c1 }}
                        />
                      )}

                      <span
                        className="text-sm font-semibold leading-none select-none"
                        style={{
                          color: isActive ? '#fff'
                            : isPast     ? 'rgba(255,255,255,0.12)'
                            : isToday    ? c1
                            : '#52525b',
                        }}
                      >
                        {num}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Full selected date label */}
              <div
                className="px-4 py-2.5 flex items-center gap-2"
                style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
              >
                <svg className="h-3.5 w-3.5 text-zinc-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
                <p className="text-xs text-zinc-500 font-medium">{dateLabel}</p>
              </div>
            </div>

            {/* Availability meter */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Availability</p>
                <span className="text-xs font-semibold text-zinc-300">
                  {loadingSlots ? '–' : available} / {TIME_SLOTS.length}
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${c1}, ${c2})` }}
                  initial={{ width: 0 }}
                  animate={{ width: loadingSlots ? '0%' : `${availPct}%` }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-zinc-600">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
                  Available
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/10" />
                  Booked
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Right: Slots ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-zinc-100 tracking-tight">Time Slots</h2>
                <p className="text-sm text-zinc-500 mt-0.5">
                  {loadingSlots ? 'Checking live availability…' : `${available} of ${TIME_SLOTS.length} open`}
                </p>
              </div>
              <span className="tag tag-success py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-[pulseDot_2s_ease-in-out_infinite]" />
                Live
              </span>
            </div>

            {loadingSlots ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {TIME_SLOTS.map((s) => <SlotSkeleton key={s} />)}
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedDate}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-3"
                >
                  {TIME_SLOTS.map((slot, i) => {
                    const isBooked   = bookedSlots.has(slot);
                    const isSelected = selectedSlot === slot;
                    const { start }  = formatSlot(slot);

                    return (
                      <motion.button
                        key={slot}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.035, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        disabled={isBooked}
                        onClick={() => handleSlotClick(slot)}
                        whileHover={!isBooked ? { scale: 1.03, y: -2 } : {}}
                        whileTap={!isBooked ? { scale: 0.97 } : {}}
                        className={`relative flex flex-col items-center justify-center p-4 rounded-xl text-sm font-medium transition-all duration-200 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
                          isBooked
                            ? 'cursor-not-allowed opacity-35'
                            : isSelected
                            ? 'text-zinc-900 border-transparent'
                            : 'text-zinc-300 border-white/[0.07] hover:border-white/[0.14]'
                        }`}
                        style={
                          isSelected
                            ? { background: '#fff', boxShadow: '0 0 0 3px rgba(255,255,255,0.12), 0 4px 20px rgba(0,0,0,0.4)' }
                            : isBooked
                            ? { background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.06)' }
                            : { background: '#111113' }
                        }
                      >
                        {isBooked && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div
                              className="absolute w-[calc(100%-24px)] h-px opacity-25"
                              style={{ background: 'rgba(255,255,255,0.3)', transform: 'rotate(-12deg)' }}
                            />
                          </div>
                        )}
                        <span className="text-[10px] uppercase tracking-widest mb-1 opacity-60">
                          {start.slice(-2)}
                        </span>
                        <span className={`text-base leading-none ${isSelected ? 'font-bold' : 'font-semibold'}`}>
                          {start.slice(0, -3)}
                        </span>
                        {!isBooked && !isSelected && (
                          <div
                            className="mt-2 h-0.5 w-5 rounded-full opacity-40"
                            style={{ background: `linear-gradient(90deg, ${c1}, ${c2})` }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            )}

            {!loadingSlots && available === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 p-6 rounded-xl text-center text-sm text-zinc-500"
                style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                All slots are booked for this date.{' '}
                <button
                  onClick={() => {
                    const next = days[1]?.iso;
                    if (next) setSelectedDate(next);
                  }}
                  className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                >
                  Try tomorrow →
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>

      {/* ── Modal ── */}
      <AnimatePresence>
        {showModal && selectedSlot && (
          <BookingModal
            expert={expert}
            selectedDate={selectedDate}
            timeSlot={selectedSlot}
            onClose={handleModalClose}
            onBooked={handleBooked}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
