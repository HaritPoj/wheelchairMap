function numeric(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

// A doorway is a same-floor connection into or out of a physical unit.
// Values are in meters. Null means NOT surveyed; zero is a valid measured
// flush threshold. Per-transition data overrides room-level legacy values.
export function getDoorMeasurements(edge, from, to) {
  if (!edge || !from || !to || from.floor !== to.floor) return null;
  const isFromRoom = from.type !== 'corridor' && from.type !== 'stairs';
  const isToRoom = to.type !== 'corridor' && to.type !== 'stairs';
  if (!isFromRoom && !isToRoom) return null;
  if (from.type === 'stairs' || to.type === 'stairs') return null;
  const unit = isFromRoom ? from : to;
  const doorWidth = numeric(edge.door_width) ?? numeric(unit.door_width);
  const threshold = numeric(edge.threshold) ?? numeric(unit.threshold);
  return {
    edgeId: edge.id,
    unitId: unit.id,
    name: unit.name || unit.label || unit.code || unit.id,
    doorWidth,
    threshold,
    missingMeasurement: doorWidth === null || threshold === null,
  };
}

// Inspect every doorway of the ACTUAL computed path, including the exit
// from the starting room. Do not infer measurements for uninspected doors.
export function getRouteDoorReport(route, nodeMap, edges) {
  const doors = [];
  if (!Array.isArray(route)) {
    return { doors, unknownCount: 0, narrowCount: 0, raisedThresholdCount: 0, warningCount: 0 };
  }
  for (let index = 1; index < route.length; index += 1) {
    const from = nodeMap?.[route[index - 1]];
    const to = nodeMap?.[route[index]];
    if (!from || !to) continue;
    const edge = (edges || []).find(item =>
      (item.from === from.id && item.to === to.id) ||
      (item.to === from.id && item.from === to.id)
    );
    const measurement = getDoorMeasurements(edge, from, to);
    if (measurement) {
      doors.push(measurement);
    }
  }
  return {
    doors,
    unknownCount: doors.filter(door => door.missingMeasurement).length,
    // A raised threshold may need attention even when the solver
    // includes it with a cost penalty rather than a hard exclusion.
    narrowCount: doors.filter(door => door.doorWidth !== null && door.doorWidth < 0.9).length,
    raisedThresholdCount: doors.filter(door => door.threshold !== null && door.threshold >= 0.01).length,
    warningCount: doors.filter(door =>
      (door.doorWidth !== null && door.doorWidth < 0.9) ||
      (door.threshold !== null && door.threshold >= 0.01)
    ).length,
  };
}

function describeRoomDoorConditions(roomId, nodeMap, edges, referenceWidth) {
  const room = nodeMap?.[roomId];
  if (!room || (room.type !== 'room' && room.type !== 'restroom')) return null;

  const doors = (edges || []).flatMap(edge => {
    if (edge.from !== roomId && edge.to !== roomId) return [];
    const other = nodeMap?.[edge.from === roomId ? edge.to : edge.from];
    if (!other) return [];
    const doorway = getDoorMeasurements(edge, room, other);
    return doorway ? [doorway] : [];
  });

  const alerts = doors.filter(door =>
    (door.doorWidth !== null && door.doorWidth < referenceWidth) ||
    (door.threshold !== null && door.threshold >= 0.01)
  );
  if (!alerts.length) return null;

  const cm = meters => Number((meters * 100).toFixed(1));
  const descriptions = alerts.map(door => {
    const attributes = [];
    if (door.doorWidth !== null) {
      attributes.push('ประตูกว้าง ' + cm(door.doorWidth) + ' ซม.');
    }
    if (door.threshold !== null) {
      attributes.push('ธรณีประตูสูง ' + cm(door.threshold) + ' ซม.');
    }
    return attributes.join(' และ ');
  });
  return (room.name || room.code || roomId) + ': ' + descriptions.join('; ');
}

// Accept a single room or both selected endpoints in route order.
export function getRoomDoorWarningMessage(roomIds, nodeMap, edges, referenceWidth = 0.9) {
  const ids = new Set(Array.isArray(roomIds) ? roomIds : [roomIds]);
  const descriptions = Array.from(ids, id =>
    describeRoomDoorConditions(id, nodeMap, edges, referenceWidth)
  ).filter(Boolean);
  if (!descriptions.length) return null;

  return descriptions.join('\n') +
    ' อาจไม่สามารถเข้าถึงได้สำหรับผู้ใช้รถเข็นบางราย โปรดตรวจสอบสภาพจริงก่อนผ่านประตู (ยังสามารถเลือกเส้นทางนี้ได้)';
}

function getEdgeCost(edge, fromId, toId, nodeMap) {
  const storedWeight = numeric(edge.weight);
  let cost = storedWeight !== null ? storedWeight : 1;
  const from = nodeMap[fromId];
  const to = nodeMap[toId];

  if (!from || !to) return Infinity;
  if (edge.wheelchairAccessible === false) return Infinity;
  if (from.accessibility?.wheelchairAccessible === false) return Infinity;
  if (to.accessibility?.wheelchairAccessible === false) return Infinity;
  if (from.type === 'stairs' || to.type === 'stairs') return Infinity;

  const width = numeric(edge.width);
  const slope = numeric(edge.slope);

  if (width !== null && width < 0.9) return Infinity;

  if (slope !== null) {
    if (slope >= 5.0) return Infinity;
    if (slope >= 3.0) cost += 50;
  }

  const door = getDoorMeasurements(edge, from, to);
  // Measured narrow *room doors* are warnings, NOT hard routing barriers.
  // Corridor/edge clear width, explicit inaccessible flags, and stairs
  // retain their original hard constraints.
  const threshold = door ? door.threshold : numeric(to.threshold);
  if (threshold !== null) {
    if (threshold >= 0.02) cost += 200;
    else if (threshold >= 0.01) cost += 50;
  }

  if (from.floor !== to.floor) {
    const transitionType = edge.transition;

    if (transitionType === 'elevator') {
      if (from.type !== 'elevator' || to.type !== 'elevator') {
        return Infinity;
      }
      cost += 10;
    } else if (transitionType === 'ramp') {
      cost += 20;
    } else {
      return Infinity;
    }
  }

  return cost;
}

class MinHeap {
  constructor(compare) {
    this.items = [];
    this.compare = compare;
  }

  get size() {
    return this.items.length;
  }

  push(value) {
    const items = this.items;
    items.push(value);
    let index = items.length - 1;

    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.compare(items[parent], value) <= 0) break;
      items[index] = items[parent];
      index = parent;
    }
    items[index] = value;
  }

  pop() {
    if (this.items.length === 0) return undefined;

    const items = this.items;
    const first = items[0];
    const last = items.pop();

    if (items.length > 0) {
      let index = 0;
      while (true) {
        const left = index * 2 + 1;
        const right = index * 2 + 2;
        if (left >= items.length) break;

        let child = left;
        if (
          right < items.length &&
          this.compare(items[right], items[left]) < 0
        ) {
          child = right;
        }
        if (this.compare(last, items[child]) <= 0) break;
        items[index] = items[child];
        index = child;
      }
      items[index] = last;
    }

    return first;
  }
}

