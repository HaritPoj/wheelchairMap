#!/usr/bin/env node
'use strict';

// Standalone Node.js benchmark. This module is never imported by the Expo app.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { performance } = require('node:perf_hooks');
const os = require('node:os');

const ROOT = path.resolve(__dirname, '..');

function loadFunctions(relativePath, names) {
  const source = fs.readFileSync(path.join(ROOT, relativePath), 'utf8')
    .replace(/\bexport\s+function\s+/g, 'function ');
  const context = {};
  vm.createContext(context);
  const exposed = names.map(name => name + ': ' + name).join(', ');
  vm.runInContext(source + '\nthis.benchmarkExports = {' + exposed + '};', context, {
    filename: relativePath,
    timeout: 10000,
  });
  return context.benchmarkExports;
}

const { parseIndoorGML } = loadFunctions(
  'assets/data/indoorgml/indoorGMLParser.js', ['parseIndoorGML']
);
const { migrateBuildingV1ToV2 } = loadFunctions(
  'assets/data/schemaV2.js', ['migrateBuildingV1ToV2']
);
const { normalizeBuildingData } = loadFunctions(
  'assets/data/buildingAdapter.js', ['normalizeBuildingData']
);
// Reuse the production A*, its edge accessibility/weight rules, heuristic
// and priority queue without importing any React Native/Expo code.
const {
  findAStarPath, getEdgeCost, createHeuristic, createAdjacency, MinHeap,
} = loadFunctions('src/logic/pathfinder.js', [
  'findAStarPath', 'getEdgeCost', 'createHeuristic', 'createAdjacency', 'MinHeap',
]);

function readMap() {
  const gmlDir = path.join(ROOT, 'assets', 'data', 'indoorgml');
  const merged = parseIndoorGML(
    fs.readFileSync(path.join(gmlDir, 'lc2.gml'), 'utf8'),
    require('../assets/data/buildings/lc2.doors.json')
  );
  if (merged.floors.length !== 2) {
    throw new Error('Unified LC2 GML must contain both building levels.');
  }
  const site = JSON.parse(fs.readFileSync(
    path.join(ROOT, 'assets/data/buildings/lc2.site.json'), 'utf8'
  ));
  return normalizeBuildingData(migrateBuildingV1ToV2(merged, site, {
    siteId: 'tu_rangsit',
    siteName: 'Thammasat University Rangsit Campus',
  }));
}

function optionsFromArgs(argv) {
  const options = {
    pairs: 12, runs: 5, seed: 42,
    abcSources: 12, abcCycles: 40, abcLimit: 12,
    output: path.join(__dirname, 'results'),
  };
  const keys = {
    '--pairs': 'pairs', '--runs': 'runs', '--seed': 'seed',
    '--abc-sources': 'abcSources', '--abc-cycles': 'abcCycles',
    '--abc-limit': 'abcLimit',
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      console.log(
        'Usage: node benchmarks/compare_routes.cjs [options]\n' +
        '--pairs N        Number of test origin/destination pairs (default 12)\n' +
        '--runs N         Repetitions per pair/algorithm (default 5)\n' +
        '--seed N         Reproducible random seed (default 42)\n' +
        '--abc-sources N  ABC food sources (default 12)\n' +
        '--abc-cycles N   ABC cycles (default 40)\n' +
        '--abc-limit N    ABC scout abandonment threshold (default 12)\n' +
        '--output DIR     CSV/report directory (default benchmarks/results)\n' +
        '--smoke          Fast, 3-pair, 1-run check'
      );
      process.exit(0);
    }
    if (arg === '--smoke') {
      options.pairs = 3; options.runs = 1;
      options.abcSources = 5; options.abcCycles = 6; options.abcLimit = 4;
      continue;
    }
    if (arg === '--output' && argv[i + 1]) {
      options.output = path.resolve(argv[++i]);
      continue;
    }
    if (keys[arg] && argv[i + 1] !== undefined) {
      const value = Number(argv[++i]);
      if (!Number.isSafeInteger(value) || (arg !== '--seed' && value < 1)) {
        throw new Error('Invalid integer for ' + arg);
      }
      options[keys[arg]] = value;
      continue;
    }
    throw new Error('Unknown/incomplete option: ' + arg);
  }
  return options;
}

