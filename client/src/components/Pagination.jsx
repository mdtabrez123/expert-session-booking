import { motion } from 'framer-motion';

export default function Pagination({ pagination, page, onPageChange, loading }) {
  if (!pagination || pagination.totalPages <= 1) return null;
  const { totalPages, totalExperts } = pagination;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-14 flex flex-col items-center gap-4"
    >
      <p className="text-xs text-zinc-600 font-medium">
        {totalExperts} experts · page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-1.5">
        {/* Prev */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1 || loading}
          className="btn-ghost w-9 h-9 p-0 rounded-lg disabled:opacity-30"
        >
          <svg className="h-4 w-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/>
          </svg>
        </button>

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            disabled={loading}
            className={`relative w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${
              p === page
                ? 'text-zinc-900 cursor-default'
                : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            {p === page && (
              <motion.span
                layoutId="activePage"
                className="absolute inset-0 rounded-lg bg-white"
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}
            <span className="relative z-10">{p}</span>
          </button>
        ))}

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages || loading}
          className="btn-ghost w-9 h-9 p-0 rounded-lg disabled:opacity-30"
        >
          <svg className="h-4 w-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
          </svg>
        </button>
      </div>
    </motion.div>
  );
}
