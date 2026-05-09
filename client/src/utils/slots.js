/**
 * Shared time-slot constants and helpers.
 * Imported by both useBookedSlots hook and UI components.
 */

export const TIME_SLOTS = [
  '09:00-10:00',
  '10:00-11:00',
  '11:00-12:00',
  '12:00-13:00',
  '13:00-14:00',
  '14:00-15:00',
  '15:00-16:00',
  '16:00-17:00',
];

/** "09:00-10:00"  →  { start: "9:00 AM", end: "10:00 AM" } */
export function formatSlot(slot) {
  const fmt = (t) => {
    const [h, m] = t.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
  };
  const [s, e] = slot.split('-');
  return { start: fmt(s), end: fmt(e) };
}

/** Deterministic gradient index from name string */
export function nameGradient(name) {
  const GRADIENTS = [
    'from-slate-700 to-slate-900',
    'from-zinc-700 to-zinc-900',
    'from-neutral-700 to-neutral-900',
    'from-stone-700 to-stone-900',
    'from-gray-700 to-gray-900',
  ];
  const idx = (name || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return GRADIENTS[idx % GRADIENTS.length];
}

/** Two-letter initials from a full name */
export function initials(name) {
  return (name || '')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
