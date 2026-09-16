const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const spacing = fs.readFileSync(path.join(root, 'src/spacing.css'), 'utf8');
const pageLayout = fs.readFileSync(path.join(root, 'src/page-layout.ts'), 'utf8');

test('flattened layout keeps structural separators full-bleed and content on one gutter', () => {
  assert.match(spacing, /--pgvx-gutter:\s*22px/);
  assert.match(spacing, /\.pgvx-overview\s*\{[^}]*padding-left:\s*0;[^}]*padding-right:\s*0;/s);
  assert.match(spacing, /\.pgvx-card\s*\{[^}]*padding-left:\s*var\(--pgvx-gutter\);[^}]*padding-right:\s*var\(--pgvx-gutter\);/s);
  assert.match(spacing, /\.pgvx-viewport\s*\{[^}]*padding-left:\s*var\(--pgvx-gutter\);[^}]*padding-right:\s*var\(--pgvx-gutter\);/s);
  assert.match(spacing, /\.pgvx-tree\s*\{[^}]*padding:\s*16px var\(--pgvx-gutter\) 22px;/s);
});

test('desktop graph view removes Jenkins main-panel left padding beside the sidebar divider', () => {
  assert.match(pageLayout, /#main-panel \{ min-width:0; padding-left:0; \}/);
  assert.match(pageLayout, /@media \(max-width:800px\)[\s\S]*#main-panel \{ padding-left:var\(--section-padding\); \}/);
});
