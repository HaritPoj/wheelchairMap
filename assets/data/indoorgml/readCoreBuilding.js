const { DOMParser } = require('@xmldom/xmldom');

const CORE = 'http://www.opengis.net/indoorgml/1.0/core';
const GML = 'http://www.opengis.net/gml/3.2';
const XLINK = 'http://www.w3.org/1999/xlink';
const WC = 'https://example.org/wheelchair-map/indoorgml-extension/1.0';

function all(parent, ns, name) {
  return Array.from(parent.getElementsByTagNameNS(ns, name));
}

function children(parent, ns, name) {
  return Array.from(parent.childNodes).filter(n => n.namespaceURI === ns && n.localName === name);
}

function idOf(feature) {
  return feature.getAttributeNS(GML, 'id');
}

function nameOf(feature) {
  return children(feature, GML, 'name')[0]?.textContent.trim() || idOf(feature);
}

function localReference(property) {
  const uri = property.getAttributeNS(XLINK, 'href');
  if (!uri || !uri.startsWith('#') || uri.length === 1) {
    throw new Error('Expected a local XLink on ' + property.nodeName);
  }
  return uri.slice(1);
}

function numbers(text) {
  const values = (text || '').trim().split(/\s+/).filter(Boolean).map(Number);
  if (!values.length || !values.every(Number.isFinite)) throw new Error('Invalid map coordinates');
  return values;
}

// LC2 renders axis-aligned rectangles. Read their real polygon rings and
// reject unsupported geometry instead of silently displaying a bounding box.
function rectangle(cell) {
  const polygons = all(cell, GML, 'Polygon');
  const lists = all(cell, GML, 'posList');
  if (polygons.length !== 1 || lists.length !== 1 || all(cell, GML, 'interior').length) {
    throw new Error('Expected one rectangular polygon for ' + idOf(cell));
  }
  const coords = numbers(lists[0].textContent);
  const xs = [], ys = [];
  if (coords.length !== 10 || coords[0] !== coords[8] || coords[1] !== coords[9]) {
    throw new Error('Expected a closed 2D rectangle for ' + idOf(cell));
  }
  const corners = new Set();
  for (let i = 0; i < 8; i += 2) {
    const [x, y] = [coords[i], coords[i + 1]];
    if (x !== coords[i + 2] && y !== coords[i + 3]) throw new Error('Unsupported angled wall in ' + idOf(cell));
    xs.push(x);
    ys.push(y);
    corners.add(x + ',' + y);
  }
  if (corners.size !== 4 || new Set(xs).size !== 2 || new Set(ys).size !== 2) {
    throw new Error('Invalid rectangle for ' + idOf(cell));
  }
  const x = Math.min(...xs), y = Math.min(...ys);
  return { type: 'rectangle', x, y, width: Math.max(...xs) - x, height: Math.max(...ys) - y };
}

