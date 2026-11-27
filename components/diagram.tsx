import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// The SVG's outer viewBox gives its intrinsic size, e.g. `viewBox="0 0 631 750"` → 631 × 750.
const VIEW_BOX = /viewBox="\S+ \S+ (\S+) (\S+)"/;

interface DiagramProps {
  /** Public path without the theme suffix, e.g. `/images/posts/my-post/outbox`. */
  src: string;
  alt: string;
  caption?: string;
}

function readSize(src: string) {
  const svg = readFileSync(
    join(process.cwd(), 'public', `${src}-light.svg`),
    'utf8',
  );
  const match = VIEW_BOX.exec(svg);
  if (!match) throw new Error(`${src}-light.svg has no viewBox`);
  return { width: Number(match[1]), height: Number(match[2]) };
}

/**
 * Shows a rendered D2 diagram in the active theme. Each diagram ships as `-light.svg` and
 * `-dark.svg`, since the theme toggle sets `data-theme`, which an image's own media query can't see.
 */
export function Diagram({ src, alt, caption }: DiagramProps) {
  const { width, height } = readSize(src);
  const image = 'mx-auto h-auto max-w-full';

  return (
    <figure className='my-8'>
      {/* biome-ignore lint/performance/noImgElement: Static SVGs gain nothing from image optimization. */}
      <img
        className={`${image} light:hidden`}
        src={`${src}-dark.svg`}
        alt={alt}
        width={width}
        height={height}
        loading='lazy'
        decoding='async'
      />
      {/* biome-ignore lint/performance/noImgElement: Static SVGs gain nothing from image optimization. */}
      <img
        className={`${image} hidden light:block`}
        src={`${src}-light.svg`}
        alt={alt}
        width={width}
        height={height}
        loading='lazy'
        decoding='async'
      />
      {caption && (
        <figcaption className='mt-3 text-center text-sm text-muted'>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
