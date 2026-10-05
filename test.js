const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const buildingData = require('./assets/data/buildings/lc2.json');

function loadNamedExport(source, exportName) {
  const sandbox = {};
  vm.createContext(sandbox);

  const body = source.replace(
    new RegExp('export\\s+function\\s+' + exportName),
    'function ' + exportName
  );

  vm.runInContext(
    body + '\nthis.' + exportName + ' = ' + exportName + ';',
    sandbox
  );

  return sandbox[exportName];
}

const normalizeBuildingData = loadNamedExport(
  fs.readFileSync('./assets/data/buildingAdapter.js', 'utf8'),
  'normalizeBuildingData'
);

const validateBuildingData = loadNamedExport(
  fs.readFileSync('./assets/data/mapValidator.js', 'utf8'),
  'validateBuildingData'
);

const findPath = loadNamedExport(
  fs.readFileSync('./src/logic/pathfinder.js', 'utf8'),
  'findPath'
);

assert.deepStrictEqual(
  validateBuildingData(buildingData),
  [],
  'Building schema should validate'
);

const mapData = normalizeBuildingData(buildingData);

const roomByCode = code =>
  mapData.nodes.find(node => node.type === 'room' && node.code === code);

const room124 = roomByCode('124');
const room120 = roomByCode('120');
const room211 = roomByCode('211');

assert.ok(room124 && room120 && room211, 'Expected sample rooms to exist');

assert.deepStrictEqual(
  findPath(room124.id, room124.id, mapData),
  [room124.id]
);

const sameFloor = findPath(room124.id, room120.id, mapData);
assert.strictEqual(sameFloor[0], room124.id);
assert.strictEqual(sameFloor[sameFloor.length - 1], room120.id);

const crossFloor = findPath(room124.id, room211.id, mapData);
assert.strictEqual(crossFloor[0], room124.id);
assert.strictEqual(crossFloor[crossFloor.length - 1], room211.id);
assert.ok(
  crossFloor.some(id => mapData.nodeMap[id].type === 'elevator'),
  'Cross-floor route should use an elevator'
);

assert.deepStrictEqual(
  findPath('does-not-exist', room124.id, mapData),
  []
);

const blockedMap = JSON.parse(JSON.stringify(mapData));
blockedMap.nodeMap = Object.fromEntries(
  blockedMap.nodes.map(node => [node.id, node])
);

const firstConnection = blockedMap.edges.find(edge => {
  const otherId =
    edge.from === room124.id
      ? edge.to
      : edge.to === room124.id
        ? edge.from
        : null;

  return otherId && blockedMap.nodeMap[otherId]?.type === 'corridor';
});

assert.ok(firstConnection, 'Expected room 124 to connect to a corridor');
firstConnection.width = 0.5;

assert.deepStrictEqual(
  findPath(room124.id, room120.id, blockedMap),
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
  findPath(room124.id, room211.id, brokenTransitionMap),
  []
);

assert.ok(
  buildingData.spaces.every(space => space.floorId && space.geometry),
  'Every space should declare floor and geometry'
);

assert.ok(
  buildingData.connections.every(
    connection =>
      connection.routing &&
      Number.isFinite(connection.routing.cost)
  ),
  'Every connection should declare a numeric routing cost'
);

assert.ok(
  buildingData.connections
    .filter(connection => {
      const from = buildingData.spaces.find(
        space => space.id === connection.from
      );
      const to = buildingData.spaces.find(
        space => space.id === connection.to
      );
      return from && to && from.floorId !== to.floorId;
    })
    .every(connection => connection.transition?.type),
  'Every cross-floor connection should declare a transition'
);

console.log('Generic building schema and routing tests passed.');
