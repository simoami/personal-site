import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import type { ReactNode } from 'react';
import { PageBackground } from '#components/page-background';
import { ThemeProvider } from '#components/theme-provider';
import { ThemeToggle } from '#components/theme-toggle';
import {
  HERO_COPY_ID,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_ORIGIN,
} from '#lib/site';
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
      // next-themes sets data-theme before hydration.
      suppressHydrationWarning
    >
      <body className='bg-page font-sans text-fg antialiased'>
        <ThemeProvider
          attribute='data-theme'
          defaultTheme='dark'
          enableSystem={false}
          disableTransitionOnChange
        >
          <a
            className='fixed start-2 top-2 z-200 -translate-y-[calc(100%+12px)] bg-primary-fg p-3 text-sunken focus:translate-y-0'
            href='#main-content'
          >
            Skip to content
          </a>
          <header className='absolute z-100 w-full'>
            <div className='frame flex flex-wrap items-center justify-between gap-3 px-gutter py-2.5'>
              <div className='ms-auto flex flex-wrap items-center gap-2'>
                <nav
                  className='flex flex-wrap items-center gap-1 text-sm text-muted *:px-1.5 *:py-3 sm:*:px-3'
                  aria-label='Primary'
                >
                  <a href='/#projects'>Projects</a>
                  <a href='/#writing'>Writing</a>
                </nav>
                <ThemeToggle />
              </div>
            </div>
          </header>
          {/* The one translucent layer over the field: at least a screen tall, so the footer sits at the bottom of short pages. */}
          <div className='frame flex min-h-screen flex-col border-x border-line bg-page/80'>
            {children}
            <footer className='px-gutter pt-7 pb-10 text-sm text-muted'>
              <span>© 2026 Simo Moujami</span>
            </footer>
          </div>
          <PageBackground clearId={HERO_COPY_ID} />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
