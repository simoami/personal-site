// Renders every `diagrams/<post>/<name>.d2` to `public/images/posts/<post>/<name>-{light,dark}.svg`.
// The site's theme toggle sets `data-theme`, which an SVG's own `prefers-color-scheme` query can't see,
// so each diagram ships as two files and the page shows the one matching the active theme.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const SOURCE_DIR = 'diagrams';
const OUTPUT_DIR = join('public', 'images', 'posts');
const FONTS = 'node_modules/geist/dist/fonts';

const FONT_FLAGS = [
  `--font-regular=${FONTS}/geist-sans/Geist-Regular.ttf`,
  `--font-italic=${FONTS}/geist-sans/Geist-Regular.ttf`,
  `--font-semibold=${FONTS}/geist-sans/Geist-Medium.ttf`,
  // D2 bolds every shape label; regular weight matches the site's diagrams. Mono bold stays heavier for group titles.
  `--font-bold=${FONTS}/geist-sans/Geist-Regular.ttf`,
  `--font-mono=${FONTS}/geist-mono/GeistMono-Regular.ttf`,
  `--font-mono-semibold=${FONTS}/geist-mono/GeistMono-Medium.ttf`,
  `--font-mono-bold=${FONTS}/geist-mono/GeistMono-SemiBold.ttf`,
];

// Room above a container's children for its top-left label, so edges and children never cover it.
const ELK_FLAGS = ['--elk-padding=[top=56,left=24,bottom=24,right=24]'];

// Each mode sets D2's theme roles plus the variables the sources use for emphasis (`${red}`, `${teal}`...).
// D2 roles: N1 is text, N7 the canvas, B1 shape borders, B4-B6 container and shape fills.
const MODES = {
  light: {
    roles: {
      N1: '#171717',
      N2: '#4D4D4D',
      N3: '#666666',
      N4: '#8F8F8F',
      N5: '#D4D4D4',
      N6: '#EBEBEB',
      N7: '#FFFFFF',
      B1: '#D4D4D4',
      B2: '#D4D4D4',
      B3: '#EBEBEB',
      B4: '#FAFAFA',
      B5: '#FFFFFF',
      B6: '#FFFFFF',
      AA2: '#D4D4D4',
      AA4: '#FAFAFA',
      AA5: '#FAFAFA',
      AB4: '#FAFAFA',
      AB5: '#FAFAFA',
    },
    vars: {
      fg: '#171717',
      line: '#D4D4D4',
      surface: '#FFFFFF',
      hatch: '#E6E6E6',
      red: '#DA2F35',
      'red-fill': '#FFF0F0',
      teal: '#0A7B72',
      'teal-fill': '#EBFAF7',
    },
  },
  dark: {
    roles: {
      N1: '#EDEDED',
      N2: '#C7C7C7',
      N3: '#A1A1A1',
      N4: '#7C7C7C',
      N5: '#3D3D3D',
      N6: '#262626',
      N7: '#0A0A0A',
      B1: '#3D3D3D',
      B2: '#3D3D3D',
      B3: '#262626',
      B4: '#111111',
      B5: '#0A0A0A',
      B6: '#0A0A0A',
      AA2: '#3D3D3D',
      AA4: '#111111',
      AA5: '#111111',
      AB4: '#111111',
      AB5: '#111111',
    },
    vars: {
      fg: '#EDEDED',
      line: '#3D3D3D',
      surface: '#0A0A0A',
      hatch: '#232323',
      // Lighter than the light-mode red so it keeps contrast against the near-black canvas.
      red: '#FF6166',
      'red-fill': '#2A1215',
      teal: '#2DD4BF',
      'teal-fill': '#0B2622',
    },
  },
};

// Shared look: dark arrows, squared boxes, hatched mono-labelled containers and `pill` labels on edges.
const STYLE = `
classes: {
  group: {
    label.near: top-left
    style: { font: mono; bold: true; font-size: 13; fill-pattern: lines; border-radius: 0 }
  }
  pill: {
    style: { font: mono; bold: false; font-size: 13; border-radius: 999; stroke: \${fg}; fill: \${surface} }
  }
  pill-red: {
    style: { font: mono; bold: false; font-size: 13; border-radius: 999; stroke: \${red}; fill: \${red-fill}; font-color: \${red} }
  }
  pill-teal: {
    style: { font: mono; bold: false; font-size: 13; border-radius: 999; stroke: \${teal}; fill: \${teal-fill}; font-color: \${teal} }
  }
}
(** -> **)[*].style.stroke: \${fg}
(** -- **)[*].style.stroke: \${fg}
`;

function header({ roles, vars }) {
  const overrides = Object.entries(roles)
    .map(([role, color]) => `${role}: "${color}"`)
    .join('; ');
  const values = Object.entries(vars)
    .map(([name, color]) => `${name}: "${color}"`)
    .join('\n  ');
  return `vars: {\n  ${values}\n  d2-config: { theme-id: 0; pad: 24; layout-engine: elk; theme-overrides: { ${overrides} } }\n}\n${STYLE}\n`;
}

const LINES_PATTERN = /<pattern id="(lines-d2-\d+)"[\s\S]*?<\/pattern>/;

// D2's `lines` fill is faint horizontal rules that vanish on a dark canvas; swap in a diagonal hatch.
function hatch(svg, color) {
  return svg
    .replace(
      LINES_PATTERN,
      (_, id) =>
        `<pattern id="${id}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="1" height="6" fill="${color}"/></pattern>`,
    )
    .replaceAll('mix-blend-mode: multiply;', 'mix-blend-mode: normal;');
}

for (const post of readdirSync(SOURCE_DIR)) {
  const outDir = join(OUTPUT_DIR, post);
  mkdirSync(outDir, { recursive: true });

  for (const file of readdirSync(join(SOURCE_DIR, post)).filter((f) =>
    f.endsWith('.d2'),
  )) {
    const source = readFileSync(join(SOURCE_DIR, post, file), 'utf8');
    const name = basename(file, '.d2');

    for (const [mode, theme] of Object.entries(MODES)) {
      const out = join(outDir, `${name}-${mode}.svg`);
      const svg = execFileSync('d2', [...FONT_FLAGS, ...ELK_FLAGS, '-', '-'], {
        input: header(theme) + source,
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore'],
      });
      writeFileSync(out, hatch(svg, theme.vars.hatch));
      console.log(out);
    }
  }
}
