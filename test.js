const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

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
const findAStarPath = loadNamedExport(
  fs.readFileSync('./src/logic/pathfinder.js', 'utf8'),
  'findAStarPath'
);
const solveConstrainedRoute = loadNamedExport(
  fs.readFileSync('./src/logic/pathfinder.js', 'utf8'),
  'solveConstrainedRoute'
);
const getRouteDoorReport = loadNamedExport(
  fs.readFileSync('./src/logic/pathfinder.js', 'utf8'),
  'getRouteDoorReport'
);
const getRoomDoorWarningMessage = loadNamedExport(
  fs.readFileSync('./src/logic/pathfinder.js', 'utf8'),
  'getRoomDoorWarningMessage'
);
const findAllPaths = loadNamedExport(
  fs.readFileSync('./src/logic/pathfinder.js', 'utf8'),
  'findAllPaths'
);
const getRouteSegmentPoints = loadNamedExport(
  fs.readFileSync('./src/rendering/routeGeometry.js', 'utf8'),
  'getRouteSegmentPoints'
);

const parseIndoorGML = loadNamedExport(
  fs.readFileSync('./assets/data/indoorgml/indoorGMLParser.js', 'utf8'),
  'parseIndoorGML'
);
const mergedLegacy = parseIndoorGML(
  fs.readFileSync('./assets/data/indoorgml/lc2.gml', 'utf8')
);
const floor1Data = {
  floors: mergedLegacy.floors.filter(floor => floor.id === 'floor_1'),
};
assert.strictEqual(mergedLegacy.floors.length, 2);

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

