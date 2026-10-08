const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const buildingData = require('./assets/data/buildings/lc2.json');

function loadNamedExport(source, exportName) {
  const sandbox = {};
  vm.createContext(sandbox);

  const body = source.replace(/export\s+function\s+/g, 'function ');

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

const findAllPaths = loadNamedExport(
  fs.readFileSync('./src/logic/pathfinder.js', 'utf8'),
  'findAllPaths'
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
const room230 = roomByCode('230');
const room2241 = roomByCode('224/1');

assert.ok(room124 && room120 && room211 && room230 && room2241, 'Expected reference rooms to exist');

const floorOneRoomCodes = buildingData.spaces
  .filter(space => space.type === 'room' && space.floorId === 'floor_1')
  .map(space => space.code)
  .sort();
const floorTwoRoomCodes = buildingData.spaces
  .filter(space => space.type === 'room' && space.floorId === 'floor_2')
  .map(space => space.code)
  .sort();
assert.deepStrictEqual(floorOneRoomCodes, [
  '106', '107', '108', '109', '110', '111', '112', '113', '114',
  '115', '115/1', '116', '119', '120', '121', '122', '123', '124', '125', '126'
].sort());
assert.deepStrictEqual(floorTwoRoomCodes, [
  '211', '212', '213', '214', '215', '216', '217', '218', '219', '220',
  '221', '222', '223', '224', '224/1', '225', '226', '227', '228', '229', '230'
].sort());

for (const space of buildingData.spaces.filter(item => item.type === 'room')) {
  const floor = buildingData.floors.find(item => item.id === space.floorId);
  const geometry = space.geometry;
  assert.ok(geometry.x >= 0 && geometry.y >= 0);
  assert.ok(geometry.x + geometry.width <= floor.map.width);
  assert.ok(geometry.y + geometry.height <= floor.map.height);
  const normalized = mapData.nodeMap[space.id];
  assert.strictEqual(normalized.x, geometry.x + geometry.width / 2);
  assert.strictEqual(normalized.y, geometry.y + geometry.height / 2);
}

const stairs = mapData.nodes.filter(node => node.type === 'stairs');
assert.ok(stairs.length >= 2);
assert.ok(stairs.every(stair => !mapData.edges.some(edge => edge.from === stair.id || edge.to === stair.id)),
  'Stairs must remain outside the wheelchair route graph');

const entrance = mapData.nodes.find(node => node.type === 'entrance');

const routeDestinations = mapData.nodes.filter(
  node => node.type === 'room' || node.type === 'restroom'
);
for (const start of routeDestinations) {
  for (const goal of routeDestinations) {
    const options = findAllPaths(start.id, goal.id, mapData);
    assert.ok(
      options.length > 0,
      'Every room and restroom should be reachable from every other destination'
    );
    assert.ok(
      options.every(
        path =>
          path[0] === start.id &&
          path[path.length - 1] === goal.id &&
          path.every(id => mapData.nodeMap[id].type !== 'stairs')
      ),
      'Every route option should use the requested endpoints and avoid stairs'
    );
  }
}

for (const destination of mapData.nodes.filter(
  node => node.type === 'room' || node.type === 'restroom'
)) {
  const accessibleRoute = findPath(entrance.id, destination.id, mapData);
  const accessibleRoutes = findAllPaths(
    entrance.id,
    destination.id,
    mapData
  );
  assert.ok(
    accessibleRoutes.length >= 2,
    'Each LC2 destination should have route alternatives'
  );
  assert.strictEqual(
    new Set(accessibleRoutes.map(path => path.join('->'))).size,
    accessibleRoutes.length,
    'Alternative routes should be unique'
  );
  assert.ok(
    accessibleRoutes.every(
      path =>
        path[0] === entrance.id &&
        path[path.length - 1] === destination.id &&
        path.every(id => mapData.nodeMap[id].type !== 'stairs')
    ),
    'Every route option must reach its destination without using stairs'
  );
  assert.strictEqual(accessibleRoute[0], entrance.id);
  assert.strictEqual(accessibleRoute[accessibleRoute.length - 1], destination.id);
  assert.ok(
    accessibleRoute.every(id => mapData.nodeMap[id].type !== 'stairs'),
    'Accessible routes must not pass through stairs'
  );
}

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

const lowerFloorRoute = findPath(room230.id, room2241.id, mapData);
assert.strictEqual(lowerFloorRoute[0], room230.id);
assert.strictEqual(lowerFloorRoute[lowerFloorRoute.length - 1], room2241.id);

const restroomRoute = findPath(room124.id, 'restroom_f1_south', mapData);
assert.strictEqual(restroomRoute[0], room124.id);
assert.strictEqual(restroomRoute[restroomRoute.length - 1], 'restroom_f1_south');
assert.ok(
  [...sameFloor, ...crossFloor, ...lowerFloorRoute, ...restroomRoute]
    .every(id => mapData.nodeMap[id].type !== 'stairs'),
  'Wheelchair routes must not include stairs'
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
