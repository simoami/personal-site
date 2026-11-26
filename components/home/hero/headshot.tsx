import Image from 'next/image';
import headshot from '#images/headshot.jpg';

// The photo's rendered width in CSS px (13rem at the 152px frame); the srcset tops out at 2x of it.
const PHOTO_SIZE = 208;

/**
 * Renders the round, bordered portrait. `className` sizes the frame; the photo inside is zoomed to
 * 137% of it (13rem at 152px) and pinned to the top, so the crop favours the face over the shoulders.
 */
export function Headshot({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex shrink-0 justify-center overflow-hidden rounded-full [corner-shape:squircle] border border-line bg-surface mix-blend-luminosity hover:mix-blend-normal transition-all duration-1000 ${className}`}
    >
      <Image
        src={headshot}
        alt='Simo Moujami'
        width={PHOTO_SIZE}
        height={PHOTO_SIZE}
        // The static import supplies the intrinsic size and a tiny blur preview, so nothing shifts.
        placeholder='blur'
        // Always above the fold; eager beats a lazy fetch that waits for layout.
        loading='eager'
        className='w-[137%] max-w-none sm:w-49 shrink-0 self-start'
      />
    </div>
  );
}