function createAdjacency(nodes, edges) {
  const adjacency = new Map(nodes.map(node => [node.id, []]));

  for (const edge of edges) {
    if (!adjacency.has(edge.from) || !adjacency.has(edge.to)) continue;
    adjacency.get(edge.from).push({ edge, next: edge.to });
    adjacency.get(edge.to).push({ edge, next: edge.from });
  }

  for (const neighbors of adjacency.values()) {
    neighbors.sort((a, b) => a.next.localeCompare(b.next));
  }

  return adjacency;
}

function createHeuristic(mapData) {
  const { edges, nodeMap } = mapData;
  let minCostPerHorizontalUnit = Infinity;
  let minCostPerFloorLevel = Infinity;

  for (const edge of edges) {
    const from = nodeMap[edge.from];
    const to = nodeMap[edge.to];
    if (!from || !to) continue;

    const dx = (Number(from.x) || 0) - (Number(to.x) || 0);
    const dy = (Number(from.y) || 0) - (Number(to.y) || 0);
    const horizontalDistance = Math.hypot(dx, dy);
    const fromFloor = numeric(from.floor);
    const toFloor = numeric(to.floor);
    const floorDistance =
      fromFloor === null || toFloor === null
        ? 0
        : Math.abs(fromFloor - toFloor);

    for (const [source, target] of [
      [from, to],
      [to, from],
    ]) {
      const cost = getEdgeCost(edge, source.id, target.id, nodeMap);
      if (!Number.isFinite(cost) || cost < 0) continue;

      if (horizontalDistance > 0) {
        minCostPerHorizontalUnit = Math.min(
          minCostPerHorizontalUnit,
          cost / horizontalDistance
        );
      }

      if (floorDistance > 0 && edge.transition) {
        minCostPerFloorLevel = Math.min(
          minCostPerFloorLevel,
          cost / floorDistance
        );
      }
    }
  }

  return (nodeId, goalId) => {
    const node = nodeMap[nodeId];
    const goal = nodeMap[goalId];
    if (!node || !goal) return 0;

    const dx = (Number(node.x) || 0) - (Number(goal.x) || 0);
    const dy = (Number(node.y) || 0) - (Number(goal.y) || 0);
    const horizontalDistance = Math.hypot(dx, dy);
    const horizontalBound = Number.isFinite(minCostPerHorizontalUnit)
      ? horizontalDistance * minCostPerHorizontalUnit
      : 0;

    const nodeFloor = numeric(node.floor);
    const goalFloor = numeric(goal.floor);
    const floorDistance =
      nodeFloor === null || goalFloor === null
        ? 0
        : Math.abs(nodeFloor - goalFloor);
    const floorBound = Number.isFinite(minCostPerFloorLevel)
      ? floorDistance * minCostPerFloorLevel
      : 0;

    return Math.max(horizontalBound, floorBound);
  };
}

