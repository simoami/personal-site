// Renders every `diagrams/<post>/<name>.d2` to `public/images/posts/<post>/<name>-{light,dark}.svg`.
// The site's theme toggle sets `data-theme`, which an SVG's own `prefers-color-scheme` query can't see,
// so each diagram ships as two files and the page shows the one matching the active theme.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const SOURCE_DIR = 'diagrams';
const OUTPUT_DIR = join('public', 'images', 'posts');
const FONT = 'node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf';

// D2 theme color roles: N1-N7 run from primary text to background, B1-B6 from edges to fills.
const PALETTES = {
  light: {
    N1: '#171717',
    N2: '#666666',
    N3: '#666666',
    N4: '#A1A1A1',
    N5: '#D4D4D4',
    N6: '#EAEAEA',
    N7: '#FAFAFA',
    B1: '#8F8F8F',
    B2: '#A1A1A1',
    B3: '#D4D4D4',
    B4: '#F2F2F2',
    B5: '#F7F7F7',
    B6: '#FFFFFF',
    AA2: '#8F8F8F',
    AA4: '#EAEAEA',
    AA5: '#F5F5F5',
    AB4: '#EAEAEA',
    AB5: '#F5F5F5',
  },
  dark: {
    N1: '#EDEDED',
    N2: '#A1A1A1',
    N3: '#A1A1A1',
    N4: '#666666',
    N5: '#404040',
    N6: '#2E333B',
    N7: '#1D2128',
    B1: '#7A7F87',
    B2: '#5C6169',
    B3: '#3A3F47',
    B4: '#23282F',
    B5: '#20252C',
    B6: '#262B33',
    AA2: '#7A7F87',
    AA4: '#2E333B',
    AA5: '#23282F',
    AB4: '#2E333B',
    AB5: '#23282F',
  },
};

function config(palette) {
  const overrides = Object.entries(palette)
    .map(([role, color]) => `${role}: "${color}"`)
    .join('; ');
  return `vars: { d2-config: { theme-id: 0; pad: 24; theme-overrides: { ${overrides} } } }\n`;
}

for (const post of readdirSync(SOURCE_DIR)) {
  const outDir = join(OUTPUT_DIR, post);
  mkdirSync(outDir, { recursive: true });

  for (const file of readdirSync(join(SOURCE_DIR, post)).filter((f) =>
    f.endsWith('.d2'),
  )) {
    const source = readFileSync(join(SOURCE_DIR, post, file), 'utf8');
    const name = basename(file, '.d2');

    for (const [mode, palette] of Object.entries(PALETTES)) {
      const out = join(outDir, `${name}-${mode}.svg`);
      // Geist ships one weight here; reusing it for bold and italic keeps every label in Geist.
      const fonts = ['regular', 'bold', 'semibold', 'italic'].map(
        (style) => `--font-${style}=${FONT}`,
      );
      execFileSync('d2', [...fonts, '-', out], {
        input: config(palette) + source,
        stdio: ['pipe', 'ignore', 'inherit'],
      });
      console.log(out);
    }
  }
}
