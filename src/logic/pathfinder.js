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
export function findPath(startId, goalId, mapData) {
  const { nodes, edges, nodeMap } = mapData;

  if (!nodeMap[startId] || !nodeMap[goalId]) return [];
  if (startId === goalId) return [startId];


  const dist = {};
  const prev = {};
  const unvisited = new Set(nodes.map(node => node.id));

  for (const node of nodes) dist[node.id] = Infinity;
  dist[startId] = 0;

  while (unvisited.size > 0) {
    let current = null;
    let bestDistance = Infinity;

    for (const id of unvisited) {
      if (dist[id] < bestDistance) {
        bestDistance = dist[id];
        current = id;
      }
    }

    if (current === null) break;
    unvisited.delete(current);
    if (current === goalId) break;

    for (const edge of edges) {
      let next = null;
      if (edge.from === current) next = edge.to;
      else if (edge.to === current) next = edge.from;

      if (!next || !unvisited.has(next)) continue;

      const cost = getEdgeCost(edge, current, next, nodeMap);
      if (!Number.isFinite(cost)) continue;

      const candidate = dist[current] + cost;
      if (candidate < dist[next]) {
        dist[next] = candidate;
        prev[next] = current;
      }
    }
  }

  if (!Number.isFinite(dist[goalId])) return [];

  const path = [];
  let current = goalId;

  while (current !== undefined) {
    path.unshift(current);
    if (current === startId) break;
    current = prev[current];
  }

  return path[0] === startId ? path : [];
}


export function findAllPaths(startId, goalId, mapData) {
  const { nodes, edges, nodeMap } = mapData;

  if (!nodeMap[startId] || !nodeMap[goalId]) return [];
  if (startId === goalId) return [[startId]];

  const adjacency = new Map(nodes.map(node => [node.id, []]));

  for (const edge of edges) {
    if (!adjacency.has(edge.from) || !adjacency.has(edge.to)) continue;
    adjacency.get(edge.from).push({ edge, next: edge.to });
    adjacency.get(edge.to).push({ edge, next: edge.from });
  }

  const found = new Map();
  const path = [startId];
  const visited = new Set(path);

  function visit(current, cost) {
    if (current === goalId) {
      const route = [...path];
      const key = JSON.stringify(route);
      const existing = found.get(key);
      if (!existing || cost < existing.cost) {
        found.set(key, { path: route, cost });
      }
      return;
    }

    for (const { edge, next } of adjacency.get(current) || []) {
      if (visited.has(next)) continue;

      const stepCost = getEdgeCost(edge, current, next, nodeMap);
      if (!Number.isFinite(stepCost)) continue;

      visited.add(next);
      path.push(next);
      visit(next, cost + stepCost);
      path.pop();
      visited.delete(next);
    }
  }

  // Simple paths omit pointless loops that revisit the same corridor or room.
  visit(startId, 0);

  const orderedRoutes = [...found.values()];
  orderedRoutes.sort((first, second) => {
    const costDifference = first.cost - second.cost;
    if (costDifference !== 0) return costDifference;
    if (first.path.length !== second.path.length) {
      return first.path.length - second.path.length;
    }
    return first.path.join('|').localeCompare(second.path.join('|'));
  });

  return orderedRoutes.map(item => item.path);
}