function compareQueueItems(a, b) {
  return (
    a.f - b.f ||
    a.g - b.g ||
    a.path.length - b.path.length ||
    a.path.join('|').localeCompare(b.path.join('|'))
  );
}

export function findAStarPath(startId, goalId, mapData) {
  const { nodes, edges, nodeMap } = mapData;
  if (!nodeMap[startId] || !nodeMap[goalId]) return [];
  if (startId === goalId) return [startId];

  const adjacency = createAdjacency(nodes, edges);
  const heuristic = createHeuristic(mapData);
  const open = new MinHeap(compareQueueItems);
  const bestCost = new Map([[startId, 0]]);
  const previous = new Map();

  open.push({
    id: startId,
    g: 0,
    f: heuristic(startId, goalId),
    path: [startId],
  });

  while (open.size > 0) {
    const current = open.pop();
    if (current.g !== bestCost.get(current.id)) continue;

    if (current.id === goalId) {
      const path = [];
      let id = goalId;
      while (id !== undefined) {
        path.unshift(id);
        if (id === startId) break;
        id = previous.get(id);
      }
      return path[0] === startId ? path : [];
    }

    for (const { edge, next } of adjacency.get(current.id) || []) {
      if (nodeMap[next]?.type === 'room' && next !== goalId) continue;

      const edgeCost = getEdgeCost(edge, current.id, next, nodeMap);
      if (!Number.isFinite(edgeCost)) continue;

      const candidateCost = current.g + edgeCost;
      if (candidateCost >= (bestCost.get(next) ?? Infinity)) continue;

      bestCost.set(next, candidateCost);
      previous.set(next, current.id);
      open.push({
        id: next,
        g: candidateCost,
        f: candidateCost + heuristic(next, goalId),
        path: [...current.path, next],
      });
    }
  }

  return [];
}


// Constraint Optimization Problem (COP): minimum-cost accessible path
// with optional *route-wide* resource limits. Resource-Constrained A*
// keeps non-dominated labels and orders the frontier by g + admissible h.
// It is an exact search for nonnegative edge costs, not a CP-SAT solver.
//
// Inputs are the same graph used by the app's A*. Unmeasured width,
// slope, and door size are unknown, not assumed certified accessible.
// Clients may opt into conservative "requireMeasured..." constraints.
function routeLimit(value, label) {
  if (value === undefined || value === null) return Infinity;
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    throw new RangeError(label + ' must be a nonnegative finite number');
  }
  return number;
}

