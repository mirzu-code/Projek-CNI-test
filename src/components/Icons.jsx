import React from 'react';

export const FlagMY = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect width="24" height="16" fill="#fff" />
    <rect width="24" height="16" fill="#d52b1e" />
    <rect width="24" height="9" y="0" fill="#d52b1e" />
    <rect width="24" height="2" y="9" fill="#fff" />
    <rect width="24" height="2" y="11" fill="#d52b1e" />
    <rect width="10" height="7" fill="#012169" />
    <g transform="translate(2,1) scale(0.9)" fill="#ffd600">
      <path d="M3 3a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
      <path d="M7 4l-1 2 1 0-1 2 2-1 0 0 1-2-2 1z" />
    </g>
  </svg>
);

export const FlagCN = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect width="24" height="16" fill="#de2910" />
    <g fill="#ffde00">
      <polygon points="3,3 5,4.5 3,6 4.5,5 3,3" />
      <polygon points="6,2 8,3.5 6,5 7.5,3.5 6,2" transform="translate(0.6,0.2) scale(0.9)" />
    </g>
  </svg>
);

export const FlagJP = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect width="24" height="16" fill="#fff" />
    <circle cx="12" cy="8" r="3.5" fill="#bc002d" />
  </svg>
);

export const IconHome = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V11.5z" fill="currentColor" />
  </svg>
);

export const IconCalendar = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="M16 3v4M8 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const IconInfo = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="M11 11h2v5h-2zM11 7h2v2h-2z" fill="currentColor" />
  </svg>
);

export const IconGear = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" fill="currentColor" />
  </svg>
);

export default null;
