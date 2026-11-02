const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

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

const parseIndoorGML = loadNamedExport(
  fs.readFileSync('./assets/data/indoorgml/indoorGMLParser.js', 'utf8'),
  'parseIndoorGML'
);

const floor1Xml = fs.readFileSync('./assets/data/indoorgml/lc2.gml', 'utf8');
const floor2Xml = fs.readFileSync('./assets/data/indoorgml/lc2.floor2.gml', 'utf8');
const floor1 = parseIndoorGML(floor1Xml);
const floor2 = parseIndoorGML(floor2Xml);

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
      edge.to === 'corridor_f1_u11'
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

assert.strictEqual(
  floor2.spaces.filter(space => space.type === 'restroom').length,
  1,
  'Floor 2 should contain the east-wing WC shown in the reference'
);
assert.strictEqual(
  floor2.spaces.filter(space => space.type === 'stairs').length,
  2,
  'Floor 2 should contain the central and east stair areas shown in the reference'
);

assert.ok(
  floor2.connections.some(
    edge =>
      edge.id === 'f2_room211_bottom' &&
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
