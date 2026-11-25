/** Provides a way back to the site from an unknown page. */
export default function NotFound() {
  return (
    <main id='main-content' className='frame ruled' tabIndex={-1}>
      <div className='page-intro'>
        <h1>Page not found</h1>
        <a className='back-link' href='/'>
          Back to home
        </a>
      </div>
    </main>
  );
}
