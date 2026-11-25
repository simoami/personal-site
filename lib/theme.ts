export const THEME_STORAGE_KEY = 'simo-site-theme';

export const THEME_INITIALIZER = `try {
  const theme = localStorage.getItem('${THEME_STORAGE_KEY}');
  if (theme === 'dark' || theme === 'light') document.documentElement.dataset.theme = theme;
} catch {}`;