function makeRouteConstraints(options = {}) {
  return {
    maxCost: routeLimit(options.maxCost, 'maxCost'),
    maxElevatorTransfers: routeLimit(options.maxElevatorTransfers, 'maxElevatorTransfers'),
    maxSteepSegments: routeLimit(options.maxSteepSegments, 'maxSteepSegments'),
    maxThresholdSegments: routeLimit(options.maxThresholdSegments, 'maxThresholdSegments'),
    blockedNodeIds: new Set(options.blockedNodeIds || []),
    blockedEdgeIds: new Set(options.blockedEdgeIds || []),
    requireMeasuredWidths: options.requireMeasuredWidths === true,
    requireMeasuredDoorWidths: options.requireMeasuredDoorWidths === true,
    requireMeasuredSlopes: options.requireMeasuredSlopes === true,
  };
}

function dominatesRoute(a, b, rules) {
  // Only bounded resources affect future feasibility. Unbounded counters
  // remain useful for reporting, but must not create extra search labels.
  return (
    a.cost <= b.cost &&
    (Number.isFinite(rules.maxElevatorTransfers)
      ? a.elevatorTransfers <= b.elevatorTransfers : true) &&
    (Number.isFinite(rules.maxSteepSegments)
      ? a.steepSegments <= b.steepSegments : true) &&
    (Number.isFinite(rules.maxThresholdSegments)
      ? a.thresholdSegments <= b.thresholdSegments : true)
  );
}

function emptyConstrainedResult() {
  return {
    path: [],
    cost: Infinity,
    feasible: false,
    resources: {
      elevatorTransfers: 0,
      steepSegments: 0,
      thresholdSegments: 0,
    },
  };
}

