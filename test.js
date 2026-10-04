const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const mapData = require('./assets/data/map.json');
mapData.nodeMap = Object.fromEntries(
  mapData.nodes.map(node => [node.id, node])
);

const source = fs
  .readFileSync('./src/logic/pathfinder.js', 'utf8')
  .replace('export default function findPath', 'function findPath');

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(source + '\nthis.findPath = findPath;', sandbox);

const findPath = sandbox.findPath;

function assertRoute(startId, goalId, route) {
  assert.ok(
    route.length >= 1,
    'Expected route ' + startId + ' -> ' + goalId
  );
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

const blockedMap = JSON.parse(JSON.stringify(mapData));
blockedMap.nodeMap = Object.fromEntries(
  blockedMap.nodes.map(node => [node.id, node])
);

blockedMap.edges = blockedMap.edges.map(edge => ({
  ...edge,
  width:
    edge.from === '124' && edge.to === 'hall_1_60'
      ? 0.5
      : edge.width,
}));

assert.deepStrictEqual(
  findPath('124', '120', blockedMap),
  []
);

const brokenTransitionMap = JSON.parse(JSON.stringify(mapData));
brokenTransitionMap.nodeMap = Object.fromEntries(
  brokenTransitionMap.nodes.map(node => [node.id, node])
);

brokenTransitionMap.edges = brokenTransitionMap.edges.map(edge =>
  edge.transition === 'elevator'
    ? { ...edge, transition: undefined }
    : edge
);

assert.deepStrictEqual(
  findPath('124', '211', brokenTransitionMap),
  []
);


assert.ok(
  mapData.nodes.every(node => [
    'room',
    'corridor',
    'lift',
    'entrance',
    'toilet',
  ].includes(node.type)),
  'Every node should have a supported type'
);

assert.ok(
  mapData.edges.every(edge => Number.isFinite(edge.weight)),
  'Every edge should have a numeric weight'
);

assert.ok(
  mapData.edges
    .filter(edge => mapData.nodeMap[edge.from].floor !== mapData.nodeMap[edge.to].floor)
    .every(edge => edge.transition === 'elevator'),
  'Every cross-floor edge should be an elevator transition'
);

console.log('Routing tests passed.');
