/**
 * A crisp, neutral arrow cursor (not the OS default) for the desktop shell —
 * keeps the "real system" feeling without borrowing any platform's cursor artwork.
 */
const CURSOR_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
    <path d="M3 1.5 L3 16.5 L7 12.8 L9.6 18.2 L12 17 L9.4 11.7 L14.5 11.4 Z" fill="#0a0a0c" stroke="#ffffff" stroke-width="1.1" stroke-linejoin="round"/>
  </svg>`
);

export const DESKTOP_CURSOR = `url("data:image/svg+xml,${CURSOR_SVG}") 3 2, auto`;
