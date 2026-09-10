export const IconesProdutos = ({ name, size = 20 }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  const paths = {
    search: (
      <>
        <circle cx="11" cy="11" r="7.5" />
        <path d="m20 20-3.6-3.6" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="7" r="3.5" />
        <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
      </>
    ),
    heart: (
      <path d="M20.8 8.8c0 5.4-8.8 10.2-8.8 10.2S3.2 14.2 3.2 8.8A4.8 4.8 0 0 1 12 5.7a4.8 4.8 0 0 1 8.8 3.1Z" />
    ),
    cart: (
      <>
        <path d="M3 4h2l1.7 10.1a2 2 0 0 0 2 1.7h8.7a2 2 0 0 0 1.9-1.4L21 8H6" />
        <circle cx="9" cy="20" r="1.2" />
        <circle cx="18" cy="20" r="1.2" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    minus: <path d="M5 12h14" />,
    check: <path d="m5 12 4 4L19 6" />,
    refresh: (
      <>
        <path d="M20 11a8 8 0 0 0-14.9-4" />
        <path d="M4 4v5h5" />
        <path d="M4 13a8 8 0 0 0 14.9 4" />
        <path d="M20 20v-5h-5" />
      </>
    ),
    box: (
      <>
        <path d="m3 7 9-4 9 4-9 4-9-4Z" />
        <path d="M3 7v10l9 4 9-4V7" />
        <path d="M12 11v10" />
      </>
    ),
    sparkles: (
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
    ),
  };

  return <svg {...common}>{paths[name]}</svg>;
};