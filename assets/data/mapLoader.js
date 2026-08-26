import data from '../../assets/data/map.json';

export function getMapData() {
  data.nodeMap = {};
  data.nodes.forEach(n => {
    n.label = n.name;
    data.nodeMap[n.id] = n;
  });
  return data;
}