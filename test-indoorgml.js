const assert = require('assert');
const fs = require('fs');
const { DOMParser } = require('@xmldom/xmldom');
const { parseIndoorGML } = require('./assets/data/indoorgml/indoorGMLParser');

function sameValues(actual, expected, message) {
  assert.strictEqual(
    JSON.stringify(Array.from(actual)),
    JSON.stringify(Array.from(expected)),
    message
  );
}

const xml = fs.readFileSync('./assets/data/indoorgml/lc2.gml', 'utf8');
assert.doesNotMatch(xml, /\bwc:(?:doorWidth|leafCount|leafWidth|threshold)\s*=/,
  'LC2 door survey values belong in lc2.doors.json');
assert.strictEqual((xml.match(/<core:IndoorFeatures/g) || []).length, 1);
assert.strictEqual((xml.match(/<core:MultiLayeredGraph/g) || []).length, 1);
const gmlIds = Array.from(xml.matchAll(/gml:id="([^"]+)"/g), match => match[1]);
assert.strictEqual(new Set(gmlIds).size, gmlIds.length, 'All GML identifiers must be unique');
// XSD checks the property structure. Verify that the fragment links resolve
// to the correct features and that both directions of each relation agree.
const core = 'http://www.opengis.net/indoorgml/1.0/core';
const gml = 'http://www.opengis.net/gml/3.2';
const xlink = 'http://www.w3.org/1999/xlink';
const doc = new DOMParser().parseFromString(xml, 'application/xml');
const idOf = element => element.getAttributeNS(gml, 'id');
const features = new Map(Array.from(doc.getElementsByTagName('*'))
  .filter(element => element.hasAttributeNS(gml, 'id')).map(element => [idOf(element), element]));
function refs(element, property) {
  return Array.from(element.getElementsByTagNameNS(core, property)).map(link => {
    const uri = link.getAttributeNS(xlink, 'href');
    assert.ok(uri.startsWith('#') && features.has(uri.slice(1)), 'Unresolved XLink ' + uri);
    return features.get(uri.slice(1));
  });
}
for (const transition of Array.from(doc.getElementsByTagNameNS(core, 'Transition'))) {
  const ends = refs(transition, 'connects');
  assert.strictEqual(ends.length, 2, 'Expected two endpoints on ' + idOf(transition));
  for (const state of ends) {
    assert.strictEqual(state.localName, 'State');
    assert.ok(refs(state, 'connects').includes(transition), 'Missing reverse link on ' + idOf(state));
  }
}
for (const state of Array.from(doc.getElementsByTagNameNS(core, 'State'))) {
  assert.strictEqual(state.getElementsByTagNameNS(gml, 'Point').length, 1);
  for (const transition of refs(state, 'connects')) {
    assert.strictEqual(transition.localName, 'Transition');
    assert.ok(refs(transition, 'connects').includes(state));
  }
}
for (const cell of Array.from(doc.getElementsByTagNameNS(core, 'CellSpace'))) {
  assert.strictEqual(cell.getElementsByTagNameNS(gml, 'Polygon').length, 1);
  const states = refs(cell, 'duality');
  assert.strictEqual(states.length, 1);
  assert.strictEqual(states[0].localName, 'State');
  assert.deepStrictEqual(refs(states[0], 'duality'), [cell]);
}
const building = parseIndoorGML(xml);
const renamedPrefixes = xml.replace(/xmlns:core=/g, 'xmlns:indoor=').replace(/<(\/?)core:/g, '<$1indoor:');
assert.deepStrictEqual(parseIndoorGML(renamedPrefixes), building);
assert.throws(() => parseIndoorGML(xml, { missing_door: { threshold: 0 } }), /unknown transition: missing_door/);
assert.throws(() => parseIndoorGML(xml, { f1_room114_left: { width: 0.84 } }), /f1_room114_left\.width/);
assert.strictEqual(building.floors.length, 3, 'A single GML must contain all three floors');
assert.strictEqual(
  building.connections.filter(edge => edge.transition?.type === 'elevator').length,
  3,
  'The elevator must connect each pair of floors'
);
const filterFloor = floorId => ({
  ...building,
  floors: building.floors.filter(floor => floor.id === floorId),
  spaces: building.spaces.filter(space => space.floorId === floorId),
  connections: building.connections.filter(edge =>
    building.spaces.some(space => space.id === edge.from && space.floorId === floorId) ||
    building.spaces.some(space => space.id === edge.to && space.floorId === floorId)
  ),
});
const floor1 = filterFloor('floor_1');
const floor2 = filterFloor('floor_2');
const floor3 = filterFloor('floor_3');
assert.deepStrictEqual(floor3.spaces.filter(space => space.type === 'room').map(space => space.code).sort(),
  Array.from({ length: 17 }, (_, i) => String(301 + i)));
