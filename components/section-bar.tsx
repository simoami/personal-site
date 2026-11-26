import type { ReactNode } from 'react';

interface SectionBarProps {
  headingId: string;
  number: string;
  title: string;
  action?: ReactNode;
  children?: ReactNode;
}

/** The ruled row that opens a home section: a numbered mono label, with an optional link on the right. */
export function SectionBar({
  headingId,
  number,
  title,
  action,
  children,
}: SectionBarProps) {
  return (
    <div className='bg-page/80'>
      <div className='flex min-h-15 flex-wrap items-center justify-between gap-x-4 px-gutter py-2'>
        <h2
          id={headingId}
          className='font-mono text-xs tracking-[0.08em] text-muted uppercase'
        >
          <span aria-hidden='true'>{number} / </span>
          {title}
        </h2>
        {action}
      </div>
      {children}
    </div>
  );
}
