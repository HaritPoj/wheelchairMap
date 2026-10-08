function numeric(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function getEdgeCost(edge, fromId, toId, nodeMap) {
  const storedWeight = numeric(edge.weight);
  let cost = storedWeight !== null ? storedWeight : 1;
  const from = nodeMap[fromId];
  const to = nodeMap[toId];

  if (!from || !to) return Infinity;
  if (from.type === 'stairs' || to.type === 'stairs') return Infinity;

  const width = numeric(edge.width);
  const slope = numeric(edge.slope);

  if (width !== null && width < 0.9) return Infinity;

  if (slope !== null) {
    if (slope >= 5.0) return Infinity;
    if (slope >= 3.0) cost += 50;
  }

  const doorWidth = numeric(to.door_width);
  if (doorWidth !== null && doorWidth < 0.9) return Infinity;

  const threshold = numeric(to.threshold);
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
        const right = left + 1;
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

export function findPath(startId, goalId, mapData) {
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

export function findAllPaths(startId, goalId, mapData) {
  const { nodes, edges, nodeMap } = mapData;
  if (!nodeMap[startId] || !nodeMap[goalId]) return [];
  if (startId === goalId) return [[startId]];

  const adjacency = createAdjacency(nodes, edges);
  const heuristic = createHeuristic(mapData);
  const open = new MinHeap(compareQueueItems);
  const routes = [];

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
      routes.push(current.path);
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