function rngFromSeed(seed) {
  let a = seed >>> 0;
  return function random() {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function adjacencyFor(mapData) {
  return createAdjacency(mapData.nodes, mapData.edges);
}

function neighbors(adjacency, id, goalId, nodeMap) {
  const valid = [];
  for (const { edge, next } of adjacency.get(id) || []) {
    if (nodeMap[next].type === 'room' && next !== goalId) continue;
    const cost = getEdgeCost(edge, id, next, nodeMap);
    if (Number.isFinite(cost) && cost >= 0) valid.push({ next, cost });
  }
  return valid;
}

function pathCost(route, mapData, adjacency) {
  if (!Array.isArray(route) || route.length === 0) return Infinity;
  if (route.length === 1) return 0;
  const goalId = route[route.length - 1];
  let sum = 0;
  const visited = new Set();
  for (let index = 1; index < route.length; index += 1) {
    const source = route[index - 1];
    const dest = route[index];
    if (visited.has(source)) return Infinity;
    visited.add(source);
    const candidates = neighbors(adjacency, source, goalId, mapData.nodeMap)
      .filter(item => item.next === dest);
    if (!candidates.length) return Infinity;
    sum += Math.min(...candidates.map(item => item.cost));
  }
  return sum;
}

function reconstruct(previous, startId, goalId) {
  const path = [];
  let current = goalId;
  while (current !== undefined) {
    path.unshift(current);
    if (current === startId) return path;
    current = previous.get(current);
  }
  return [];
}

// Dijkstra is the optimal-cost reference on this nonnegative weighted graph.
function dijkstra(startId, goalId, mapData) {
  const adjacency = adjacencyFor(mapData);
  const queue = new MinHeap((a, b) => a.g - b.g || a.id.localeCompare(b.id));
  const dist = new Map([[startId, 0]]);
  const prev = new Map();
  let expanded = 0;
  queue.push({ id: startId, g: 0 });
  while (queue.size) {
    const current = queue.pop();
    if (current.g !== dist.get(current.id)) continue;
    expanded += 1;
    if (current.id === goalId) {
      return { path: reconstruct(prev, startId, goalId), expanded };
    }
    for (const { next, cost } of neighbors(adjacency, current.id, goalId, mapData.nodeMap)) {
      const tentative = current.g + cost;
      if (tentative >= (dist.get(next) ?? Infinity)) continue;
      dist.set(next, tentative);
      prev.set(next, current.id);
      queue.push({ id: next, g: tentative });
    }
  }
  return { path: [], expanded };
}

// Greedy = Greedy Best-First Search: prioritize h(n), not accumulated cost.
function greedyBestFirst(startId, goalId, mapData) {
  const adjacency = adjacencyFor(mapData);
  const heuristic = createHeuristic(mapData);
  const queue = new MinHeap((a, b) => a.h - b.h || a.id.localeCompare(b.id));
  const seen = new Set([startId]);
  const prev = new Map();
  let expanded = 0;
  queue.push({ id: startId, h: heuristic(startId, goalId) });
  while (queue.size) {
    const current = queue.pop();
    expanded += 1;
    if (current.id === goalId) {
      return { path: reconstruct(prev, startId, goalId), expanded };
    }
    for (const { next } of neighbors(adjacency, current.id, goalId, mapData.nodeMap)) {
      if (seen.has(next)) continue;
      seen.add(next);
      prev.set(next, current.id);
      queue.push({ id: next, h: heuristic(next, goalId) });
    }
  }
  return { path: [], expanded };
}

// Generate a feasible simple path without invoking any optimal search algorithm.
// Randomized DFS backtracking is only a candidate representation/operator for ABC.
function randomFeasiblePath(startId, goalId, adjacency, nodeMap, random, blocked, budget) {
  if (blocked.has(startId)) return null;
  const visited = new Set(blocked);
  visited.add(startId);
  const stack = [{ id: startId, choices: null, index: 0 }];
  let expanded = 0;
  while (stack.length && expanded < budget) {
    const frame = stack[stack.length - 1];
    if (frame.id === goalId) return stack.map(entry => entry.id);
    if (frame.choices === null) {
      expanded += 1;
      const choices = neighbors(adjacency, frame.id, goalId, nodeMap)
        .filter(entry => !visited.has(entry.next));
      // Stochastic neighbor order makes alternative valid paths discoverable.
      for (let i = choices.length - 1; i > 0; i -= 1) {
        const j = Math.floor(random() * (i + 1));
        [choices[i], choices[j]] = [choices[j], choices[i]];
      }
      frame.choices = choices;
    }
    if (frame.index >= frame.choices.length) {
      visited.delete(frame.id);
      stack.pop();
      continue;
    }
    const next = frame.choices[frame.index++].next;
    if (visited.has(next)) continue;
    visited.add(next);
    stack.push({ id: next, choices: null, index: 0 });
  }
  return null;
}

function artificialBeeColony(startId, goalId, mapData, config, random) {
  const adjacency = adjacencyFor(mapData);
  const nodeMap = mapData.nodeMap;
  const budget = Math.max(500, mapData.nodes.length * 40);
  const count = config.abcSources;
  let evaluations = 0;
  const makeNew = () => {
    const route = randomFeasiblePath(
      startId, goalId, adjacency, nodeMap, random, new Set(), budget
    );
    if (!route) return null;
    evaluations += 1;
    return { path: route, cost: pathCost(route, mapData, adjacency), trials: 0 };
  };
  const food = [];
  for (let i = 0; i < count; i += 1) {
    const source = makeNew();
    if (source) food.push(source);
  }
  if (!food.length) return { path: [], evaluations };
  let best = food.reduce((a, b) => a.cost <= b.cost ? a : b);
  best = { ...best };

  function explore(index) {
    const current = food[index];
    if (current.path.length < 2) return;
    const cut = Math.floor(random() * (current.path.length - 1));
    const prefix = current.path.slice(0, cut + 1);
    const blocked = new Set(prefix.slice(0, -1));
    const suffix = randomFeasiblePath(
      prefix[prefix.length - 1], goalId, adjacency, nodeMap, random, blocked, budget
    );
    if (!suffix) {
      current.trials += 1;
      return;
    }
    const candidate = prefix.slice(0, -1).concat(suffix);
    const score = pathCost(candidate, mapData, adjacency);
    evaluations += 1;
    if (score < current.cost) {
      food[index] = { path: candidate, cost: score, trials: 0 };
      if (score < best.cost) best = { ...food[index] };
    } else {
      current.trials += 1;
    }
  }

  function chooseFoodSource() {
    const fitness = food.map(item => 1 / (item.cost + 1));
    const total = fitness.reduce((a, b) => a + b, 0);
    let selection = random() * total;
    for (let i = 0; i < fitness.length; i += 1) {
      selection -= fitness[i];
      if (selection <= 0) return i;
    }
    return fitness.length - 1;
  }

  for (let cycle = 0; cycle < config.abcCycles; cycle += 1) {
    // Employed bees: local suffix-reconnection of each feasible route.
    for (let i = 0; i < food.length; i += 1) explore(i);
    // Onlooker bees: probabilistic selection by inverse route cost.
    for (let i = 0; i < food.length; i += 1) explore(chooseFoodSource());
    // Scout bees: abandon stagnant routes and discover new feasible routes.
    for (let i = 0; i < food.length; i += 1) {
      if (food[i].trials < config.abcLimit) continue;
      const replacement = makeNew();
      if (replacement) {
        food[i] = replacement;
        if (replacement.cost < best.cost) best = { ...replacement };
      } else {
        food[i].trials = 0;
      }
    }
  }
  return { path: best.path, evaluations };
}

function getPairs(mapData, count, seed) {
  const cases = [
    ['room_111', 'room_109'],
    ['room_230', 'room_211'],
    ['room_124', 'room_211'],
    ['room_126', 'room_106'],
    ['room_224', 'room_217'],
    ['room_106', 'room_230'],
    ['room_124', 'room_120'],
    ['room_211', 'room_213'],
    ['room_115', 'room_217'],
    ['room_108', 'room_125'],
    ['room_229', 'room_212'],
    ['room_113', 'room_223'],
  ];
  const valid = cases.filter(([a, b]) => mapData.nodeMap[a] && mapData.nodeMap[b]);
  const known = new Set(valid.map(pair => pair.join('|')));
  const rooms = mapData.nodes.filter(node => node.type === 'room')
    .map(node => node.id).sort();
  const random = rngFromSeed(seed);
  let attempts = 0;
  while (valid.length < count && attempts < count * 40) {
    attempts += 1;
    const a = rooms[Math.floor(random() * rooms.length)];
    const b = rooms[Math.floor(random() * rooms.length)];
    if (a === b || known.has(a + '|' + b)) continue;
    known.add(a + '|' + b);
    valid.push([a, b]);
  }
  if (valid.length < count) throw new Error('Not enough distinct room pairs.');
  return valid.slice(0, count).map((pair, index) => ({
    id: 'Q' + String(index + 1).padStart(2, '0'),
    from: pair[0], to: pair[1],
    group: mapData.nodeMap[pair[0]].floor === mapData.nodeMap[pair[1]].floor
      ? 'same_floor' : 'cross_floor',
  }));
}

function mean(values) {
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
}
function percentile(values, p) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.ceil(p * sorted.length) - 1)];
}
function round(value, digits = 5) {
  return Number.isFinite(value) ? Number(value.toFixed(digits)) : '';
}
function csvValue(value) {
  const str = value === null || value === undefined ? '' : String(value);
  return /[,"\n]/.test(str) ? '"' + str.replace(/"/g, '""') + '"' : str;
}
function csvText(records, columns) {
  return [
    columns.map(csvValue).join(','),
    ...records.map(record => columns.map(column => csvValue(record[column])).join(',')),
  ].join('\n') + '\n';
}

function main() {
  const config = optionsFromArgs(process.argv.slice(2));
  const mapData = readMap();
  const rawAdjacency = adjacencyFor(mapData);
  const scenarios = getPairs(mapData, config.pairs, config.seed);
  const algorithms = {
    'A*': (a, b) => ({ path: findAStarPath(a, b, mapData) }),
    Dijkstra: (a, b) => dijkstra(a, b, mapData),
    Greedy: (a, b) => greedyBestFirst(a, b, mapData),
    ABC: (a, b, random) => artificialBeeColony(a, b, mapData, config, random),
  };
  const names = Object.keys(algorithms);
  const records = [];
  let invalid = 0;

  for (const scenario of scenarios) {
    const reference = dijkstra(scenario.from, scenario.to, mapData);
    const optimum = pathCost(reference.path, mapData, rawAdjacency);
    // Warm-up runs are not recorded.
    for (const name of names) {
      algorithms[name](scenario.from, scenario.to, rngFromSeed(config.seed));
    }
    for (let run = 1; run <= config.runs; run += 1) {
      const order = names.slice(run % names.length).concat(names.slice(0, run % names.length));
      for (const name of order) {
        const runSeed = (config.seed + run * 100003 +
          Number(scenario.id.slice(1)) * 1009) >>> 0;
        const random = rngFromSeed(runSeed);
        const started = performance.now();
        const result = algorithms[name](scenario.from, scenario.to, random);
        const duration = performance.now() - started;
        const route = result.path || [];
        const score = pathCost(route, mapData, rawAdjacency);
        const success = route.length > 0 && Number.isFinite(score) &&
          route[0] === scenario.from && route[route.length - 1] === scenario.to;
        if (route.length && !success) invalid += 1;
        const gap = success && Number.isFinite(optimum) && optimum > 0
          ? 100 * (score - optimum) / optimum : null;
        records.push({
          scenario: scenario.id, group: scenario.group,
          from: scenario.from, to: scenario.to, run, seed: runSeed,
          algorithm: name, success: success ? 1 : 0,
          cost: success ? round(score) : '',
          dijkstra_optimum: Number.isFinite(optimum) ? round(optimum) : '',
          gap_percent: round(gap),
          elapsed_ms: round(duration),
          expanded_nodes: result.expanded ?? '',
          abc_evaluations: result.evaluations ?? '',
          path: success ? route.join('>') : '',
        });
      }
    }
  }

  const summary = names.map(name => {
    const rows = records.filter(record => record.algorithm === name);
    const successful = rows.filter(row => row.success === 1);
    const gaps = successful.map(row => row.gap_percent).filter(Number.isFinite);
    const costs = successful.map(row => row.cost).filter(Number.isFinite);
    const times = rows.map(row => row.elapsed_ms);
    return {
      algorithm: name, trials: rows.length,
      successes: successful.length,
      success_percent: round(100 * successful.length / rows.length, 2),
      mean_ms: round(mean(times)),
      median_ms: round(percentile(times, 0.5)),
      p95_ms: round(percentile(times, 0.95)),
      mean_cost: round(mean(costs)),
      mean_gap_percent: round(mean(gaps)),
      optimal_percent: round(100 * successful.filter(row =>
        Math.abs(row.cost - row.dijkstra_optimum) <= 1e-6
      ).length / rows.length, 2),
      mean_expanded: round(mean(rows.map(row => row.expanded_nodes)
        .filter(Number.isFinite))),
      mean_abc_evaluations: round(mean(rows.map(row => row.abc_evaluations)
        .filter(Number.isFinite))),
    };
  });

  fs.mkdirSync(config.output, { recursive: true });
  fs.writeFileSync(path.join(config.output, 'runs.csv'),
    csvText(records, [
      'scenario', 'group', 'from', 'to', 'run', 'seed', 'algorithm',
      'success', 'cost', 'dijkstra_optimum', 'gap_percent', 'elapsed_ms',
      'expanded_nodes', 'abc_evaluations', 'path',
    ]));
  fs.writeFileSync(path.join(config.output, 'summary.csv'),
    csvText(summary, [
      'algorithm', 'trials', 'successes', 'success_percent', 'mean_ms',
      'median_ms', 'p95_ms', 'mean_cost', 'mean_gap_percent',
      'optimal_percent', 'mean_expanded', 'mean_abc_evaluations',
    ]));
  fs.writeFileSync(path.join(config.output, 'scenarios.json'),
    JSON.stringify({
      generated_at: new Date().toISOString(),
      runtime: { node: process.version, platform: process.platform,
        arch: process.arch, cpu: os.cpus()[0]?.model },
      input: ['assets/data/indoorgml/lc2.gml', 'assets/data/buildings/lc2.doors.json'],
      config, nodes: mapData.nodes.length, edges: mapData.edges.length,
      scenarios,
    }, null, 2) + '\n');

  const table = summary.map(row =>
    '| ' + row.algorithm + ' | ' + row.success_percent + '% | ' +
    row.mean_ms + ' | ' + row.p95_ms + ' | ' + row.mean_gap_percent +
    '% | ' + row.optimal_percent + '% |'
  ).join('\n');
  const report = [
    '# LC2 wheelchair-routing algorithm benchmark',
    '',
    'Generated: ' + new Date().toISOString(),
    '',
    '## Summary',
    '| Algorithm | Success rate | Mean time (ms) | p95 (ms) | Mean optimality gap | Optimal answers |',
    '|---|---:|---:|---:|---:|---:|',
    table,
    '',
    '## Experimental method',
    '- The graph combines the LC2 IndoorGML map and its doorway survey via the project parser and adapter.',
    '- Identical wheelchair eligibility and directed transition costs come from the production pathfinder getEdgeCost().',
    '- A* is the preserved baseline findAStarPath(); the live app now uses Resource-Constrained A* with COP constraints. Dijkstra is the optimal-cost reference for nonnegative weights.',
    '- Greedy means Greedy Best-First Search using the production heuristic (not Greedy Nearest Neighbor).',
    '- ABC is a stochastic, fixed-budget Artificial Bee Colony **route-search adaptation** with employed/onlooker/scout phases and randomized feasible-path repair; it does not call Dijkstra/A* internally.',
    '- All algorithms are warmed up; timed runs include their per-query graph/heuristic preparation.',
    '- Dijkstra optimum is computed separately outside timed runs. A* is not assumed optimal; deviations are reported.',
    '- Costs are **abstract routing weights**, not meters or guaranteed travel time.',
    '- Failures count against success and optimal-answer rates; gap averages cover successful paths only.',
    '- Performance depends on CPU, Node version, JIT and ABC budget. Repeat with more routes and independent seeds.',
    '',
    '## Configuration',
    'Node: ' + process.version + '; platform: ' + process.platform + '; CPU: ' + os.cpus()[0]?.model,
    'Pairs: ' + config.pairs + '; runs/pair: ' + config.runs + '; seed: ' + config.seed,
    'ABC food sources: ' + config.abcSources + '; cycles: ' +
      config.abcCycles + '; scout limit: ' + config.abcLimit,
    'Graph: ' + mapData.nodes.length + ' nodes, ' + mapData.edges.length + ' edges.',
    '',
    'Raw data: runs.csv; aggregated statistics: summary.csv; setup and scenarios: scenarios.json.',
    '',
  ].join('\n');
  fs.writeFileSync(path.join(config.output, 'report.md'), report);
  console.log('\n' + report);
  console.log('Output: ' + config.output);
  if (invalid > 0) {
    console.error('Invalid returned paths: ' + invalid);
    process.exitCode = 1;
  }
}

try {
  main();
} catch (error) {
  console.error(error.stack || error.message);
  process.exitCode = 1;
}
