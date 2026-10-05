const SUPPORTED_SPACE_TYPES = new Set([
  "room",
  "corridor",
  "elevator",
  "entrance",
  "toilet",
  "stairs",
  "ramp",
  "restroom",
  "lobby",
  "exit",
  "other"
]);

function geometryToNodeFields(geometry) {
  const source = geometry || {};
  return {
    x: Number(source.x) || 0,
    y: Number(source.y) || 0,
    width: Number(source.width) || 0,
    height: Number(source.height) || 0,
  };
}

export function normalizeBuildingData(buildingData) {
  const floorsById = Object.fromEntries(
    (buildingData.floors || []).map(floor => [floor.id, floor])
  );

  const nodes = (buildingData.spaces || []).map(space => {
    const floor = floorsById[space.floorId];
    const geometry = geometryToNodeFields(space.geometry);
    const accessibility = space.accessibility || {};

    return {
      id: space.id,
      name: space.name || space.code || space.id,
      label: space.name || space.code || space.id,
      code: space.code || null,
      floorId: space.floorId,
      floor: floor ? Number(floor.level) : null,
      x: geometry.x,
      y: geometry.y,
      width: geometry.width,
      height: geometry.height,
      type: SUPPORTED_SPACE_TYPES.has(space.type) ? space.type : space.type,
      door_width:
        accessibility.doorWidth === undefined
          ? null
          : accessibility.doorWidth,
      threshold:
        accessibility.threshold === undefined
          ? null
          : accessibility.threshold,
      accessibility,
    };
  });

  const edges = (buildingData.connections || []).map(connection => ({
    id: connection.id,
    from: connection.from,
    to: connection.to,
    weight:
      connection.routing && connection.routing.cost !== undefined
        ? connection.routing.cost
        : 1,
    width:
      connection.accessibility && connection.accessibility.width !== undefined
        ? connection.accessibility.width
        : null,
    slope:
      connection.accessibility && connection.accessibility.slope !== undefined
        ? connection.accessibility.slope
        : null,
    transition:
      connection.transition && connection.transition.type
        ? connection.transition.type
        : undefined,
  }));

  return {
    ...buildingData,
    nodes,
    edges,
    nodeMap: Object.fromEntries(nodes.map(node => [node.id, node])),
    floorMap: floorsById,
    buildingId: buildingData.building.id,
    buildingName: buildingData.building.name,
  };
}
