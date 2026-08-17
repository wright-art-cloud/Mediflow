// Every PK in the schema is typed String (see the data dictionary in §10),
// not an auto-incrementing integer — that was a deliberate choice so IDs
// stay stable if the data layer later moves off localStorage. This helper
// produces IDs in the same "PREFIX-NNN" shape as the seed data.

const counters = new Map();

/**
 * Generates a new unique-enough ID for a given entity prefix, e.g.
 * createId('PAT') -> 'PAT-013' the first time it's called after seeding
 * 12 patients (PAT-001..PAT-012).
 *
 * Pass `existingIds` (an array of current IDs for that table) the first
 * time you call this for a given prefix in a session, so the counter picks
 * up after the highest existing number instead of colliding with seed data.
 */
export function createId(prefix, existingIds = []) {
  if (!counters.has(prefix)) {
    const highest = existingIds.reduce((max, id) => {
      const match = String(id).match(/-(\d+)$/);
      const num = match ? parseInt(match[1], 10) : 0;
      return Math.max(max, num);
    }, 0);
    counters.set(prefix, highest);
  }
  const next = counters.get(prefix) + 1;
  counters.set(prefix, next);
  return `${prefix}-${String(next).padStart(3, '0')}`;
}