assert.strictEqual(floor3.spaces.filter(space => space.type === 'restroom').length, 1);
const floor3Walkways = floor3.connections.filter(edge => edge.transition?.type !== 'elevator');
assert.ok(floor3Walkways.every(edge => edge.displayPath?.length >= 2));
assert.strictEqual(floor3.connections.filter(edge => edge.from.startsWith('room_')).length, 17);
// The traced routes are orthogonal. Even a segment ending on a solid wall
// would put the drawn line outside a door gap.
function intersectsWall(a, b, c, d) {
  const turn = (p, q, r) =>
    (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]);
  const overlaps = [0, 1].every(i =>
    Math.max(Math.min(a[i], b[i]), Math.min(c[i], d[i])) <=
    Math.min(Math.max(a[i], b[i]), Math.max(c[i], d[i]))
  );
  return overlaps && turn(a, b, c) * turn(a, b, d) <= 0 && turn(c, d, a) * turn(c, d, b) <= 0;
}
for (const edge of floor3Walkways) {
  const path = edge.displayPath;
  for (let i = 1; i < path.length; i++) {
    for (const wall of floor3.floors[0].map.walls) {
      for (let j = 1; j < wall.length; j++) {
        assert.ok(!intersectsWall(path[i - 1], path[i], wall[j - 1], wall[j]), edge.id);
      }
    }
  }
}
// The directory board is rotated 180 degrees to match the other floor plans.
const room301 = floor3.spaces.find(space => space.code === '301');
const room317 = floor3.spaces.find(space => space.code === '317');
assert.ok(room317.geometry.x < room301.geometry.x);
const floor3Lift = floor3.spaces.find(space => space.type === 'elevator');
assert.ok(floor3Lift.geometry.y < room317.geometry.y);
assert.ok(floor3.floors[0].map.walls.length > 0);
for (const space of floor3.spaces.filter(space => space.type !== 'corridor')) {
  const { x, y, width, height } = space.geometry;
  const state = features.get('state_' + space.id);
  const position = state.getElementsByTagNameNS(gml, 'pos')[0].textContent.split(/\s+/).map(Number);
  assert.deepStrictEqual(position, [x + width / 2, y + height / 2]);
}

assert.strictEqual(floor1.sourceFormat, 'IndoorGML-GML');
assert.strictEqual(floor1.building.id, 'lc2');
assert.strictEqual(floor1.floors.length, 1);
assert.strictEqual(floor1.floors[0].id, 'floor_1');
assert.strictEqual(floor1.floors[0].level, 1);

const floor1Rooms = floor1.spaces
  .filter(space => space.type === 'room')
  .map(space => space.code)
  .sort();

sameValues(
  floor1Rooms,
  [
    '106', '107', '108', '109', '110', '111', '113', '114', '115',
    '116', '119', '120', '121', '122', '123', '124', '125', '126',
  ].sort(),
  'IndoorGML Floor 1 room set should match the active LC2 layout'
);

assert.strictEqual(
  floor1.spaces.filter(space => space.type === 'restroom').length,
  3,
  'IndoorGML Floor 1 should contain three restrooms'
);

assert.ok(
  floor1.spaces.some(space => space.id === 'corridor_f1_u01' && space.type === 'corridor'),
  'IndoorGML should materialize dual-graph states as corridor routing points'
);

