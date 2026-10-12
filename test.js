const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const legacyData = require('./assets/data/buildings/lc2.json');
const siteGeoJSON = require('./assets/data/buildings/lc2.site.json');

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

function sameValues(actual, expected, message) {
  assert.strictEqual(
    JSON.stringify(Array.from(actual)),
    JSON.stringify(Array.from(expected)),
    message
  );
}

const migrateBuildingV1ToV2 = loadNamedExport(
  fs.readFileSync('./assets/data/schemaV2.js', 'utf8'),
  'migrateBuildingV1ToV2'
);

const validateBuildingData = loadNamedExport(
  fs.readFileSync('./assets/data/mapValidator.js', 'utf8'),
  'validateBuildingData'
);

const normalizeBuildingData = loadNamedExport(
  fs.readFileSync('./assets/data/buildingAdapter.js', 'utf8'),
  'normalizeBuildingData'
);

const findPath = loadNamedExport(
  fs.readFileSync('./src/logic/pathfinder.js', 'utf8'),
  'findPath'
);

const findAllPaths = loadNamedExport(
  fs.readFileSync('./src/logic/pathfinder.js', 'utf8'),
  'findAllPaths'
);

const buildingData = migrateBuildingV1ToV2(legacyData, siteGeoJSON, {
  siteId: 'tu_rangsit',
  siteName: 'Thammasat University Rangsit Campus',
  displayName: 'อาคารบรรยายเรียนรวม 2',
});

assert.strictEqual(buildingData.schemaVersion, '2.0');
assert.strictEqual(buildingData.site.id, 'tu_rangsit');
assert.strictEqual(buildingData.facility.id, 'lc2');
assert.strictEqual(buildingData.facility.siteId, buildingData.site.id);
assert.strictEqual(buildingData.facility.geometry.type, 'Polygon');
assert.ok(Array.isArray(buildingData.levels));
assert.ok(Array.isArray(buildingData.units));
assert.ok(Array.isArray(buildingData.openings));
assert.ok(Array.isArray(buildingData.details));
assert.ok(Array.isArray(buildingData.pois));
assert.ok(Array.isArray(buildingData.routing.states));
assert.ok(Array.isArray(buildingData.routing.transitions));

const validationErrors = Array.from(validateBuildingData(buildingData));
assert.strictEqual(
  validationErrors.length,
  0,
  'Schema v2 building data should validate: ' + validationErrors.join('; ')
);

assert.strictEqual(
  buildingData.routing.states.length,
  buildingData.units.length,
  'Each mapped unit should have a routing state'
);

const stateById = Object.fromEntries(
  buildingData.routing.states.map(state => [state.id, state])
);
assert.ok(
  buildingData.routing.transitions.every(
    transition => stateById[transition.from] && stateById[transition.to]
  ),
  'Every transition should connect valid routing states'
);

assert.ok(
  buildingData.openings.every(opening => opening.connects.length === 2),
  'Every opening should connect two units'
);

const mapData = normalizeBuildingData(buildingData);

assert.strictEqual(mapData.buildingId, 'lc2');
assert.strictEqual(mapData.floors.length, 2);
assert.strictEqual(
  mapData.floors.find(floor => floor.level === 1).map.boundarySource,
  'facility.geojson'
);
assert.notStrictEqual(
  mapData.floors.find(floor => floor.level === 2).map.boundarySource,
  'facility.geojson',
  'The supplied geographic footprint applies only to Floor 1'
);

const roomByCode = code =>
  mapData.nodes.find(node => node.type === 'room' && node.code === code);

const room124 = roomByCode('124');
const room120 = roomByCode('120');
const room211 = roomByCode('211');
const room230 = roomByCode('230');
const room2241 = roomByCode('224/1');

assert.ok(
  room124 && room120 && room211 && room230 && room2241,
  'Expected reference rooms to exist'
);

const floorOneRoomCodes = Array.from(buildingData.units)
  .filter(unit => unit.type === 'room' && unit.levelId === 'floor_1')
  .map(unit => unit.code)
  .sort();
