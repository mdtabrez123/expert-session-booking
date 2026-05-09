import { useRef, useEffect } from 'react';

export default function SearchBar({ value, onChange }) {
  const inputRef = useRef(null);

  // Cmd/Ctrl+K shortcut focus
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="relative flex items-center w-full">
      <svg
        className="pointer-events-none absolute left-3.5 h-4 w-4 text-zinc-600 flex-shrink-0"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 15.803a7.5 7.5 0 0 0 10.607 0Z"/>
      </svg>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search experts…"
        className="w-full bg-transparent border-none outline-none text-sm text-zinc-200 placeholder-zinc-600 py-3 pl-10 pr-4 focus:ring-0"
        id="expert-search"
        autoComplete="off"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 p-1 rounded-md text-zinc-600 hover:text-zinc-300 hover:bg-white/5 transition-colors"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
          </svg>
        </button>
      )}
      {!value && (
        <kbd className="absolute right-3 hidden sm:flex items-center gap-0.5 text-[10px] font-medium text-zinc-700 bg-white/[0.04] border border-white/[0.07] rounded px-1.5 py-0.5">
          ⌘K
        </kbd>
      )}
    </div>
  );
}