const room109 = floor1.spaces.find(space => space.id === 'room_109');
const room108 = floor1.spaces.find(space => space.id === 'room_108');
const verticalCorridor = floor1.spaces.find(
  space => space.id === 'corridor_f1_vertical_area'
);
const verticalRouteNode = floor1.spaces.find(
  space => space.id === 'corridor_f1_v02'
);

assert.ok(room109 && room108 && verticalCorridor && verticalRouteNode);
assert.strictEqual(
  room108.geometry.x - (room109.geometry.x + room109.geometry.width),
  41,
  'East vertical corridor gap should match the wider reference spacing'
);
assert.strictEqual(
  verticalCorridor.geometry.width,
  67,
  'East vertical corridor area should expand when the east wing is shifted outward'
);
assert.strictEqual(
  verticalRouteNode.geometry.x,
  980,
  'East vertical routing nodes should stay centered inside the widened corridor'
);

assert.ok(
  floor1.connections.some(
    edge =>
      edge.id === 'f1_room114_left' &&
      edge.from === 'room_114' &&
      edge.to === 'corridor_f1_d114'
  ),
  'Room 114 should preserve its corrected left-side access'
);

assert.ok(
  floor1.connections.some(
    edge =>
      edge.id === 'connection_elevator_f1_f2' &&
      edge.from === 'elevator_01_f1' &&
      edge.to === 'elevator_01_f2' &&
      edge.transition?.type === 'elevator'
  ),
  'IndoorGML should preserve the cross-floor elevator transition'
);


for (const [roomId, corridorId, edgeId] of [
  ['room_114', 'corridor_f1_d114', 'f1_room114_left'],
  ['room_113', 'corridor_f1_d113', 'f1_room113_top'],
  ['room_111', 'corridor_f1_d111', 'f1_room111_top'],
  ['room_110', 'corridor_f1_d110', 'f1_room110_top'],
  ['room_109', 'corridor_f1_d109', 'f1_room109_top'],
]) {
  assert.ok(
    floor1.spaces.some(space => space.id === corridorId && space.type === 'corridor'),
    'Dedicated doorway junction must exist: ' + corridorId
  );
  assert.ok(
    floor1.connections.some(edge =>
      edge.id === edgeId && edge.from === roomId && edge.to === corridorId
    ),
    roomId + ' must connect to its own doorway junction rather than another room'
  );
}

assert.ok(
  !floor1.connections.some(
    edge => edge.from === 'stairs_f1_central' || edge.to === 'stairs_f1_central'
  ),
  'Floor 1 stairs must remain outside the wheelchair routing graph'
);

assert.strictEqual(floor2.sourceFormat, 'IndoorGML-GML');
assert.strictEqual(floor2.floors.length, 1);
assert.strictEqual(floor2.floors[0].id, 'floor_2');
assert.strictEqual(floor2.floors[0].level, 2);
assert.strictEqual(floor2.floors[0].map.width, 1331);
assert.strictEqual(floor2.floors[0].map.height, 452);

const floor2Rooms = floor2.spaces
  .filter(space => space.type === 'room')
  .map(space => space.code)
  .sort();

sameValues(
  floor2Rooms,
  [
    '211', '212', '213',
    '217', '218', '219', '220', '221', '222', '223',
    '224', '225', '226', '227', '228', '229', '230',
  ].sort(),
  'IndoorGML Floor 2 room set should match the latest reference image'
);

assert.strictEqual(floor2Rooms.length, 17, 'Floor 2 should contain exactly 17 numbered rooms');
assert.ok(!floor2Rooms.includes('214'), 'Room 214 is not shown in the latest Floor 2 reference');
assert.ok(!floor2Rooms.includes('215'), 'Room 215 is not shown in the latest Floor 2 reference');
assert.ok(!floor2Rooms.includes('216'), 'Room 216 is not shown in the latest Floor 2 reference');
assert.ok(!floor2Rooms.includes('224/1'), 'Room 224/1 is not shown in the latest Floor 2 reference');

const floor2RoomByCode = code =>
  floor2.spaces.find(space => space.type === 'room' && space.code === code);

