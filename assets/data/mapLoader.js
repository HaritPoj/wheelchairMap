import rawMapData from './map.json';

export function getMapData() {
  const nodes = rawMapData.nodes.map(node => ({
    ...node,
    label: node.name,
  }));

  return {
    ...rawMapData,
    nodes,
    nodeMap: Object.fromEntries(
      nodes.map(node => [node.id, node])
    ),
  };
}