assert.strictEqual(floor1Data.floors[0].map.width, 1104);
assert.strictEqual(floor1Data.floors[0].map.height, 395);
assert.deepStrictEqual(JSON.parse(JSON.stringify(floor1Data.floors[0].map.boundary)), [
  [33, 249], [390, 249], [390, 223], [690, 223], [690, 246],
  [946, 246], [946, 42], [1082, 42], [1082, 349], [690, 349],
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
const room224 = roomByCode('224');

assert.ok(
  room124 && room120 && room109 && room106 && room211 && room230 && room224,
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
  '106', '107', '108', '109', '110', '111', '113', '114',
  '115', '116', '119', '120', '121', '122', '123', '124', '125', '126'
].sort(), 'Floor 1 room codes should match the latest reference image');
assert.strictEqual(floorOneRoomCodes.length, 18, 'Floor 1 should contain exactly 18 numbered rooms');
assert.ok(!floorOneRoomCodes.includes('112'), 'Room 112 is not shown in the latest Floor 1 reference');
assert.ok(!floorOneRoomCodes.includes('115/1'), 'Room 115/1 is not shown in the latest Floor 1 reference');

sameValues(floorTwoRoomCodes, [
  '211', '212', '213', '217', '218', '219', '220',
  '221', '222', '223', '224', '225', '226', '227', '228', '229', '230'
].sort(), 'Floor 2 rooms should match the active GML reference');

const floor1Restrooms = mapData.nodes.filter(
  node => node.floor === 1 && node.type === 'restroom'
);
assert.strictEqual(floor1Restrooms.length, 3, 'Floor 1 should contain the three WC areas shown in the reference');

const edgesFor = id =>
  mapData.edges.filter(edge => edge.from === id || edge.to === id);

assert.strictEqual(
  edgesFor('room_126').filter(edge => edge.id.includes('_top') || edge.id.includes('_bottom')).length,
  2,
  'Room 126 should expose both upper and lower corridor access'
);
assert.strictEqual(
  edgesFor('room_125').filter(edge => edge.id.includes('_top')).length,
  1,
  'Room 125 should open to the upper corridor'
);
assert.strictEqual(
  edgesFor('room_124').filter(edge => edge.id.includes('_bottom')).length,
  1,
  'Room 124 should open to the lower corridor'
);
assert.strictEqual(
  edgesFor('room_114').filter(edge => edge.id.includes('_left')).length,
  1,
  'Room 114 should open from its left wall in the latest reference'
);
assert.strictEqual(
  edgesFor('room_106').filter(edge => edge.id.includes('_left')).length,
  1,
  'Room 106 should open to the vertical corridor on its left'
);

const stairs = mapData.nodes.filter(node => node.type === 'stairs');
assert.strictEqual(stairs.length, 1, 'Only the Floor 1 stairs remain in the current map');
assert.ok(
  stairs.every(
    stair => !mapData.edges.some(edge => edge.from === stair.id || edge.to === stair.id)
  ),
  'Stairs must remain outside the wheelchair route graph'
);

const routeDestinations = mapData.nodes.filter(
  node => node.type === 'room' || node.type === 'restroom'
);
// Measured narrow room doors are advisories, not hard routing barriers.
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
  routeAlternatives.some(path => path.includes('corridor_f1_l10')),
  'At least one route should use the lower central corridor'
);
assert.ok(
  routeAlternatives.some(path => !path.includes('corridor_f1_l10')),
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

const lowerFloorRoute = findPath(room230.id, room224.id, mapData);
assert.strictEqual(lowerFloorRoute[0], room230.id);
assert.strictEqual(lowerFloorRoute[lowerFloorRoute.length - 1], room224.id);

const restroomRoute = findPath(room124.id, 'restroom_f1_center', mapData);
assert.strictEqual(restroomRoute[0], room124.id);
assert.strictEqual(restroomRoute[restroomRoute.length - 1], 'restroom_f1_center');

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

// COP is the app's live route solver, not a post-filter for A*.
const appScreenSource = fs.readFileSync('./src/screens/NavigationScreen.js', 'utf8');
assert.ok(
  appScreenSource.includes('solveConstrainedRoute('),
  'Live navigation must call the constraint optimizer directly'
);
sameValues(
  findPath(room124.id, room211.id, mapData),
  solveConstrainedRoute(room124.id, room211.id, mapData).path,
  'findPath must delegate to COP'
);
assert.ok(
  findAStarPath(room124.id, room211.id, mapData).length > 0,
  'Original A* should remain available as a separate benchmark baseline'
);

const copCrossFloor = solveConstrainedRoute(room124.id, room211.id, mapData, {
  maxElevatorTransfers: 1,
});
assert.strictEqual(copCrossFloor.feasible, true);
assert.strictEqual(copCrossFloor.resources.elevatorTransfers, 1);
assert.strictEqual(
  solveConstrainedRoute(room124.id, room211.id, mapData, {
    maxElevatorTransfers: 0,
  }).feasible,
  false,
  'COP must enforce a route-wide elevator transfer limit'
);

const syntheticNodes = ['start', 'steep', 'wide', 'goal'].map(id => ({
  id,
  type: 'corridor',
  floor: 1,
  accessibility: { wheelchairAccessible: true },
}));
const syntheticEdges = [
  { id: 'short_steep', from: 'start', to: 'steep', weight: 1, slope: 3.5 },
  { id: 'steep_goal', from: 'steep', to: 'goal', weight: 1 },
  { id: 'wide_a', from: 'start', to: 'wide', weight: 30 },
  { id: 'wide_goal', from: 'wide', to: 'goal', weight: 30 },
];
const syntheticMap = {
  nodes: syntheticNodes,
  edges: syntheticEdges,
  nodeMap: Object.fromEntries(syntheticNodes.map(node => [node.id, node])),
};
const defaultCop = solveConstrainedRoute('start', 'goal', syntheticMap);
assert.strictEqual(defaultCop.feasible, true);
assert.strictEqual(defaultCop.cost, 52);
sameValues(defaultCop.path, ['start', 'steep', 'goal']);
const noSteepCop = solveConstrainedRoute('start', 'goal', syntheticMap, {
  maxSteepSegments: 0,
});
assert.strictEqual(noSteepCop.feasible, true);
assert.strictEqual(noSteepCop.cost, 60);
sameValues(noSteepCop.path, ['start', 'wide', 'goal']);
assert.strictEqual(
  solveConstrainedRoute('start', 'goal', syntheticMap, {
    maxCost: 51,
  }).feasible,
  false,
  'COP must reject paths that exceed the total route-cost budget'
);
sameValues(
  solveConstrainedRoute('start', 'goal', syntheticMap, {
    blockedNodeIds: ['steep'],
  }).path,
  ['start', 'wide', 'goal'],
  'COP must respect forbidden locations'
);
sameValues(
  solveConstrainedRoute('start', 'goal', syntheticMap, {
    blockedEdgeIds: ['short_steep'],
  }).path,
  ['start', 'wide', 'goal'],
  'COP must respect blocked corridors'
);
assert.strictEqual(
  solveConstrainedRoute('start', 'goal', syntheticMap, {
    requireMeasuredWidths: true,
  }).feasible,
  false,
  'Strict measurement policy must not treat unknown corridor widths as verified'
);

const thresholdNodes = syntheticNodes.map(node =>
  node.id === 'steep' ? { ...node, threshold: 0.015 } : { ...node }
);
const thresholdMap = {
  nodes: thresholdNodes,
  edges: syntheticEdges.map(edge =>
    edge.id.startsWith('wide_') ? { ...edge, weight: 55 } : { ...edge }
  ),
  nodeMap: Object.fromEntries(thresholdNodes.map(node => [node.id, node])),
};
const allowedThreshold = solveConstrainedRoute('start', 'goal', thresholdMap);
assert.strictEqual(allowedThreshold.cost, 102);
const noThreshold = solveConstrainedRoute('start', 'goal', thresholdMap, {
  maxThresholdSegments: 0,
});
assert.strictEqual(noThreshold.cost, 110);
sameValues(noThreshold.path, ['start', 'wide', 'goal']);

// Regression: the screenshot route from Room 109 to 106 must no longer
// turn west before travelling east to the vertical wing.
const room109To106 = solveConstrainedRoute('room_109', 'room_106', mapData, {
  maxElevatorTransfers: 1,
});
assert.strictEqual(room109To106.feasible, true);
sameValues(room109To106.path.slice(0, 2), ['room_109', 'corridor_f1_d109']);
assert.ok(
  !room109To106.path.includes('corridor_f1_u14'),
  'Room 109 must not backtrack through the west corridor waypoint'
);

function routeSegment(fromId, toId) {
  const a = mapData.nodeMap[fromId];
  const b = mapData.nodeMap[toId];
  const edge = mapData.edges.find(item =>
    (item.from === fromId && item.to === toId) ||
    (item.to === fromId && item.from === toId)
  );
  assert.ok(a && b && edge, 'Expected connected geometry for ' + fromId + '/' + toId);
  return getRouteSegmentPoints(a, b, edge);
}

const first109Segment = routeSegment('room_109', 'corridor_f1_d109');
assert.ok(
  first109Segment.every(point => point.x >= mapData.nodeMap.room_109.x - 0.001),
  'Route from Room 109 should initially head east instead of west'
);

// Regressions from screenshots: Room 213 -> Room 211 needs a single
// vertical line through two doorway gaps, rather than two short zigzags.
const room213Door = routeSegment('room_213', 'corridor_f2_c17');
const room211Door = routeSegment('corridor_f2_v04', 'room_211');
assert.strictEqual(room213Door.length, 2);
assert.strictEqual(room211Door.length, 2);
for (const point of [...room213Door, ...room211Door]) {
  assert.strictEqual(point.x, 1178, 'Floor 2 route must follow corridor centerline');
}
assert.strictEqual(room213Door[0].y, 302);
assert.strictEqual(room211Door[room211Door.length - 1].y, 145);

// Central WC -> Room 106 follows a straight horizontal corridor and
// turns into the vertical wing without unnecessary lateral moves.
const wcTo106 = solveConstrainedRoute('restroom_f1_center', 'room_106', mapData);
assert.ok(wcTo106.feasible);
assert.ok(wcTo106.path.includes('corridor_f1_u15'));

// A* must retain higher-cost labels when their resource budget is better.
const resourceNodes = [
  { id: 's', type: 'corridor', floor: 1, x: 0, y: 0 },
  { id: 'limited', type: 'corridor', floor: 1, x: 1, y: 0, threshold: 0.01 },
  { id: 'junction', type: 'corridor', floor: 1, x: 2, y: 0 },
  { id: 'g', type: 'corridor', floor: 1, x: 3, y: 0, threshold: 0.01 },
];
const resourceMap = {
  nodes: resourceNodes,
  nodeMap: Object.fromEntries(resourceNodes.map(node => [node.id, node])),
  edges: [
    { id: 's_limited', from: 's', to: 'limited', weight: 1 },
    { id: 'limited_junction', from: 'limited', to: 'junction', weight: 1 },
    { id: 'direct_junction', from: 's', to: 'junction', weight: 60 },
    { id: 'junction_goal', from: 'junction', to: 'g', weight: 1 },
  ],
};
sameValues(
  solveConstrainedRoute('s', 'g', resourceMap).path,
  ['s', 'limited', 'junction', 'g'],
  'Unrestricted optimizer must prefer cheaper route'
);
const restrictedRoute = solveConstrainedRoute('s', 'g', resourceMap, {
  maxThresholdSegments: 1,
});
assert.strictEqual(restrictedRoute.feasible, true);
assert.strictEqual(restrictedRoute.cost, 111);
sameValues(
  restrictedRoute.path,
  ['s', 'junction', 'g'],
  'Constrained A* must keep the non-dominated higher-cost label'
);


// Regression tests for the six newly reported Android screenshots.
// A route should enter/leave rooms at their actual door center and never
// backtrack past an intermediate room's doorway waypoint.
const screenshotCases = [
  ['room_107', 'room_111'],
  ['room_109', 'room_111'],
  ['room_109', 'room_110'],
  ['room_114', 'room_109'],
  ['restroom_f1_center', 'room_113'],
  ['room_111', 'room_113'],
];
const approx = (a, b) => Math.abs(a - b) < 0.0001;
function screenshotRoutePoints(from, to) {
  const path = solveConstrainedRoute(from, to, mapData, {
    maxElevatorTransfers: 1,
  }).path;
  assert.ok(path.length >= 3, from + ' -> ' + to + ': route must exist');
  const points = [];
  for (let i = 1; i < path.length; i += 1) {
    const a = mapData.nodeMap[path[i - 1]];
    const b = mapData.nodeMap[path[i]];
    const edge = mapData.edges.find(item =>
      (item.from === a.id && item.to === b.id) ||
      (item.to === a.id && item.from === b.id)
    );
    assert.ok(edge);
    const segment = getRouteSegmentPoints(a, b, edge);
    assert.ok(segment.length >= 2);
    for (let j = 1; j < segment.length; j += 1) {
      const before = segment[j - 1];
      const after = segment[j];
      assert.ok(
        approx(before.x, after.x) || approx(before.y, after.y),
        'Every displayed segment must be orthogonal'
      );
    }
    if (points.length) {
      const prior = points[points.length - 1];
      assert.ok(
        approx(prior.x, segment[0].x) && approx(prior.y, segment[0].y),
        'Polyline must not jump between unrelated points'
      );
    }
    points.push(...segment.slice(points.length ? 1 : 0));
  }
  return { path, points };
}

for (const [from, to] of screenshotCases) {
  const result = screenshotRoutePoints(from, to);
  assert.strictEqual(result.path[0], from);
  assert.strictEqual(result.path[result.path.length - 1], to);
}

const route109to110 = screenshotRoutePoints('room_109', 'room_110');
sameValues(route109to110.path, [
  'room_109', 'corridor_f1_d109', 'corridor_f1_d110', 'room_110',
]);
const door109 = mapData.nodeMap.corridor_f1_d109.x;
const door110 = mapData.nodeMap.corridor_f1_d110.x;
assert.ok(route109to110.points.every(p =>
  p.x >= door110 - 0.001 && p.x <= door109 + 0.001
), 'Neighboring Rooms 109 and 110 must not have a route extension beyond their doors');

for (const from of ['room_107', 'room_109']) {
  const { path, points } = screenshotRoutePoints(from, 'room_111');
  assert.ok(path.includes('corridor_f1_d111'));
  assert.ok(!path.includes('corridor_f1_u13'), 'Do not overshoot Room 111 to the west');
  assert.ok(points.every(p => p.x >= mapData.nodeMap.corridor_f1_d111.x - 0.001));
}
for (const from of ['room_111', 'restroom_f1_center']) {
  const { path, points } = screenshotRoutePoints(from, 'room_113');
  assert.ok(path.includes('corridor_f1_d113'));
  assert.ok(!path.includes('corridor_f1_u12'), 'Do not overshoot Room 113 to the west');
  assert.ok(points.every(p => p.x >= mapData.nodeMap.corridor_f1_d113.x - 0.001));
}
const route114to109 = screenshotRoutePoints('room_114', 'room_109');
const room114Left = mapData.nodeMap.room_114.x - mapData.nodeMap.room_114.width / 2;
const route114Left = Math.min(...route114to109.points.map(p => p.x));
assert.ok(
  room114Left - route114Left <= 20,
  'Room 114 must preserve its left-side door without an exaggerated U-shaped detour'
);

// Selection paint must never expand into adjacent rooms or WC/Room 113.
// The touch target remains independent of the exact-width SVG highlight.
const floorPlanSourceLatest = fs.readFileSync('./src/rendering/FloorPlan.js', 'utf8');
assert.ok(floorPlanSourceLatest.includes("key={'selection-' + node.id}"));
assert.ok(floorPlanSourceLatest.includes("backgroundColor: 'transparent'"));
assert.ok(floorPlanSourceLatest.includes("width={roomWidth}"));
assert.ok(floorPlanSourceLatest.includes("getRouteSegmentPoints(previous, current, edge)"));


// Simulate survey data without inventing physical measurements in lc2.gml.
const rawGmlForDoorTests = fs.readFileSync('./assets/data/indoorgml/lc2.gml', 'utf8');
function insertDoorMeasurement(xml, transitionId, doorWidth, threshold) {
  const pattern = new RegExp('(<core:Transition gml:id="' + transitionId + '"[^>]*?)(\\s*/>)');
  assert.ok(pattern.test(xml), 'Expected doorway transition ' + transitionId);
  return xml.replace(
    pattern,
    '$1 wc:doorWidth="' + doorWidth + '" wc:threshold="' + threshold + '"$2'
  );
}
function surveyedMap(gml) {
  const legacy = parseIndoorGML(gml);
  const schema = migrateBuildingV1ToV2(legacy, siteGeoJSON, {
    siteId: 'tu_rangsit',
  });
  return { legacy, schema, map: normalizeBuildingData(schema) };
}
const oneDoorSurvey = surveyedMap(insertDoorMeasurement(
  rawGmlForDoorTests, 'f1_room109_top', '0.95', '0.015'
));
assert.strictEqual(
  oneDoorSurvey.legacy.connections.find(edge => edge.id === 'f1_room109_top')
    .accessibility.doorWidth, 0.95
);
assert.strictEqual(validateBuildingData(oneDoorSurvey.schema).length, 0);
const oneDoorEdge = oneDoorSurvey.map.edges.find(edge => edge.id === 'f1_room109_top');
assert.strictEqual(oneDoorEdge.door_width, 0.95);
assert.strictEqual(oneDoorEdge.threshold, 0.015);
const surveyedRoute = solveConstrainedRoute(
  'room_109', 'room_110', oneDoorSurvey.map
);
assert.strictEqual(surveyedRoute.feasible, true);
assert.ok(surveyedRoute.cost >= 50, 'Measured 1.5 cm threshold should increase route cost');
const oneReport = getRouteDoorReport(
  surveyedRoute.path, oneDoorSurvey.map.nodeMap, oneDoorSurvey.map.edges
);
assert.strictEqual(oneReport.doors.length, 2);
assert.strictEqual(oneReport.doors[0].name, 'Room 109');
assert.strictEqual(oneReport.doors[0].doorWidth, 0.95);
assert.strictEqual(oneReport.doors[0].threshold, 0.015);
assert.strictEqual(oneReport.unknownCount, 1, 'Other doorway must remain unsurveyed');
assert.strictEqual(oneReport.warningCount, 1);

const measuredBoth = surveyedMap(insertDoorMeasurement(
  insertDoorMeasurement(
    rawGmlForDoorTests, 'f1_room109_top', '0.95', '0.015'
  ),
  'f1_room110_top', '1.05', '0'
));
const measuredRoute = solveConstrainedRoute(
  'room_109', 'room_110', measuredBoth.map
);
const measuredReport = getRouteDoorReport(
  measuredRoute.path, measuredBoth.map.nodeMap, measuredBoth.map.edges
);
assert.strictEqual(measuredReport.unknownCount, 0);
assert.strictEqual(measuredReport.doors[1].threshold, 0,
  'Measured flush threshold (0 meters) must not be classified as unknown');

const blockedNarrowDoor = surveyedMap(insertDoorMeasurement(
  rawGmlForDoorTests, 'f1_room109_top', '0.8', '0'
));
assert.strictEqual(
  solveConstrainedRoute('room_109', 'room_110', blockedNarrowDoor.map).feasible,
  true,
  'Recorded 80 cm door should warn rather than block the route'
);
assert.strictEqual(
  solveConstrainedRoute('room_110', 'room_109', blockedNarrowDoor.map).feasible,
  true,
  'Room doors should remain routable in both directions'
);
const narrowRoute = solveConstrainedRoute('room_109', 'room_110', blockedNarrowDoor.map);
const narrowReport = getRouteDoorReport(
  narrowRoute.path, blockedNarrowDoor.map.nodeMap, blockedNarrowDoor.map.edges
);
assert.strictEqual(narrowReport.narrowCount, 1);
assert.strictEqual(narrowReport.warningCount, 1);
const invalidSurvey = surveyedMap(insertDoorMeasurement(
  rawGmlForDoorTests, 'f1_room109_top', '0.9', '-0.01'
));
assert.ok(
  validateBuildingData(invalidSurvey.schema).some(
    error => error.includes('threshold must be a nonnegative number')
  ),
  'Negative threshold measurements must fail data validation'
);
const bannerSource = fs.readFileSync('./src/rendering/NextStepBanner.js', 'utf8');
const directionsSource = fs.readFileSync('./src/rendering/DirectionsSheet.js', 'utf8');
assert.ok(bannerSource.includes('getRouteDoorReport'));
assert.ok(bannerSource.includes('Door measurements missing'));
assert.ok(directionsSource.includes('Clear width:'));
assert.ok(directionsSource.includes('Threshold height:'));
assert.ok(directionsSource.includes('Not measured'));


// Turn-by-turn instructions also warn when leaving a room with a raised
// measured threshold (not only when entering the destination).
const instructionBody = fs.readFileSync('./src/logic/routeInstructions.js', 'utf8')
  .replace(/^import[^\n]*\n/gm, '');
const generateMeasuredSteps = loadNamedExport(
  fs.readFileSync('./src/logic/pathfinder.js', 'utf8') + '\n' + instructionBody,
  'generateRouteSteps'
);
const instructionSteps = generateMeasuredSteps(
  surveyedRoute.path, oneDoorSurvey.map.nodeMap, oneDoorSurvey.map.edges
);
assert.ok(
  instructionSteps[0].warning.includes('1.5 cm'),
  'Starting-room threshold caution must appear in directions'
);

// An explicit GML inaccessible flag must survive schema migration.
const forbiddenXml = rawGmlForDoorTests.replace(
  /(<core:Transition gml:id="f1_room109_top"[^>]*?)(\s*\/>)/,
  '$1 wc:wheelchairAccessible="false"$2'
);
const forbiddenMap = surveyedMap(forbiddenXml);
assert.strictEqual(
  forbiddenMap.map.edges.find(edge => edge.id === 'f1_room109_top')
    .wheelchairAccessible,
  false
);
assert.strictEqual(
  solveConstrainedRoute('room_109', 'room_110', forbiddenMap.map).feasible,
  false
);


for (const number of [217, 218, 219, 220, 221, 222]) {
  const roomId = 'room_' + number;
  const transitionId = 'f2_room' + number + '_top';
  const connection = mergedLegacy.connections.find(edge => edge.id === transitionId);
  const migratedTransition = buildingData.routing.transitions.find(
    edge => edge.id === transitionId
  );
  const edge = mapData.edges.find(item => item.id === transitionId);
  assert.ok(connection && migratedTransition && edge,
    'The doorway must exist through each GML-to-routing transformation: ' + roomId);
  assert.strictEqual(connection.accessibility.doorWidth, 0.8);
  assert.strictEqual(connection.accessibility.threshold, 0.04);
  assert.strictEqual(migratedTransition.accessibility.doorWidth, 0.8);
  assert.strictEqual(migratedTransition.accessibility.threshold, 0.04);
  assert.strictEqual(edge.door_width, 0.8);
  assert.strictEqual(edge.threshold, 0.04);
  const message = getRoomDoorWarningMessage(roomId, mapData.nodeMap, mapData.edges);
  assert.strictEqual(message,
    'Room ' + number + ': door width 80 cm, threshold height 4 cm.\n' +
    'Wheelchair access may be difficult. Check the doorway on site. You can still select this route.',
    'The room warning should show both measurements in English: ' + roomId);
  const routeIntoRoom = findPath('room_211', roomId, mapData);
  const routeOutOfRoom = findPath(roomId, 'room_211', mapData);
  assert.ok(routeIntoRoom.length > 1 && routeOutOfRoom.length > 1,
    'Room door width must not prevent route calculation: ' + roomId);
  const roomReport = getRouteDoorReport(routeIntoRoom, mapData.nodeMap, mapData.edges);
  assert.ok(roomReport.doors.some(door =>
    door.unitId === roomId && door.doorWidth === 0.8 &&
    door.threshold === 0.04
  ), 'Directions must display the measured doorway: ' + roomId);
}
assert.strictEqual(
  getRoomDoorWarningMessage('room_223', mapData.nodeMap, mapData.edges),
  null,
  'Other rooms must not inherit the measurements'
);
const selectedRoomWarning = (...ids) =>
  getRoomDoorWarningMessage(ids, mapData.nodeMap, mapData.edges);
const room217Warning = getRoomDoorWarningMessage('room_217', mapData.nodeMap, mapData.edges);
assert.strictEqual(selectedRoomWarning(null, 'room_217'), room217Warning);
assert.strictEqual(selectedRoomWarning('room_217', 'room_223'), room217Warning);
assert.strictEqual(selectedRoomWarning('room_217', 'room_217'), room217Warning);
assert.strictEqual(selectedRoomWarning(null, 'room_223'), null);
for (const [start, goal] of [['217', '218'], ['218', '217']]) {
  const notice = selectedRoomWarning('room_' + start, 'room_' + goal);
  const measuredDoor = 'door width 80 cm, threshold height 4 cm.';
  assert.ok(notice.startsWith('Room ' + start + ': ' + measuredDoor + '\nRoom ' + goal + ': ' + measuredDoor),
    'Selection must show the measured conditions of both rooms in route order');
}
const screenWithDoorNotices = fs.readFileSync('./src/screens/NavigationScreen.js', 'utf8');
const hudWithDoorNotices = fs.readFileSync('./src/rendering/HUD.js', 'utf8');
assert.match(screenWithDoorNotices, /getRoomDoorWarningMessage\(\s*\[locationId,\s*destination\]/);
assert.ok(hudWithDoorNotices.includes('accessibilityNotice'));

console.log('LC2 constrained A* advisory narrow-door routing and screenshot regressions passed.');
