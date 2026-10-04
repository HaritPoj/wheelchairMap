const VALID_TYPES = new Set([
  'room',
  'corridor',
  'lift',
  'entrance',
  'toilet',
]);

function isNullableNumber(value) {
  return value === null || value === undefined ||
    (typeof value === 'number' && Number.isFinite(value));
}

export function validateMapData(data) {
  const errors = [];
  const ids = new Set();

  if (!data || !Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
    return ['Map must contain nodes and edges arrays.'];
  }

  for (const node of data.nodes) {
    if (!node || typeof node.id !== 'string' || !node.id) {
      errors.push('Node is missing a valid id.');
      continue;
    }

    if (ids.has(node.id)) errors.push('Duplicate node id: ' + node.id);
    ids.add(node.id);

    if (!Number.isFinite(node.floor)) {
      errors.push(node.id + ': invalid floor.');
    }

    if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) {
      errors.push(node.id + ': invalid coordinates.');
    }

    if (!VALID_TYPES.has(node.type)) {
      errors.push(node.id + ': invalid or missing type.');
    }

    for (const field of ['door_width', 'threshold']) {
      if (field in node && !isNullableNumber(node[field])) {
        errors.push(node.id + ': invalid ' + field + '.');
      }
    }
  }

  for (const edge of data.edges) {
    if (!edge || typeof edge.from !== 'string' || typeof edge.to !== 'string') {
      errors.push('Edge is missing from/to.');
      continue;
    }

    if (!ids.has(edge.from)) errors.push('Edge references missing node: ' + edge.from);
    if (!ids.has(edge.to)) errors.push('Edge references missing node: ' + edge.to);

    if (!Number.isFinite(edge.weight)) {
      errors.push('Edge ' + edge.from + ' -> ' + edge.to + ': weight must be numeric.');
    }

    for (const field of ['width', 'slope']) {
      if (field in edge && !isNullableNumber(edge[field])) {
        errors.push('Edge ' + edge.from + ' -> ' + edge.to + ': invalid ' + field + '.');
      }
    }

    const from = data.nodes.find(node => node.id === edge.from);
    const to = data.nodes.find(node => node.id === edge.to);

    if (from && to && from.floor !== to.floor && edge.transition !== 'elevator') {
      errors.push(
        'Cross-floor edge must declare transition="elevator": ' +
        edge.from + ' -> ' + edge.to
      );
    }
  }

  return errors;
}
