function Icon({ name, className = "w-6 h-6", strokeWidth = 1.8 }) {
  const icons = {
    shield: <path d="M12 2 3 6v6c0 5 4 8.5 9 10 5-1.5 9-5 9-10V6l-9-4z" />,
    siren: (
      <>
        <path d="M9 9a3 3 0 0 1 6 0v6H9V9z" />
        <path d="M5 15a7 7 0 0 1 14 0" />
        <path d="M21 15v3H3v-3" />
        <path d="M12 2v2" />
      </>
    ),
    walk: (
      <>
        <circle cx="13" cy="4" r="1.5" fill="currentColor" stroke="none" />
        <path d="M10 8l2-1.5 2.5 1.5 2 4M9 13l1.5-3 3 1 1.5 5M8 21l2-6 2 2 1 4M14 17l2 4" />
      </>
    ),
    chat: (
      <>
        <path d="M21 12a8 8 0 1 1-3.5-6.6" />
        <path d="M21 5v5h-5" />
        <circle cx="9" cy="12" r="0.5" fill="currentColor" stroke="none" />
        <path d="M4 20l1.2-3.6A8 8 0 0 1 4 12" />
      </>
    ),
    pin: (
      <>
        <path d="M12 21s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12z" />
        <circle cx="12" cy="9" r="2.5" />
      </>
    ),
    phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
    fist: (
      <>
        <path d="M8 11V7a2 2 0 0 1 4 0M12 11V6a2 2 0 0 1 4 0v1M16 11V8a2 2 0 0 1 4 0v6a5 5 0 0 1-5 5h-2a6 6 0 0 1-5-2.7L5 13a1.6 1.6 0 0 1 2.6-1.8L9 13" />
      </>
    ),
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {icons[name] || null}
    </svg>
  );
}

export default Icon;
