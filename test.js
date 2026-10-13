const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const floor1Data = require('./assets/data/buildings/lc2.json');
const legacyData = require('./assets/data/buildings/lc2.legacy.json');
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

const floor1Ids = new Set(
  floor1Data.spaces.filter(space => space.floorId === 'floor_1').map(space => space.id)
);
const floor2Ids = new Set(
  legacyData.spaces.filter(space => space.floorId === 'floor_2').map(space => space.id)
);

const mergedLegacy = {
  ...floor1Data,
  floors: [
    ...floor1Data.floors.filter(floor => floor.id === 'floor_1'),
    ...legacyData.floors.filter(floor => floor.id === 'floor_2'),
  ],
  spaces: [
    ...floor1Data.spaces.filter(space => space.floorId === 'floor_1'),
    ...legacyData.spaces.filter(space => space.floorId === 'floor_2'),
  ],
  connections: [
    ...floor1Data.connections.filter(
      connection => floor1Ids.has(connection.from) || floor1Ids.has(connection.to)
    ),
    ...legacyData.connections.filter(
      connection => floor2Ids.has(connection.from) && floor2Ids.has(connection.to)
    ),
  ],
};

const buildingData = migrateBuildingV1ToV2(mergedLegacy, siteGeoJSON, {
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

const unitById = Object.fromEntries(buildingData.units.map(unit => [unit.id, unit]));
const stateById = Object.fromEntries(
  buildingData.routing.states.map(state => [state.id, state])
);

assert.strictEqual(
  buildingData.routing.states.length,
  buildingData.units.length,
  'Each mapped unit should have a routing state'
);
assert.ok(
  buildingData.routing.states.every(state => unitById[state.unitId]),
  'Every routing state should reference a valid unit'
);
assert.ok(
  buildingData.routing.transitions.every(
    transition => stateById[transition.from] && stateById[transition.to]
  ),
  'Every transition should connect valid routing states'
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

assert.strictEqual(floor1Data.floors[0].map.width, 1080);
assert.strictEqual(floor1Data.floors[0].map.height, 395);
assert.deepStrictEqual(floor1Data.floors[0].map.boundary, [
  [33, 249], [390, 249], [390, 223], [690, 223], [690, 246],
  [946, 246], [946, 42], [1058, 42], [1058, 349], [690, 349],
  [690, 377], [389, 377], [389, 354], [33, 354],
]);

const roomByCode = code =>
  mapData.nodes.find(node => node.type === 'room' && node.code === code);

const room124 = roomByCode('124');
const room120 = roomByCode('120');
const room109 = roomByCode('109');
const room106 = roomByCode('106');
const room211 = roomByCode('211');
const room230 = roomByCode('230');
const room2241 = roomByCode('224/1');

assert.ok(
  room124 && room120 && room109 && room106 && room211 && room230 && room2241,
  'Expected reference rooms to exist'
);

const floorOneRoomCodes = buildingData.units
  .filter(unit => unit.type === 'room' && unit.levelId === 'floor_1')
  .map(unit => unit.code)
  .sort();
const floorTwoRoomCodes = buildingData.units
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

const routeDestinations = mapData.nodes.filter(
  node => node.type === 'room' || node.type === 'restroom'
);

for (const start of routeDestinations) {
  for (const goal of routeDestinations) {
    const path = findPath(start.id, goal.id, mapData);
    assert.ok(
      path.length > 0,
      `Expected a wheelchair route from ${start.id} to ${goal.id}`
    );
    assert.strictEqual(path[0], start.id);
    assert.strictEqual(path[path.length - 1], goal.id);
    assert.ok(
      path.every(id => mapData.nodeMap[id].type !== 'stairs'),
      'Wheelchair routes must avoid stairs'
    );
  }
}

sameValues(
  findPath(room124.id, room124.id, mapData),
  [room124.id],
  'Same-room path should contain one room'
);

const sameFloor = findPath(room124.id, room120.id, mapData);
assert.strictEqual(sameFloor[0], room124.id);
assert.strictEqual(sameFloor[sameFloor.length - 1], room120.id);

const routeAlternatives = findAllPaths(room124.id, room109.id, mapData);
assert.ok(routeAlternatives.length >= 2, 'Expected upper/lower Floor 1 alternatives');
assert.ok(
  routeAlternatives.some(path => path.includes('corridor_f1_l06')),
  'At least one route should use the lower central corridor'
);
assert.ok(
  routeAlternatives.some(path => !path.includes('corridor_f1_l06')),
  'At least one route should use the upper corridor'
);
assert.ok(
  routeAlternatives.every(path =>
    path.every(id => mapData.nodeMap[id].type !== 'stairs')
  ),
  'All alternatives must remain wheelchair accessible'
);

const verticalWingRoute = findPath(room124.id, room106.id, mapData);
assert.strictEqual(verticalWingRoute[0], room124.id);
assert.strictEqual(verticalWingRoute[verticalWingRoute.length - 1], room106.id);
assert.ok(
  verticalWingRoute.some(id => id === 'corridor_f1_v04'),
  'Room 106 should be reached through the vertical east wing'
);

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
blockedMap.nodeMap = Object.fromEntries(
  blockedMap.nodes.map(node => [node.id, node])
);

const room124Edges = blockedMap.edges.filter(
  edge => edge.from === room124.id || edge.to === room124.id
);
assert.ok(room124Edges.length > 0, 'Expected room 124 to have route connections');
for (const edge of room124Edges) {
  edge.width = 0.5;
}
assert.strictEqual(
  findPath(room124.id, room120.id, blockedMap).length,
  0,
  'A room with all exits narrower than 0.9 m should be unreachable'
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
assert.strictEqual(
  findPath(room124.id, room211.id, brokenTransitionMap).length,
  0,
  'Cross-floor routing must fail when the elevator transition is removed'
);

console.log('New LC2 Floor 1 layout, schema v2, and wheelchair routing tests passed.');
