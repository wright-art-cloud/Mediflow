// Small stroke-icon set, hand-rolled so the app has no icon-library
// dependency. Every icon takes standard SVG props (className, etc.) and
// inherits color via currentColor, sized by its container's font-size/CSS.

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const IconCross = (p) => (
  <svg {...base} strokeWidth={2.2} {...p}><path d="M12 5v14M5 12h14" /></svg>
);
export const IconHome = (p) => (
  <svg {...base} {...p}><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></svg>
);
export const IconGrid = (p) => (
  <svg {...base} {...p}><rect x="3" y="3" width="7.5" height="7.5" rx="1.5" /><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" /><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" /><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" /></svg>
);
export const IconPill = (p) => (
  <svg {...base} {...p}><path d="M10.5 20.5L3.5 13.5a5 5 0 117-7l7 7a5 5 0 11-7 7z" /><line x1="8.2" y1="8.2" x2="15.8" y2="15.8" /></svg>
);
export const IconCalendar = (p) => (
  <svg {...base} {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /><line x1="8" y1="3" x2="8" y2="7" /><line x1="16" y1="3" x2="16" y2="7" /></svg>
);
export const IconUser = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="8" r="3.8" /><path d="M4.5 21c0-4.2 3.4-6.8 7.5-6.8s7.5 2.6 7.5 6.8" /></svg>
);
export const IconBox = (p) => (
  <svg {...base} {...p}><path d="M21 8l-9-5-9 5 9 5 9-5z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></svg>
);
export const IconDoor = (p) => (
  <svg {...base} {...p}><rect x="5.5" y="2.7" width="13" height="18.5" rx="1" /><circle cx="14.7" cy="12" r="1" fill="currentColor" stroke="none" /></svg>
);
export const IconPeople = (p) => (
  <svg {...base} {...p}><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.5 2.7-5.5 6-5.5s6 2 6 5.5" /><circle cx="17.3" cy="9" r="2.6" /><path d="M15.3 14.3c2.6.4 4.5 2.1 4.5 5.7" /></svg>
);
export const IconClipboard = (p) => (
  <svg {...base} {...p}><rect x="6" y="4" width="12" height="17" rx="2" /><rect x="9" y="2.3" width="6" height="3" rx="1" /><line x1="9" y1="11.5" x2="15" y2="11.5" /><line x1="9" y1="15.5" x2="15" y2="15.5" /></svg>
);
export const IconFileText = (p) => (
  <svg {...base} {...p}><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4" /><line x1="9.5" y1="12.5" x2="14.5" y2="12.5" /><line x1="9.5" y1="16" x2="14.5" y2="16" /></svg>
);
export const IconReceipt = (p) => (
  <svg {...base} {...p}><path d="M6.5 2.7h11v18.6l-2.2-1.4-2.1 1.4-2.2-1.4-2.2 1.4-2.1-1.4-2.2 1.4z" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="9" y1="12" x2="15" y2="12" /></svg>
);
export const IconPieChart = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 3v9l7.5 4.3" /></svg>
);
export const IconSearch = (p) => (
  <svg {...base} {...p}><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.2" y2="16.2" /></svg>
);
export const IconPlus = (p) => (
  <svg {...base} {...p}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
);
export const IconWarning = (p) => (
  <svg {...base} {...p}><path d="M12 3.2L2 20h20L12 3.2z" /><line x1="12" y1="10" x2="12" y2="14.5" /><circle cx="12" cy="17.3" r=".6" fill="currentColor" stroke="none" /></svg>
);
export const IconCheckCircle = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M8.3 12.3l2.5 2.5 5-5.5" /></svg>
);
export const IconInfo = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><line x1="12" y1="11" x2="12" y2="16.5" /><circle cx="12" cy="7.8" r=".6" fill="currentColor" stroke="none" /></svg>
);
export const IconLogout = (p) => (
  <svg {...base} {...p}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
);
export const IconEdit = (p) => (
  <svg {...base} {...p}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" /></svg>
);
export const IconPhone = (p) => (
  <svg {...base} {...p}><path d="M6 3h3l1.4 4-2 1.5a12 12 0 006.1 6.1l1.5-2 4 1.4v3a2 2 0 01-2 2A15.5 15.5 0 014 5a2 2 0 012-2z" /></svg>
);
export const IconMapPin = (p) => (
  <svg {...base} {...p}><path d="M12 21s7-6.5 7-11.5A7 7 0 105 9.5C5 14.5 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.3" /></svg>
);
export const IconClock = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15.5 14" /></svg>
);
export const IconX = (p) => (
  <svg {...base} {...p}><circle cx="11" cy="11" r="7.5" /><line x1="21" y1="21" x2="16.2" y2="16.2" /><line x1="8.3" y1="11" x2="13.7" y2="11" /></svg>
);
export const IconShield = (p) => (
  <svg {...base} {...p}><rect x="5" y="10.5" width="14" height="9.5" rx="2" /><path d="M8 10.5V7.5a4 4 0 018 0v3" /></svg>
);
export const IconBed = (p) => (
  <svg {...base} {...p}><rect x="3" y="7" width="18" height="12" rx="2" /><path d="M3 12h18" /></svg>
);
export const IconCash = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 6.5v11M15.3 9c0-1.4-1.5-2.3-3.3-2.3S8.7 7.6 8.7 9c0 1.5 1.5 2 3.3 2.5s3.3 1 3.3 2.5-1.5 2.3-3.3 2.3-3.3-.9-3.3-2.3" /></svg>
);
