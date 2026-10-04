const assert = require('assert');
const mapData = require('./assets/data/map.json');

mapData.nodeMap = {};
mapData.nodes.forEach(n => {
  mapData.nodeMap[n.id] = n;
});

function findPath(startId, goalId, mapData) {
  const { nodes, edges, nodeMap } = mapData;

  if (!nodeMap[startId] || !nodeMap[goalId]) return [];
  if (startId === goalId) return [startId];

  function edgeCost(edge, fromId, toId) {
    let cost = Number.isFinite(edge.weight) ? edge.weight : 1;
    const from = nodeMap[fromId];
    const to = nodeMap[toId];
    if (!from || !to) return Infinity;

    const width = Number(edge.width);
    const slope = Number(edge.slope);
    if (Number.isFinite(width) && width < 0.9) return Infinity;
    if (Number.isFinite(slope)) {
      if (slope >= 5.0) return Infinity;
      if (slope >= 3.0) cost += 50;
    }

    const doorWidth = Number(to.door_width);
    const threshold = Number(to.threshold);
    if (Number.isFinite(doorWidth) && doorWidth < 0.9) return Infinity;
    if (Number.isFinite(threshold)) {
      if (threshold >= 0.02) cost += 200;
      else if (threshold >= 0.01) cost += 50;
    }

    if (from.floor !== to.floor) {
      const validElevator =
        edge.transition === 'elevator' &&
        from.type === 'lift' &&
        to.type === 'lift';

      if (!validElevator) return Infinity;
      cost += 10;
    }

    return cost;
  }

  const dist = {};
  const prev = {};
  const unvisited = new Set(nodes.map(n => n.id));
  nodes.forEach(n => { dist[n.id] = Infinity; });
  dist[startId] = 0;

  while (unvisited.size) {
    let current = null;
    let best = Infinity;

    for (const id of unvisited) {
      if (dist[id] < best) {
        best = dist[id];
        current = id;
      }
    }

    if (current === null) break;
    unvisited.delete(current);
    if (current === goalId) break;

    for (const edge of edges) {
      const next = edge.from === current
        ? edge.to
        : edge.to === current
          ? edge.from
          : null;

      if (!next || !unvisited.has(next)) continue;

      const cost = edgeCost(edge, current, next);
      if (!Number.isFinite(cost)) continue;

      const candidate = dist[current] + cost;
      if (candidate < dist[next]) {
        dist[next] = candidate;
        prev[next] = current;
      }
    }
  }

  if (!Number.isFinite(dist[goalId])) return [];

  const path = [];
  for (let n = goalId; n !== undefined; n = prev[n]) {
    path.unshift(n);
    if (n === startId) break;
  }

  return path[0] === startId ? path : [];
}

function assertRoute(startId, goalId, route) {
  assert.ok(route.length >= 1, 'Expected route ' + startId + ' -> ' + goalId);
  assert.strictEqual(route[0], startId);
  assert.strictEqual(route[route.length - 1], goalId);
}

assert.deepStrictEqual(findPath('124', '124', mapData), ['124']);

const sameFloor = findPath('124', '120', mapData);
assertRoute('124', '120', sameFloor);

const crossFloor = findPath('124', '211', mapData);
assertRoute('124', '211', crossFloor);
assert.ok(crossFloor.includes('elevator_1'));
assert.ok(crossFloor.includes('elevator_2'));

assert.deepStrictEqual(
  findPath('does-not-exist', '124', mapData),
  []
);

console.log('Routing tests passed.');
