import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const GRADIENTS = [
  ['#4f46e5','#7c3aed'], // indigo→violet
  ['#0ea5e9','#6366f1'], // sky→indigo
  ['#10b981','#059669'], // emerald
  ['#f59e0b','#d97706'], // amber
  ['#ec4899','#db2777'], // pink
  ['#8b5cf6','#a855f7'], // violet→purple
];

export default function ExpertCard({ expert, index = 0 }) {
  const { _id, name, category, experience, rating } = expert;
  const [color1, color2] = GRADIENTS[index % GRADIENTS.length];

  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  // Spotlight / cursor glow
  const cardRef = useRef(null);
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, visible: false });

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSpotlight({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true });
  };
  const handleMouseLeave = () => setSpotlight((s) => ({ ...s, visible: false }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to={`/experts/${_id}`} className="group block outline-none" tabIndex={0}>
        <article
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111113] transition-all duration-300 hover:border-white/[0.12] hover:bg-[#18181b] hover:shadow-[0_8px_40px_rgba(0,0,0,0.5)] cursor-pointer"
          style={{ transform: 'translateZ(0)' }}
        >
          {/* Cursor spotlight glow */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-400"
            style={{
              opacity: spotlight.visible ? 1 : 0,
              background: spotlight.visible
                ? `radial-gradient(200px circle at ${spotlight.x}px ${spotlight.y}px, rgba(139,92,246,0.07), transparent 70%)`
                : 'transparent',
            }}
          />

          {/* Top accent line — slides in on hover */}
          <div className="absolute top-0 left-0 right-0 h-px">
            <div
              className="h-full w-full scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ background: `linear-gradient(90deg, transparent, ${color1}60, ${color2}60, transparent)` }}
            />
          </div>

          <div className="p-6 flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div
                  className="h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold text-sm select-none"
                  style={{ background: `linear-gradient(135deg, ${color1}, ${color2})` }}
                >
                  {initials}
                </div>
                <div
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ boxShadow: `0 0 0 3px ${color1}30` }}
                />
              </div>

              {/* Name + category */}
              <div className="flex-1 min-w-0 pt-0.5">
                <h2 className="text-[15px] font-semibold text-zinc-100 truncate tracking-tight leading-tight">
                  {name}
                </h2>
                <p className="text-sm text-zinc-500 mt-1 font-medium truncate">{category}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/[0.03] rounded-xl px-3.5 py-2.5 border border-white/[0.05]">
                <p className="text-[10px] font-medium text-zinc-600 uppercase tracking-widest mb-1">Experience</p>
                <p className="text-sm font-semibold text-zinc-200">{experience} <span className="text-zinc-500 font-normal text-xs">yrs</span></p>
              </div>
              <div className="bg-white/[0.03] rounded-xl px-3.5 py-2.5 border border-white/[0.05]">
                <p className="text-[10px] font-medium text-zinc-600 uppercase tracking-widest mb-1">Rating</p>
                <div className="flex items-center gap-1">
                  <svg className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span className="text-sm font-semibold text-zinc-200">{Number(rating).toFixed(1)}</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center justify-between pt-1 border-t border-white/[0.05]">
              <span className="text-xs font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors duration-300">
                Book a session
              </span>
              <div
                className="h-7 w-7 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${color1}20, ${color2}20)`,
                  border: `1px solid ${color1}30`,
                }}
              >
                <svg
                  className="h-3.5 w-3.5 text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
                </svg>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
