#!/usr/bin/env node
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');

const output = fs.mkdtempSync(path.join(os.tmpdir(), 'lc2-benchmark-smoke-'));
try {
  const script = path.join(__dirname, 'compare_routes.cjs');
  const run = spawnSync(process.execPath, [
    script, '--smoke', '--output', output,
  ], { encoding: 'utf8', timeout: 120000 });
  assert.equal(run.status, 0, run.stderr || run.stdout || 'benchmark failed');
  const rows = fs.readFileSync(path.join(output, 'runs.csv'), 'utf8')
    .trim().split(/\r?\n/);
  assert.equal(rows.length, 13, 'Expected 3 scenarios x 4 algorithms plus header');
  for (const name of ['A*', 'Dijkstra', 'Greedy', 'ABC']) {
    const matches = rows.filter(row => row.includes(',' + name + ','));
    assert.equal(matches.length, 3, name + ' should have three timed runs');
  }
  for (const file of ['summary.csv', 'scenarios.json', 'report.md']) {
    assert.ok(fs.existsSync(path.join(output, file)), file + ' should exist');
  }
  const summary = fs.readFileSync(path.join(output, 'summary.csv'), 'utf8');
  assert.ok(summary.includes('Dijkstra,3,3,100'), 'Dijkstra should solve all smoke cases');
  const constrainedDir = path.join(output, 'constrained');
  const constrainedSummary = fs.readFileSync(path.join(constrainedDir, 'summary.csv'), 'utf8');
  for (const algorithm of ['Resource-Constrained A*', 'Resource-Constrained Dijkstra']) {
    const row = constrainedSummary.split('\n').find(line => line.startsWith(algorithm + ','));
    assert.ok(row, algorithm);
    const fields = row.split(',');
    assert.deepEqual(fields.slice(1, 4), ['3', '3', '100']);
    assert.equal(fields[9], '100');
  }
  console.log('Standalone routing benchmark smoke test passed.');
} finally {
  fs.rmSync(output, { recursive: true, force: true });
}
