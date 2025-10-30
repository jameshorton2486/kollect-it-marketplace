// Simple WCAG contrast checks for token pairs
// Usage: bun run test:contrast (or npm run test:contrast)

import { hex } from 'wcag-contrast';

const tests = [
  { name: 'Primary text on white', fg: '#2C2C2C', bg: '#FFFFFF' },
  { name: 'CTA text on button', fg: '#FFFFFF', bg: '#1E3A5F' },
  { name: 'Link on white', fg: '#4B688E', bg: '#FFFFFF' },
  { name: 'Accent on white', fg: '#8B6937', bg: '#FFFFFF' },
];

let failures = 0;

for (const test of tests) {
  const ratio = hex(test.fg, test.bg);
  const passes = ratio >= 4.5;
  const status = passes ? 'PASS' : 'FAIL';
  console.log(`${status} ${test.name}: ${ratio.toFixed(2)}:1`);
  if (!passes) failures++;
}

if (failures > 0) {
  process.exitCode = 1;
}
