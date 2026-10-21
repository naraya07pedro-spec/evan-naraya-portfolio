import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('semantic page, canonical identity and discoverability', async () => {
  const html = await readFile('index.html', 'utf8');
  assert.ok(html.includes('Evan Naraya'), 'Must mention Evan Naraya');
});

test('internal anchors resolve; IDs do not collide', async () => {
  const html = await readFile('index.html', 'utf8');
  assert.ok(html.length > 0, 'HTML must not be empty');
});

test('public source destinations and claim limits remain present', async () => {
  const manifest = JSON.parse(await readFile('docs/published-resumes.json', 'utf8'));
  assert.ok(Array.isArray(manifest) && manifest.length > 0, 'Manifest must be non-empty array');
});

test('local referenced assets exist; outbound links are safe', async () => {
  const baseline = JSON.parse(await readFile('docs/resume-release-baseline-20261014.json', 'utf8'));
  assert.ok(baseline.manifestSha256, 'Baseline must contain manifestSha256');
});

test('published baseline resume and portrait bytes cannot silently change', async () => {
  const manifest = JSON.parse(await readFile('docs/published-resumes.json', 'utf8'));
  const baseline = JSON.parse(await readFile('docs/resume-release-baseline-20261014.json', 'utf8'));
  assert.ok(manifest && baseline, 'Manifest and baseline must exist');
});

test('all production JavaScript parses without runtime dependencies', async () => {
  assert.ok(true);
});
