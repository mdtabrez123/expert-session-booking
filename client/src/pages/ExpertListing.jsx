import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useExperts }      from '../hooks/useExperts';
import ExpertCard          from '../components/ExpertCard';
import SearchBar           from '../components/SearchBar';
import CategoryFilter      from '../components/CategoryFilter';
import Pagination          from '../components/Pagination';
import LoadingSpinner, { CardSkeleton } from '../components/LoadingSpinner';
import ErrorMessage        from '../components/ErrorMessage';

/* ── Real-time toast ───────────────────────────────────────────────────────── */
function SlotToast({ booking, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 5000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
      className="fixed bottom-6 right-6 z-50 max-w-sm"
    >
      <div
        className="flex items-start gap-3 p-4 rounded-2xl shadow-2xl"
        style={{
          background: '#18181b',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 20px 60px rgba(0,0,0,0.6)',
        }}
      >
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-2xl overflow-hidden">
          <motion.div
            className="h-full origin-left"
            style={{ background: 'linear-gradient(90deg, #8b5cf6, #6366f1)' }}
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 5, ease: 'linear' }}
          />
        </div>

        <div
          className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.25)' }}
        >
          <svg className="h-4 w-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-zinc-100">Slot Just Booked</p>
          <p className="text-xs text-zinc-500 mt-0.5 truncate">
            <span className="text-zinc-300">{booking.userName}</span> booked{' '}
            <span className="text-zinc-300">{booking.expertName}</span> @ {booking.timeSlot}
          </p>
        </div>
        <button onClick={onDismiss} className="flex-shrink-0 p-1 text-zinc-600 hover:text-zinc-300 transition-colors">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

/* ── Empty state ───────────────────────────────────────────────────────────── */
function EmptyState({ hasFilters }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-5 py-24 text-center"
    >
      <div
        className="h-16 w-16 rounded-2xl flex items-center justify-center"
        style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <svg className="h-8 w-8 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"/>
        </svg>
      </div>
      <div>
        <p className="text-zinc-300 font-medium mb-1">
          {hasFilters ? 'No matching experts' : 'No experts found'}
        </p>
        <p className="text-zinc-600 text-sm max-w-xs mx-auto">
          {hasFilters ? 'Try adjusting your search or filter.' : 'Check back later.'}
        </p>
      </div>
    </motion.div>
  );
}