assert.deepStrictEqual(
  JSON.parse(JSON.stringify(floor2RoomByCode('230').geometry)),
  { type: 'rectangle', x: 57, y: 303, width: 47, height: 105 },
  'Room 230 geometry should match the latest Floor 2 reference'
);
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(floor2RoomByCode('211').geometry)),
  { type: 'rectangle', x: 1156, y: 31, width: 132, height: 114 },
  'Room 211 geometry should match the east wing in the reference'
);

const room213 = floor2RoomByCode('213');
const corridor213 = floor2.spaces.find(space => space.id === 'corridor_f2_c17');
assert.ok(room213 && corridor213, 'Room 213 and the upper corridor waypoint must exist');
assert.strictEqual(room213.geometry.x, 1156);
assert.strictEqual(room213.geometry.y, 302);
assert.strictEqual(room213.geometry.width, 132);
assert.strictEqual(corridor213.geometry.x, 1178);
assert.strictEqual(corridor213.geometry.y, 286);
assert.ok(
  corridor213.geometry.y < room213.geometry.y,
  'Room 213 must open toward the corridor above its top wall'
);
assert.ok(
  floor2.connections.some(
    edge =>
      edge.id === 'f2_room213_top_left' &&
      edge.from === 'room_213' &&
      edge.to === 'corridor_f2_c17'
  ),
  'Room 213 doorway must be on the top wall near its left corner'
);
const door213X = room213.geometry.x + room213.geometry.width * 0.22;
assert.ok(
  door213X > 1170 && door213X < 1200,
  'Room 213 door gap should align with the reference opening'
);
assert.ok(
  !floor2.connections.some(edge => edge.id === 'f2_room213_left_top'),
  'The old left-wall doorway must not remain active'
);

assert.strictEqual(
  floor2.spaces.filter(space => space.type === 'restroom').length,
  1,
  'Floor 2 should contain the east-wing WC shown in the reference'
);
assert.strictEqual(
  floor2.spaces.filter(space => space.type === 'stairs').length,
  0,
  'Floor 2 should not contain any stair spaces'
);
assert.ok(
  !floor2.spaces.some(space =>
    space.id === 'stairs_f2_central' || space.id === 'stairs_f2_east'
  ),
  'Central and east staircase elements must be removed from Floor 2'
);

const room211 = floor2RoomByCode('211');
const corridor211 = floor2.spaces.find(space => space.id === 'corridor_f2_v04');
assert.ok(room211 && corridor211, 'Room 211 and its entrance waypoint must exist');
assert.ok(
  corridor211.geometry.y > room211.geometry.y + room211.geometry.height,
  'Room 211 waypoint must be outside the lower wall, not inside the room'
);
assert.strictEqual(corridor211.geometry.x, 1178);
assert.strictEqual(corridor211.geometry.y, 168);

const floorPlanSource = fs.readFileSync('./src/rendering/FloorPlan.js', 'utf8');
assert.match(
  floorPlanSource,
  /stroke="none"\s*\/>\s*\{renderRoomWalls\(node, x, y, roomWidth, roomHeight\)\}/,
  'Standard Floor 2 rooms must render door gaps rather than fully closed rectangles'
);

assert.ok(
  floor2.connections.some(
    edge =>
      edge.id === 'f2_room211_bottom_left' &&
      edge.from === 'room_211' &&
      edge.to === 'corridor_f2_v04'
  ),
  'Room 211 should connect to the vertical east-wing corridor'
);
assert.ok(
  floor2.connections.some(
    edge =>
      edge.id === 'f2_elevator_bottom' &&
      edge.from === 'elevator_01_f2' &&
      edge.to === 'corridor_f2_c07'
  ),
  'Floor 2 elevator should connect to the main corridor'
);
assert.ok(
  !floor2.connections.some(
    edge =>
      edge.from === 'stairs_f2_central' ||
      edge.to === 'stairs_f2_central' ||
      edge.from === 'stairs_f2_east' ||
      edge.to === 'stairs_f2_east'
  ),
  'Floor 2 stairs must remain outside the wheelchair routing graph'
);

console.log('IndoorGML XML parser tests for Floor 1 and latest Floor 2 passed.');