function readCoreBuilding(xml) {
  const fail = message => { throw new Error('Invalid IndoorGML XML: ' + message); };
  const doc = new DOMParser({ errorHandler: { warning: fail, error: fail, fatalError: fail } })
    .parseFromString(xml, 'application/xml');
  const root = doc.documentElement;
  if (root?.namespaceURI !== CORE || root.localName !== 'IndoorFeatures') {
    throw new Error('Expected an IndoorGML 1.0 Core IndoorFeatures root');
  }
  // Older LC2 documents placed floor records directly under IndoorFeatures.
  if (children(root, WC, 'Level').length) return null;

  const layout = all(root, WC, 'Map')[0];
  if (!layout) throw new Error('The LC2 renderer requires floor layout metadata');
  const floors = children(layout, WC, 'Level').map(level => ({
    id: level.getAttribute('id'), level: Number(level.getAttribute('number')),
    name: level.getAttribute('name'),
    map: {
      width: Number(level.getAttribute('width')), height: Number(level.getAttribute('height')),
      walls: children(level, WC, 'Wall').map(wall =>
        wall.getAttribute('points').trim().split(/\s+/).map(pair => numbers(pair.replace(',', ' ')))),
      boundary: level.getAttribute('boundary').trim().split(/\s+/).map(pair => numbers(pair.replace(',', ' '))),
    },
  }));

  const spaces = all(root, CORE, 'CellSpace').map(cell => {
    const info = all(cell, WC, 'Space')[0];
    if (!info) throw new Error('Missing LC2 space metadata on ' + idOf(cell));
    return {
      id: idOf(cell), type: info.getAttribute('category'), floorId: info.getAttribute('levelId'),
      name: nameOf(cell), code: info.getAttribute('code') || null, geometry: rectangle(cell),
      accessibility: {
        wheelchairAccessible: info.getAttribute('wheelchairAccessible') !== 'false',
        throughRoom: info.getAttribute('throughRoom') === 'true',
        doorwayNotice: info.getAttribute('doorwayNotice') || null,
        doorWidth: null, threshold: null,
      },
    };
  });
  const cellIds = new Set(spaces.map(space => space.id));
  const routingIds = new Map();
  for (const state of all(root, CORE, 'State')) {
    const id = idOf(state);
    const dual = children(state, CORE, 'duality')[0];
    if (dual) {
      const cell = localReference(dual);
      if (!cellIds.has(cell)) throw new Error('Unknown dual cell ' + cell + ' on state ' + id);
      routingIds.set(id, cell);
      continue;
    }
    const waypoint = all(state, WC, 'Waypoint')[0];
    if (!waypoint) throw new Error('Missing floor for waypoint ' + id);
    const pos = numbers(all(state, GML, 'pos')[0]?.textContent);
    if (pos.length !== 2) throw new Error('Expected a 2D waypoint ' + id);
    routingIds.set(id, id);
    spaces.push({
      id, type: 'corridor', floorId: waypoint.getAttribute('levelId'), name: nameOf(state),
      geometry: { type: 'point', x: pos[0], y: pos[1] },
      accessibility: { wheelchairAccessible: true, doorWidth: null, threshold: null },
    });
  }
  const connections = all(root, CORE, 'Transition').map(edge => {
    const id = idOf(edge);
    const endpoints = children(edge, CORE, 'connects').map(link => routingIds.get(localReference(link)));
    if (endpoints.length !== 2 || endpoints.some(node => !node)) throw new Error('Invalid state endpoints on ' + id);
    const passage = all(edge, WC, 'Passage')[0];
    const weight = children(edge, CORE, 'weight')[0];
    const type = passage?.getAttribute('transitionType');
    const higherEndpoint = passage?.getAttribute('higherEndpoint');
    const advisoryRamp = passage?.getAttribute('slopePolicy') === 'advisory';
    if (advisoryRamp && !endpoints.includes(higherEndpoint)) {
      throw new Error('Invalid higher endpoint for ramp ' + id);
    }
    return {
      id, from: endpoints[0], to: endpoints[1], routing: { cost: weight ? Number(weight.textContent) : 1 },
      accessibility: {
        wheelchairAccessible: passage?.getAttribute('wheelchairAccessible') !== 'false',
        advisoryRampHighEnd: advisoryRamp ? higherEndpoint : null,
        accessNote: passage?.getAttribute('accessNote') || null,
        width: passage?.hasAttribute('width') ? Number(passage.getAttribute('width')) : null,
        slope: passage?.hasAttribute('slope') ? Number(passage.getAttribute('slope')) : null,
        doorWidth: null, leafCount: null, threshold: null,
      },
      ...(type ? { transition: { type } } : {}),
    };
  });
  return {
    schemaVersion: '1.0', sourceFormat: 'IndoorGML-GML',
    building: {
      id: idOf(root), name: nameOf(root), coordinateSystem: layout.getAttribute('coordinateSystem') || 'local',
      description: 'Parsed directly from IndoorGML XML/GML.',
    },
    floors, spaces, connections,
  };
}

exports.readCoreBuilding = readCoreBuilding;