const floorTwoRoomCodes = Array.from(buildingData.units)
  .filter(unit => unit.type === 'room' && unit.levelId === 'floor_2')
  .map(unit => unit.code)
  .sort();

sameValues(floorOneRoomCodes, [
  '106', '107', '108', '109', '110', '111', '112', '113', '114',
  '115', '115/1', '116', '119', '120', '121', '122', '123', '124', '125', '126'
].sort(), 'Floor 1 room codes should be preserved');

sameValues(floorTwoRoomCodes, [
  '211', '212', '213', '214', '215', '216', '217', '218', '219', '220',
  '221', '222', '223', '224', '224/1', '225', '226', '227', '228', '229', '230'
].sort(), 'Floor 2 room codes should be preserved');

const stairs = mapData.nodes.filter(node => node.type === 'stairs');
assert.ok(stairs.length >= 2);
assert.ok(
  stairs.every(
    stair => !mapData.edges.some(edge => edge.from === stair.id || edge.to === stair.id)
  ),
  'Stairs must remain outside the wheelchair route graph'
);

const entrance = mapData.nodes.find(node => node.type === 'entrance');
assert.ok(entrance, 'Expected an entrance routing unit');

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
      'Every route option should avoid stairs'
    );
  }
}

for (const destination of routeDestinations) {
  const accessibleRoute = findPath(entrance.id, destination.id, mapData);
  const accessibleRoutes = findAllPaths(entrance.id, destination.id, mapData);

  assert.ok(accessibleRoutes.length >= 2, 'Each LC2 destination should have route alternatives');
  assert.strictEqual(
    new Set(accessibleRoutes.map(path => path.join('->'))).size,
    accessibleRoutes.length,
    'Alternative routes should be unique'
  );
  assert.strictEqual(accessibleRoute[0], entrance.id);
  assert.strictEqual(accessibleRoute[accessibleRoute.length - 1], destination.id);
  assert.ok(
    accessibleRoute.every(id => mapData.nodeMap[id].type !== 'stairs'),
    'Accessible route must not use stairs'
  );
}

sameValues(
  findPath(room124.id, room124.id, mapData),
  [room124.id],
  'Same-room path should contain one room'
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

const elevatorTransition = buildingData.routing.transitions.find(
  transition => transition.type === 'vertical.elevator'
);
assert.ok(elevatorTransition, 'Schema v2 should contain a vertical elevator transition');
assert.strictEqual(elevatorTransition.accessibility.wheelchairAccessible, true);

const lowerFloorRoute = findPath(room230.id, room2241.id, mapData);
assert.strictEqual(lowerFloorRoute[0], room230.id);
assert.strictEqual(lowerFloorRoute[lowerFloorRoute.length - 1], room2241.id);

const restroomRoute = findPath(room124.id, 'restroom_f1_south', mapData);
assert.strictEqual(restroomRoute[0], room124.id);
assert.strictEqual(restroomRoute[restroomRoute.length - 1], 'restroom_f1_south');

assert.strictEqual(findPath('does-not-exist', room124.id, mapData).length, 0);

const blockedMap = JSON.parse(JSON.stringify(mapData));
blockedMap.nodeMap = Object.fromEntries(blockedMap.nodes.map(node => [node.id, node]));
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
assert.strictEqual(findPath(room124.id, room120.id, blockedMap).length, 0);

const brokenTransitionMap = JSON.parse(JSON.stringify(mapData));
brokenTransitionMap.nodeMap = Object.fromEntries(
  brokenTransitionMap.nodes.map(node => [node.id, node])
);
brokenTransitionMap.edges = brokenTransitionMap.edges.map(edge =>
  edge.transition === 'elevator'
    ? { ...edge, transition: undefined }
    : edge
);
assert.strictEqual(findPath(room124.id, room211.id, brokenTransitionMap).length, 0);

console.log('Generic schema v2 hierarchy, dual graph, and wheelchair routing tests passed.');
