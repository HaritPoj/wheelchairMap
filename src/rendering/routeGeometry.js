// Shared, map-coordinate route geometry. Keep the route stroke aligned
// with the same door openings used to draw the room walls in FloorPlan.
function numberOrZero(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function getDoorSpec(edge, node, other) {
  if (!node || !other) return null;
  const id = String(edge?.id || '');
  const side = ['top', 'bottom', 'left', 'right'].find(candidate =>
    id.includes('_' + candidate)
  );

  if (side) {
    let position = 0.5;
    if ((side === 'top' || side === 'bottom') &&
        id.includes('_' + side + '_left')) {
      position = 0.22;
    } else if ((side === 'top' || side === 'bottom') &&
        id.includes('_' + side + '_right')) {
      position = 0.78;
    } else if ((side === 'left' || side === 'right') &&
        id.includes('_' + side + '_top')) {
      position = 0.22;
    } else if ((side === 'left' || side === 'right') &&
        id.includes('_' + side + '_bottom')) {
      position = 0.78;
    }
    return { side, position };
  }

  const dx = numberOrZero(other.x) - numberOrZero(node.x);
  const dy = numberOrZero(other.y) - numberOrZero(node.y);
  return {
    side: Math.abs(dx) > Math.abs(dy)
      ? (dx < 0 ? 'left' : 'right')
      : (dy < 0 ? 'top' : 'bottom'),
    position: 0.5,
  };
}

export function getDoorSpecs(node, edges, nodeMap) {
  const specs = new Map();
  for (const edge of edges || []) {
    if (edge.from !== node.id && edge.to !== node.id) continue;
    const other = nodeMap[edge.from === node.id ? edge.to : edge.from];
    if (!other) continue;
    let spec;
    if (other.type === 'corridor' || other.accessibility?.throughRoom) {
      spec = getDoorSpec(edge, node, other);
    } else if (node.accessibility?.throughRoom && other.type === 'room') {
      const door = routeAnchor(other, node, edge);
      const opposite = { left: 'right', right: 'left', top: 'bottom', bottom: 'top' };
      const vertical = door.side === 'left' || door.side === 'right';
      const position = vertical ? (door.y - node.y) / node.height + 0.5
        : (door.x - node.x) / node.width + 0.5;
      spec = { side: opposite[door.side], position };
    }
    if (spec) {
      if (!specs.has(spec.side)) specs.set(spec.side, []);
      specs.get(spec.side).push(spec.position);
    }
  }
  return specs;
}

function routeAnchor(node, other, edge) {
  const x = numberOrZero(node.x);
  const y = numberOrZero(node.y);
  const width = numberOrZero(node.width);
  const height = numberOrZero(node.height);
  if (!(width > 0 && height > 0)) return { x, y, side: null };

  const spec = getDoorSpec(edge, node, other);
  if (!spec) return { x, y, side: null };

  const left = x - width / 2;
  const right = x + width / 2;
  const top = y - height / 2;
  const bottom = y + height / 2;
  const isCorridor = other?.type === 'corridor';

  if (spec.side === 'top' || spec.side === 'bottom') {
    const doorCenterX = left + width * spec.position;
    // When the corridor centerline runs inside the actual gap, draw the
    // blue line there instead of adding a tiny sideways detour at the door.
    const halfGap = Math.min(18, width * 0.42) / 2;
    const otherX = numberOrZero(other?.x);
    const aligns = isCorridor && Math.abs(otherX - doorCenterX) <=
      Math.max(0, halfGap - 0.5);
    return {
      x: aligns ? otherX : doorCenterX,
      y: spec.side === 'top' ? top : bottom,
      side: spec.side,
    };
  }

  const doorCenterY = top + height * spec.position;
  const halfGap = Math.min(18, height * 0.34) / 2;
  const otherY = numberOrZero(other?.y);
  const aligns = isCorridor && Math.abs(otherY - doorCenterY) <=
    Math.max(0, halfGap - 0.5);
  return {
    x: spec.side === 'left' ? left : right,
    y: aligns ? otherY : doorCenterY,
    side: spec.side,
  };
}

// Output source-map units (NOT pixels). FloorPlan applies the same scale
// and offset used by all other rooms, walls and waypoints.
export function getRouteSegmentPoints(nodeA, nodeB, edge) {
  if (!nodeA || !nodeB) return [];
  const start = nodeA.accessibility?.throughRoom ? { x: nodeA.x, y: nodeA.y } : routeAnchor(nodeA, nodeB, edge);
  const end = nodeB.accessibility?.throughRoom ? { x: nodeB.x, y: nodeB.y } : routeAnchor(nodeB, nodeA, edge);
  const close = (a, b) => Math.abs(a - b) < 0.00001;

  if (close(start.x, end.x) && close(start.y, end.y)) return [start];
  if (close(start.x, end.x) || close(start.y, end.y)) return [start, end];

  let bend;
  if (start.side === 'top' || start.side === 'bottom') {
    bend = { x: start.x, y: end.y };
  } else if (start.side === 'left' || start.side === 'right') {
    bend = { x: end.x, y: start.y };
  } else if (end.side === 'top' || end.side === 'bottom') {
    bend = { x: end.x, y: start.y };
  } else if (end.side === 'left' || end.side === 'right') {
    bend = { x: start.x, y: end.y };
  } else {
    // For two waypoints, favor the axis with the larger displacement.
    bend = Math.abs(end.x - start.x) >= Math.abs(end.y - start.y)
      ? { x: end.x, y: start.y }
      : { x: start.x, y: end.y };
  }

  return [start, bend, end].filter((point, index, all) =>
    index === 0 || !(
      close(point.x, all[index - 1].x) &&
      close(point.y, all[index - 1].y)
    )
  );
}
