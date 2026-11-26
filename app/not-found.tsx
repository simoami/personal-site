/** Provides a way back to the site from an unknown page. */
export default function NotFound() {
  return (
    <main id='main-content' className='flex-1' tabIndex={-1}>
      <div className='grid gap-4 border-b border-line px-gutter pt-9 pb-9 wrap-anywhere sm:pt-16'>
        <h1 className='text-[28px] leading-none font-semibold tracking-[-0.05em] sm:text-[32px]'>
          Page not found
        </h1>
        <a
          className='inline-flex min-h-11 items-center gap-2 justify-self-start font-mono text-sm underline underline-offset-[0.2em]'
          href='/'
        >
          Back to home
        </a>
      </div>
    </main>
  );
}
