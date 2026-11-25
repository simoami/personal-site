'use client';

import type { BackgroundHandle } from 'asciify-engine/kit';
import { useEffect, useRef, useState } from 'react';

interface BackgroundProps {
  heroId: string;
  copyId: string;
}

/** Mounts the decorative field in the hero and releases it when the hero unmounts. */
export function Background({ heroId, copyId }: BackgroundProps) {
  const backgroundRef = useRef<BackgroundHandle | null>(null);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let active = true;

    async function mountBackground() {
      try {
        const { background, wordField } = await import('asciify-engine/kit');
        if (!active) return;

        const hero = document.getElementById(heroId);
        const copy = document.getElementById(copyId);
        if (!hero || !copy) throw new Error('The hero or its copy is missing');

        const field = background(hero, {
          preset: wordField,
          clear: copy,
          palette: { light: '#73716b', dark: '#7d7b75' },
          charset: ' .:-=+*#%@',
          cursor: false,
          opacity: 0.6,
        });
        backgroundRef.current = field;
        if (!field.supported) throw new Error('WebGL2 is unavailable');
        setReady(true);
      } catch (error) {
        if (active) console.error('Could not load the hero background.', error);
      }
    }

    void mountBackground();

    return () => {
      active = false;
      backgroundRef.current?.destroy();
      backgroundRef.current = null;
    };
  }, [heroId, copyId]);

  function handleToggleMotion() {
    const field = backgroundRef.current;
    if (!field) return;

    if (paused) field.play();
    else field.pause();
    setPaused(!paused);
  }

  if (!ready) return null;

  return (
    <button
      className='motion-toggle'
      type='button'
      onClick={handleToggleMotion}
    >
      {paused ? 'Play background' : 'Pause background'}
    </button>
  );
}