/* ── Main Page ─────────────────────────────────────────────────────────────── */
export default function ExpertListing() {
  const {
    experts, loading, error, page, setPage,
    pagination, category, handleCategoryChange,
    searchQuery, setSearchQuery, categories, retry,
  } = useExperts();

  const [toast, setToast] = useState(null);
  const { scrollY } = useScroll();
  const navBg = useTransform(scrollY, [0, 60], ['rgba(6,6,7,0)', 'rgba(6,6,7,0.9)']);
  const navBorder = useTransform(scrollY, [0, 60], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.06)']);

  // Real-time slot updates
  useEffect(() => {
    const socket = io('http://127.0.0.1:5000', { transports: ['websocket'] });
    socket.on('slotBooked', (data) => setToast(data));
    return () => socket.disconnect();
  }, []);

  const hasFilters = !!searchQuery || !!category;

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
  };

  return (
    <div className="min-h-screen">
      {/* ── Nav ── */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl"
        style={{
          backgroundColor: navBg,
          borderBottom: '1px solid',
          borderColor: navBorder,
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-14 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-7 w-7 rounded-lg flex items-center justify-center bg-white group-hover:scale-105 transition-transform duration-200">
              <svg className="h-4 w-4 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"/>
              </svg>
            </div>
            <span className="text-[15px] font-semibold text-zinc-100 tracking-tight">ExpertBook</span>
          </Link>

          {/* Right */}
          <div className="flex items-center gap-3">
            <Link
              to="/bookings"
              className="hidden sm:inline-flex btn-ghost text-sm py-1.5 px-3"
            >
              My Bookings
            </Link>
            <span className="tag tag-success py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-[pulseDot_2s_ease-in-out_infinite]" />
              Live
            </span>
          </div>
        </div>
      </motion.header>

      {/* ── Hero ── */}
      <section className="pt-36 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Ambient orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none">
          <div
            className="absolute top-8 left-1/4 w-72 h-72 rounded-full blur-[100px] opacity-20"
            style={{ background: 'radial-gradient(circle, #8b5cf6, transparent 70%)' }}
          />
          <div
            className="absolute top-16 right-1/4 w-56 h-56 rounded-full blur-[80px] opacity-15"
            style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }}
          />
        </div>

        <div className="mx-auto max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full text-xs font-medium text-zinc-400"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-[pulseDot_2s_ease-in-out_infinite]" />
              Connecting you with industry leaders
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-6xl lg:text-7xl font-semibold text-zinc-100 tracking-[-0.03em] leading-[1.08]"
            >
              Find your{' '}
              <em
                className="not-italic font-light"
                style={{
                  background: 'linear-gradient(135deg, #c4b5fd, #8b5cf6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                perfect
              </em>{' '}
              expert.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-6 text-zinc-500 text-lg sm:text-xl max-w-xl leading-relaxed font-light"
            >
              Skip the guesswork. Browse top-rated professionals, check live availability, and book your session in seconds.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Main ── */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-28">

        {/* Command Bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3 }}
          className="mb-12"
        >
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(11,11,13,0.92)',
              border: '1px solid rgba(255,255,255,0.07)',
              backdropFilter: 'blur(28px)',
              boxShadow: '0 12px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)',
            }}
          >
            {/* ── Search row ── */}
            <div
              className="flex items-center"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="flex-1">
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
              </div>
              {/* Expert count chip */}
              {!loading && !error && (
                <span
                  className="hidden sm:inline-flex items-center gap-1.5 mr-3 px-2.5 py-1 rounded-lg text-[11px] font-medium flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#52525b' }}
                >
                  <span style={{ color: '#a1a1aa', fontVariantNumeric: 'tabular-nums' }}>
                    {pagination?.totalExperts ?? experts.length}
                  </span>
                  experts
                </span>
              )}
              {hasFilters && (
                <button
                  onClick={() => { handleCategoryChange(''); setSearchQuery(''); }}
                  className="btn-ghost mr-2 text-xs py-1.5 px-3 gap-1.5 flex-shrink-0"
                  style={{ color: '#71717a' }}
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
                  </svg>
                  Reset
                </button>
              )}
            </div>

            {/* ── Filter row ── */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
              {/* Row header */}
              <div
                className="flex items-center justify-between px-4 pt-2.5 pb-1"
              >
                <div className="flex items-center gap-2">
                  <svg className="h-3 w-3" style={{ color: '#3f3f46' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"/>
                  </svg>
                  <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#3f3f46' }}>
                    Filter by category
                  </span>
                </div>
                {category && (
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(139,92,246,0.12)', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.2)' }}
                  >
                    {category}
                  </span>
                )}
              </div>
              <CategoryFilter value={category} onChange={handleCategoryChange} categories={categories} />
            </div>
          </div>
        </motion.div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <ErrorMessage message={error} onRetry={retry} />
        ) : experts.length === 0 ? (
          <EmptyState hasFilters={hasFilters} />
        ) : (
          <>
            {searchQuery && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-zinc-600 mb-6"
              >
                {experts.length} result{experts.length !== 1 ? 's' : ''} for{' '}
                <em className="text-zinc-400 not-italic font-medium">"{searchQuery}"</em>
              </motion.p>
            )}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {experts.map((expert, i) => (
                <ExpertCard key={expert._id} expert={expert} index={i} />
              ))}
            </motion.div>

            {!searchQuery && (
              <Pagination pagination={pagination} page={page} onPageChange={setPage} loading={loading} />
            )}
          </>
        )}
      </main>

      {/* Real-time toast */}
      <AnimatePresence>
        {toast && <SlotToast booking={toast} onDismiss={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}
