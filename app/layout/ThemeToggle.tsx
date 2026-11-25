'use client';

import { THEME_STORAGE_KEY } from '#lib/theme';

/** Switches the system or chosen color scheme and remembers the visitor's selection. */
export function ThemeToggle() {
  function handleToggleTheme() {
    const root = document.documentElement;
    const dark =
      root.dataset.theme === 'dark' ||
      (root.dataset.theme !== 'light' &&
        matchMedia('(prefers-color-scheme: dark)').matches);
    const theme = dark ? 'light' : 'dark';
    root.dataset.theme = theme;

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // The active page still uses the chosen theme when storage is unavailable.
    }
  }

  return (
    <button
      className='theme-toggle'
      type='button'
      onClick={handleToggleTheme}
      aria-label='Switch color theme'
    >
      <svg
        className='theme-sun'
        aria-hidden='true'
        width='18'
        height='18'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
      >
        <circle cx='12' cy='12' r='4' />
        <path d='M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4' />
      </svg>
      <svg
        className='theme-moon'
        aria-hidden='true'
        width='18'
        height='18'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z' />
      </svg>
    </button>
  );
}
