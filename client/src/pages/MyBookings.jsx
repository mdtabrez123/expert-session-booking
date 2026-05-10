import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { formatSlot, nameGradient, initials } from '../utils/slots';

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

function StatusPill({ status }) {
  const map = {
    confirmed: { label: 'Confirmed', style: { background: 'rgba(16,185,129,0.1)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.2)' } },
    pending:   { label: 'Pending',   style: { background: 'rgba(245,158,11,0.1)', color: '#fcd34d', border: '1px solid rgba(245,158,11,0.2)' } },
    cancelled: { label: 'Cancelled', style: { background: 'rgba(239,68,68,0.1)',  color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)' } },
  };
  const { label, style } = map[status] || { label: status, style: { background: 'rgba(255,255,255,0.05)', color: '#a1a1aa', border: '1px solid rgba(255,255,255,0.08)' } };
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider" style={style}>
      {label}
    </span>
  );
}

export default function MyBookings() {
  const navigate = useNavigate();
  const [email, setEmail]           = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [bookings, setBookings]     = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const res  = await fetch(`${baseUrl}/api/bookings?email=${encodeURIComponent(email.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch bookings');
      setBookings(data.data);
      setHasSearched(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="nav-header">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 flex h-14 items-center gap-3">
          <button onClick={() => navigate('/')} className="btn-ghost py-1.5 px-3 gap-2 text-sm">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"/>
            </svg>
            All Experts
          </button>
          <div className="h-4 w-px bg-white/10" />
          <Link to="/" className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-white flex items-center justify-center">
              <svg className="h-3.5 w-3.5 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-zinc-200 tracking-tight">ExpertBook</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 sm:px-6 pt-20 pb-28">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <div
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl mb-5 mx-auto"
            style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}
          >
            <svg className="h-6 w-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"/>
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-zinc-100 tracking-tight mb-2">My Bookings</h1>
          <p className="text-zinc-500 font-light">Enter your email to view your session history.</p>
        </motion.div>

        {/* Search */}
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSearch}
          className="flex gap-2 mb-10"
        >
          <div className="flex-1 relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 pointer-events-none"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"/>
            </svg>
            <input
              type="email" required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control pl-10 h-11"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary h-11 px-5 shrink-0">
            {loading ? (
              <span className="h-4 w-4 rounded-full border-2 border-zinc-900/30 border-t-zinc-900 animate-spin" />
            ) : 'Search'}
          </button>
        </motion.form>

        {error && <ErrorMessage message={error} onRetry={() => setError(null)} />}

        {loading && <LoadingSpinner label="Finding your bookings…" />}

        {/* Results */}
        <AnimatePresence>
          {!loading && !error && hasSearched && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {bookings.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-4 py-16 text-center"
                >
                  <div
                    className="h-14 w-14 rounded-2xl flex items-center justify-center"
                    style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <svg className="h-7 w-7 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-zinc-300 font-medium mb-1">No bookings found</p>
                    <p className="text-zinc-600 text-sm max-w-xs mx-auto">
                      We couldn't find sessions booked under <em className="text-zinc-500 not-italic">{email}</em>.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-zinc-600 font-medium mb-4">
                    {bookings.length} booking{bookings.length !== 1 ? 's' : ''} found
                  </p>
                  {bookings.map((b, i) => {
                    const { start } = formatSlot(b.timeSlot);
                    const dateLabel = new Date(b.date).toLocaleDateString('en-US', {
                      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
                    });
                    const [g1, g2] = getGradient(b.expertId?.name);
                    const abbr = initials(b.expertId?.name);

                    return (
                      <motion.div
                        key={b._id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="relative flex gap-4 p-4 rounded-2xl transition-colors"
                        style={{
                          background: '#111113',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        {/* Status bar accent */}
                        <div
                          className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full"
                          style={{
                            background: b.status === 'confirmed' ? '#10b981'
                              : b.status === 'pending' ? '#f59e0b'
                              : '#ef4444',
                          }}
                        />

                        {/* Date block */}
                        <div
                          className="flex-shrink-0 w-14 flex flex-col items-center justify-center rounded-xl py-2 px-1 text-center"
                          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                        >
                          <span className="text-[9px] font-medium uppercase tracking-widest text-zinc-600">
                            {dateLabel.split(' ')[0]}
                          </span>
                          <span className="text-lg font-bold text-zinc-100 leading-tight">
                            {new Date(b.date).getDate()}
                          </span>
                          <span className="text-[9px] text-zinc-500">
                            {new Date(b.date).toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                        </div>

                        {/* Expert info */}
                        <div className="flex-1 min-w-0 pl-1">
                          <div className="flex items-center gap-2.5 mb-1">
                            <div
                              className="h-7 w-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] font-semibold"
                              style={{ background: `linear-gradient(135deg, ${g1}, ${g2})` }}
                            >
                              {abbr}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-zinc-100 truncate leading-tight">
                                {b.expertId?.name || 'Expert'}
                              </p>
                              <p className="text-xs text-zinc-500 truncate">{b.expertId?.category}</p>
                            </div>
                          </div>
                          <p className="text-xs text-zinc-600 mt-1.5">
                            <span className="text-zinc-400 font-medium">{start}</span>
                          </p>
                        </div>

                        {/* Status + link */}
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <StatusPill status={b.status} />
                          <Link
                            to={`/experts/${b.expertId?._id}`}
                            className="text-[11px] font-medium text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1"
                          >
                            View
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
                            </svg>
                          </Link>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