export function solveConstrainedRoute(startId, goalId, mapData, options = {}) {
  const { nodes, edges, nodeMap } = mapData;
  const rules = makeRouteConstraints(options);
  const start = nodeMap[startId];
  const goal = nodeMap[goalId];

  if (
    !start || !goal ||
    rules.blockedNodeIds.has(startId) ||
    rules.blockedNodeIds.has(goalId) ||
    start.type === 'stairs' || goal.type === 'stairs' ||
    start.accessibility?.wheelchairAccessible === false ||
    goal.accessibility?.wheelchairAccessible === false
  ) {
    return emptyConstrainedResult();
  }

  if (startId === goalId) {
    return {
      path: [startId],
      cost: 0,
      feasible: true,
      resources: { elevatorTransfers: 0, steepSegments: 0, thresholdSegments: 0 },
    };
  }

  const adjacency = createAdjacency(nodes, edges);
  // A* lower bound remains admissible after imposing extra constraints:
  // restricting feasible paths cannot decrease the true remaining cost.
  const heuristic = createHeuristic(mapData);
  const frontier = new MinHeap((a, b) =>
    a.f - b.f || a.cost - b.cost || a.id.localeCompare(b.id)
  );
  const labels = new Map();
  const initial = {
    id: startId,
    cost: 0,
    f: heuristic(startId, goalId),
    elevatorTransfers: 0,
    steepSegments: 0,
    thresholdSegments: 0,
    parent: null,
    active: true,
  };
  labels.set(startId, [initial]);
  frontier.push(initial);

  while (frontier.size > 0) {
    const current = frontier.pop();
    if (!current.active) continue;

    if (current.id === goalId) {
      const path = [];
      for (let label = current; label; label = label.parent) {
        path.unshift(label.id);
      }
      return {
        path,
        cost: current.cost,
        feasible: true,
        resources: {
          elevatorTransfers: current.elevatorTransfers,
          steepSegments: current.steepSegments,
          thresholdSegments: current.thresholdSegments,
        },
      };
    }

    for (const { edge, next } of adjacency.get(current.id) || []) {
      if (rules.blockedEdgeIds.has(edge.id) || rules.blockedNodeIds.has(next)) continue;
      if (nodeMap[next]?.type === 'room' && next !== goalId) continue;
      // Enforce all existing wheelchair-accessibility hard constraints.
      const stepCost = getEdgeCost(edge, current.id, next, nodeMap);
      if (!Number.isFinite(stepCost) || stepCost < 0) continue;

      const destination = nodeMap[next];
      if (rules.requireMeasuredWidths && numeric(edge.width) === null) continue;
      const doorway = getDoorMeasurements(edge, nodeMap[current.id], destination);
      if (rules.requireMeasuredDoorWidths &&
          doorway && doorway.doorWidth === null) continue;
      if (rules.requireMeasuredSlopes && numeric(edge.slope) === null) continue;

      const cost = current.cost + stepCost;
      if (cost > rules.maxCost) continue;
      const elevatorTransfers = current.elevatorTransfers + (
        current.id !== next &&
        nodeMap[current.id].floor !== destination.floor &&
        edge.transition === 'elevator' ? 1 : 0
      );
      const steepSegments = current.steepSegments + (
        numeric(edge.slope) !== null && numeric(edge.slope) >= 3 ? 1 : 0
      );
      const thresholdSegments = current.thresholdSegments + (
        (doorway ? doorway.threshold : numeric(destination.threshold)) !== null &&
        (doorway ? doorway.threshold : numeric(destination.threshold)) >= 0.01 ? 1 : 0
      );

      if (
        elevatorTransfers > rules.maxElevatorTransfers ||
        steepSegments > rules.maxSteepSegments ||
        thresholdSegments > rules.maxThresholdSegments
      ) continue;

      const candidate = {
        id: next,
        cost,
        f: cost + heuristic(next, goalId),
        elevatorTransfers,
        steepSegments,
        thresholdSegments,
        parent: current,
        active: true,
      };
      const currentLabels = labels.get(next) || [];
      if (currentLabels.some(label => label.active && dominatesRoute(label, candidate, rules))) {
        continue;
      }
      const nonDominated = currentLabels.filter(label => {
        if (label.active && dominatesRoute(candidate, label, rules)) {
          label.active = false;
          return false;
        }
        return label.active;
      });
      nonDominated.push(candidate);
      labels.set(next, nonDominated);
      frontier.push(candidate);
    }
  }

  return emptyConstrainedResult();
}

// App entry point: Resource-Constrained A* applies COP during search,
// never as a post-filter.
export function findPath(startId, goalId, mapData, constraints = {}) {
  return solveConstrainedRoute(startId, goalId, mapData, constraints).path;
}

export function findAllPaths(startId, goalId, mapData) {
  const { nodes, edges, nodeMap } = mapData;
  if (!nodeMap[startId] || !nodeMap[goalId]) return [];
  if (startId === goalId) return [[startId]];

  const adjacency = createAdjacency(nodes, edges);
  const heuristic = createHeuristic(mapData);
  const open = new MinHeap(compareQueueItems);
  const routes = [];
  const seenRoutes = new Set();

  open.push({
    id: startId,
    g: 0,
    f: heuristic(startId, goalId),
    path: [startId],
    visited: new Set([startId]),
  });

  while (open.size > 0) {
    const current = open.pop();

    if (current.id === goalId) {
      const routeKey = current.path.join('->');
      if (!seenRoutes.has(routeKey)) {
        seenRoutes.add(routeKey);
        routes.push(current.path);
      }
      continue;
    }

    for (const { edge, next } of adjacency.get(current.id) || []) {
      if (current.visited.has(next)) continue;
      if (nodeMap[next]?.type === 'room' && next !== goalId) continue;

      const edgeCost = getEdgeCost(edge, current.id, next, nodeMap);
      if (!Number.isFinite(edgeCost)) continue;

      const nextCost = current.g + edgeCost;
      const path = [...current.path, next];
      const visited = new Set(current.visited);
      visited.add(next);
      open.push({
        id: next,
        g: nextCost,
        f: nextCost + heuristic(next, goalId),
        path,
        visited,
      });
    }
  }

  return routes;
}
