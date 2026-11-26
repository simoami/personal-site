'use client';

import type { BackgroundHandle } from 'asciify-engine/kit';
import { useEffect, useRef, useState } from 'react';

const HOST_ID = 'page-background';

interface PageBackgroundProps {
  /** An element the field fades out around, such as the home intro. Pages without it get an even field. */
  clearId: string;
}

/** Mounts the decorative field behind the whole viewport and releases it on unmount. */
export function PageBackground({ clearId }: PageBackgroundProps) {
  const backgroundRef = useRef<BackgroundHandle | null>(null);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let active = true;

    async function mountBackground() {
      try {
        const { background, wordField } = await import('asciify-engine/kit');
        if (!active) return;

        const host = document.getElementById(HOST_ID);
        if (!host) throw new Error('The background host is missing');

        const field = background(host, {
          preset: wordField,
          clear: document.getElementById(clearId) ?? false,
          palette: { light: 'var(--color-muted)', dark: 'var(--color-muted)' },
          charset: ' .:-=+*#%@',
          cursor: true,
          speed: 0.3,
        });
        if (!field.supported) {
          field.destroy();
          return;
        }

        backgroundRef.current = field;
        setReady(true);
      } catch (error) {
        if (active) console.error('Could not load the page background.', error);
      }
    }

    void mountBackground();

    return () => {
      active = false;
      backgroundRef.current?.destroy();
      backgroundRef.current = null;
    };
  }, [clearId]);

  function handleToggleMotion() {
    const field = backgroundRef.current;
    if (!field) return;

    if (paused) field.play();
    else field.pause();
    setPaused(!paused);
  }

  return (
    <>
      {/* Fixed to the viewport so the canvas stays one screen in size while the page scrolls over it;
          the negative z-index keeps it above the body color and below every section. */}
      <div
        id={HOST_ID}
        className='pointer-events-none fixed inset-0 -z-1'
        aria-hidden='true'
      />
      {ready && (
        <button
          className='fixed end-2 bottom-2 z-100 min-h-11 cursor-pointer px-1 font-mono text-[11px] text-muted hover:text-fg hover:underline motion-reduce:hidden'
          type='button'
          onClick={handleToggleMotion}
        >
          {paused ? 'Play background' : 'Pause background'}
        </button>
      )}
    </>
  );
}
