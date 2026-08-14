export function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return `${d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
}

export function formatTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

/** Relative-ish label for recent timestamps: "Today, 4:32 PM" / "Yesterday" / a plain date further back. */
export function formatRelativeDay(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  const now = new Date();
  const startOf = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate());
  const diffDays = Math.round((startOf(now) - startOf(d)) / 86400000);
  if (diffDays === 0) return `Today, ${formatTime(iso)}`;
  if (diffDays === 1) return `Yesterday, ${formatTime(iso)}`;
  return formatDate(iso);
}

export function fullName(person) {
  if (!person) return '—';
  return `${person.first_name} ${person.last_name}`;
}

export function initials(person) {
  if (!person) return '?';
  return `${(person.first_name || '?')[0]}${(person.last_name || '?')[0]}`.toUpperCase();
}
