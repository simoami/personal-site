import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // AVIF first: the headshot is roughly 20% smaller than WebP at the same quality.
  images: { formats: ['image/avif', 'image/webp'] },
};

export default nextConfig;
