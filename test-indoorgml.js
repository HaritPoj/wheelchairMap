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

const xml = fs.readFileSync('./assets/data/indoorgml/lc2.gml', 'utf8');
const floor1 = parseIndoorGML(xml);

assert.strictEqual(floor1.sourceFormat, 'IndoorGML-GML');
assert.strictEqual(floor1.building.id, 'lc2');
assert.strictEqual(floor1.floors.length, 1);
assert.strictEqual(floor1.floors[0].id, 'floor_1');
assert.strictEqual(floor1.floors[0].level, 1);

const rooms = floor1.spaces
  .filter(space => space.type === 'room')
  .map(space => space.code)
  .sort();

sameValues(
  rooms,
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
  'Stairs must remain outside the wheelchair routing graph'
);

console.log('IndoorGML XML parser tests passed.');
