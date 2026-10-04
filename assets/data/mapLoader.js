import rawMapData from './map.json';
import { validateMapData } from './mapValidator';

export function getMapData() {
  const nodes = rawMapData.nodes.map(node => ({
    ...node,
    label: node.name || node.id,
  }));

  const data = {
    ...rawMapData,
    nodes,
    nodeMap: Object.fromEntries(nodes.map(node => [node.id, node])),
  };

  const errors = validateMapData(data);

  if (errors.length > 0) {
    throw new Error('Invalid map data:\n' + errors.join('\n'));
  }

  return data;
}
