import { motion } from 'framer-motion';

// Card-level skeleton
export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#111113] p-6 flex flex-col gap-5">
      <div className="flex items-start gap-4">
        <div className="skeleton h-12 w-12 rounded-full flex-shrink-0" />
        <div className="flex-1 flex flex-col gap-2 pt-1">
          <div className="skeleton h-4 w-2/3 rounded-lg" />
          <div className="skeleton h-3 w-1/2 rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="skeleton h-14 rounded-xl" />
        <div className="skeleton h-14 rounded-xl" />
      </div>
      <div className="skeleton h-8 w-full rounded-xl" />
    </div>
  );
}

// Slot-level skeleton
export function SlotSkeleton() {
  return <div className="skeleton h-16 rounded-xl" />;
}

// Generic spinner (small, inline)
export default function LoadingSpinner({ label = 'Loading…' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-4 py-20"
    >
      <div className="relative h-10 w-10">
        <div
          className="absolute inset-0 rounded-full border-2 animate-spin"
          style={{ borderColor: 'rgba(139,92,246,0.15)', borderTopColor: '#8b5cf6' }}
        />
      </div>
      {label && <p className="text-sm text-zinc-500 font-medium">{label}</p>}
    </motion.div>
  );
}
