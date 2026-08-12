// Tiny event bus. repositories.js calls notify(table) after every write;
// DataContext.jsx subscribes to it to know when to re-render. This lives
// separately from React so that services/ (and repositories.js itself) stay
// framework-agnostic — they can be imported and tested with plain Node, as
// verify-seed-data.mjs does, with no React involved at all.

const listeners = new Set();

/** Registers a listener, called as listener(tableName) after any write. Returns an unsubscribe function. */
export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Notifies all subscribers that `table` changed. */
export function notify(table) {
  listeners.forEach((listener) => listener(table));
}
