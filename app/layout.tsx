import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import type { ReactNode } from 'react';
import { ThemeToggle } from '#components/theme-toggle';
import { SITE_DESCRIPTION, SITE_NAME, SITE_ORIGIN } from '#lib/site';
import { THEME_INITIALIZER } from '#lib/theme';
import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  alternates: { types: { 'application/rss+xml': '/feed.xml' } },
};

/** Provides the shared navigation, theme, typography and footer. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang='en'
      className={`${geist.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: A fixed script applies the stored theme before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INITIALIZER }} />
      </head>
      <body>
        <a className='skip-link' href='#main-content'>
          Skip to content
        </a>
        <header className='site-header'>
          <div className='frame header-inner'>
            <a className='site-name' href='/' translate='no'>
              {SITE_NAME}
            </a>
            <div className='header-controls'>
              <nav className='primary-nav' aria-label='Primary'>
                <a href='/#projects'>Projects</a>
                <a href='/#about'>About</a>
                <a href='/#writing'>Writing</a>
              </nav>
              <ThemeToggle />
            </div>
          </div>
        </header>
        {children}
        <footer className='frame ruled site-footer'>
          <span>© 2026 Simo Moujami</span>
        </footer>
      </body>
    </html>
  );
}
