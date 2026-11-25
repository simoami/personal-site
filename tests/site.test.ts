import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';

function readSiteOrigin(env: Record<string, string> = {}) {
  return spawnSync(
    process.execPath,
    [
      '--input-type=module',
      '--eval',
      "import { SITE_ORIGIN } from '#lib/site'; process.stdout.write(SITE_ORIGIN);",
    ],
    { encoding: 'utf8', env: { NODE_ENV: 'test', ...env } },
  );
}

test('uses the local origin when neither deployment variable is set', () => {
  const result = readSiteOrigin();

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, 'http://localhost:3000');
});

test('uses the Vercel production domain over HTTPS', () => {
  const result = readSiteOrigin({
    VERCEL_PROJECT_PRODUCTION_URL: 'production.example.org',
  });

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, 'https://production.example.org');
});

test('gives SITE_URL precedence over the Vercel production domain', () => {
  const result = readSiteOrigin({
    SITE_URL: 'https://override.example.org/',
    VERCEL_PROJECT_PRODUCTION_URL: 'production.example.org',
  });

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, 'https://override.example.org');
});

test('rejects an invalid SITE_URL even when a Vercel domain is set', () => {
  const result = readSiteOrigin({
    SITE_URL: 'ftp://invalid.example.org',
    VERCEL_PROJECT_PRODUCTION_URL: 'production.example.org',
  });

  assert.equal(result.status, 1, result.stderr);
  assert.ok(result.stderr.includes('ZodError'));
});
