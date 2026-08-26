const mapData = require('./assets/data/map.json');
mapData.nodeMap = {};
mapData.nodes.forEach(n => mapData.nodeMap[n.id] = n);

function findPath(startId, goalId, mapData) {
  const { nodes, edges, nodeMap } = mapData;

  function edgeCost(edge) {
    let cost = 1;
    if (edge.width < 0.9) cost += 999;
    const a = nodeMap[edge.from];
    const b = nodeMap[edge.to];
    if (a.floor !== b.floor && !edge.hasElevator) cost += 999;
    if (a.floor !== b.floor && !edge.hasRamp)     cost += 500;
    return cost;
  }

  const dist = {}, prev = {};
  const unvisited = new Set(nodes.map(n => n.id));
  nodes.forEach(n => dist[n.id] = Infinity);
  dist[startId] = 0;

  while (unvisited.size > 0) {
    const u = [...unvisited]
      .reduce((a, b) => dist[a] < dist[b] ? a : b);
    if (u === goalId) break;
    unvisited.delete(u);
    edges
      .filter(e => e.from === u || e.to === u)
      .forEach(e => {
        const v = e.from === u ? e.to : e.from;
        const alt = dist[u] + edgeCost(e);
        if (alt < dist[v]) { dist[v] = alt; prev[v] = u; }
      });
  }

  const path = [];
  for (let n = goalId; n; n = prev[n]) path.unshift(n);
  return path;
}

const result = findPath('entrance_1', 'room_213', mapData)
console.log('Route:', result);