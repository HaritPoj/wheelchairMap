#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');

const dir = path.resolve(process.argv[2] || path.join(__dirname, 'results'));
const input = path.join(dir, 'summary.csv');
if (!fs.existsSync(input)) {
  console.error('Missing ' + input + '. Run compare_routes.cjs first.');
  process.exit(1);
}

const [header, ...lines] = fs.readFileSync(input, 'utf8')
  .trim().split(/\r?\n/);
const columns = header.split(',');
const rows = lines.filter(Boolean).map(line => {
  const cells = line.split(',');
  return Object.fromEntries(columns.map((key, i) => [key, cells[i] || '']));
});
const escape = value => String(value).replace(/&/g, '&amp;')
  .replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

function plot(file, heading, data, opts = {}) {
  const width = 790;
  const height = 410;
  const left = 90;
  const top = 74;
  const barWidth = 104;
  const gap = 67;
  const baseline = 324;
  const usableHeight = baseline - top;
  const maximum = Math.max(1, opts.fixedMax || 0, ...data.map(item => item.value));
  const scale = value => opts.logarithmic
    ? Math.log1p(Math.max(0, value)) / Math.log1p(maximum)
    : Math.max(0, value) / maximum;
  const palette = ['#2563EB', '#0891B2', '#7C3AED', '#EA580C'];
  const bars = data.map((item, i) => {
    const x = left + i * (barWidth + gap);
    const size = usableHeight * scale(item.value);
    const y = baseline - size;
    return '<rect x="' + x + '" y="' + y + '" width="' + barWidth +
      '" height="' + size + '" fill="' + palette[i % palette.length] +
      '" rx="5"/>' +
      '<text x="' + (x + barWidth / 2) + '" y="' + (y - 10) +
      '" text-anchor="middle" font-size="16" font-weight="600" fill="#1F2937">' +
      escape(Number.isFinite(item.value) ? item.value.toFixed(opts.decimals ?? 2) : 'N/A') +
      '</text>' +
      '<text x="' + (x + barWidth / 2) + '" y="' + (baseline + 28) +
      '" text-anchor="middle" font-size="16" fill="#1F2937">' +
      escape(item.label) + '</text>';
  }).join('\n');
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + width +
      '" height="' + height + '" viewBox="0 0 ' + width + ' ' + height + '">',
    '<rect width="100%" height="100%" fill="#FFFFFF"/>',
    '<text x="' + left + '" y="36" font-family="Arial, sans-serif" font-weight="700" font-size="22" fill="#111827">' +
      escape(heading) + '</text>',
    '<line x1="' + (left - 15) + '" y1="' + baseline + '" x2="' +
      (width - 20) + '" y2="' + baseline + '" stroke="#6B7280" stroke-width="1"/>',
    '<g font-family="Arial, sans-serif">' + bars + '</g>',
    '<text x="' + left + '" y="387" font-family="Arial, sans-serif" font-size="12" fill="#6B7280">' +
      escape(opts.note || '') + '</text>',
    '</svg>',
  ].join('\n');
  fs.writeFileSync(path.join(dir, file), svg + '\n');
}

const values = key => rows.map(row => ({
  label: row.algorithm.replace('Resource-Constrained ', 'RC '),
  value: Number(row[key]) || 0,
}));
plot('execution_time.svg', 'Mean routing time (ms)', values('mean_ms'), {
  logarithmic: true,
  note: 'Bar height uses log(1 + time); labels show measured milliseconds.',
  decimals: 4,
});
plot('optimal_answers.svg', 'Routes matching Dijkstra optimum (%)',
  values('optimal_percent'), {
    fixedMax: 100,
    note: 'Includes unsuccessful routes in denominator; higher is better.',
    decimals: 1,
  });
plot('success_rate.svg', 'Successful route searches (%)',
  values('success_percent'), {
    fixedMax: 100,
    note: 'Success means a valid accessible route from origin to destination.',
    decimals: 1,
  });
console.log('Created execution_time.svg, optimal_answers.svg, success_rate.svg in ' + dir);
