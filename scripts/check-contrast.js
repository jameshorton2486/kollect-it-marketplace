// scripts/check-contrast.js
import { hex } from 'wcag-contrast';

const tests = [
  { name: 'Primary text on white', fg: '#2C2C2C', bg: '#FFFFFF' },
  { name: 'Secondary text on white', fg: '#5A5A5A', bg: '#FFFFFF' },
  { name: 'CTA text on button', fg: '#FFFFFF', bg: '#1E3A5F' },
  { name: 'Link on white', fg: '#4B688E', bg: '#FFFFFF' },
  { name: 'Accent on white', fg: '#8B6937', bg: '#FFFFFF' },
  { name: 'Text on alt background', fg: '#2C2C2C', bg: '#F5F3F0' },
];

console.log('\n🔍 WCAG Contrast Compliance Check\n');

tests.forEach(test => {
  const ratio = hex(test.fg, test.bg);
  const passes = ratio >= 4.5;
  const status = passes ? '✅ PASS' : '❌ FAIL';
  const rating = ratio >= 7 ? '(AAA)' : ratio >= 4.5 ? '(AA)' : '(FAIL)';
  
  console.log(`${status} ${test.name}: ${ratio.toFixed(2)}:1 ${rating}`);
});

console.log('\n');
