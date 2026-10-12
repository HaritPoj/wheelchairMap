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
  const x = Number(source.x) || 0;
  const y = Number(source.y) || 0;
  const width = Number(source.width) || 0;
  const height = Number(source.height) || 0;

  // Rectangle coordinates in building data describe the top-left corner.
  // The renderer and route overlay use the rectangle center as the node point.
  return {
    x: source.type === "rectangle" ? x + width / 2 : x,
    y: source.type === "rectangle" ? y + height / 2 : y,
    width,
    height,
    parts: Array.isArray(source.parts) ? source.parts : null,
    outline: Array.isArray(source.outline) ? source.outline : null,
  };
}

function getGeoJsonRing(siteGeoJSON) {
  const features = Array.isArray(siteGeoJSON?.features)
    ? siteGeoJSON.features
    : [];

  const polygon = features.find(
    feature =>
      feature?.geometry?.type === "Polygon" &&
      Array.isArray(feature.geometry.coordinates?.[0])
  );

  if (!polygon) return null;

  const ring = polygon.geometry.coordinates[0]
    .map(point => [Number(point?.[0]), Number(point?.[1])])
    .filter(([lon, lat]) => Number.isFinite(lon) && Number.isFinite(lat));

  return ring.length >= 3 ? ring : null;
}

function projectGeoRingToFloor(ring, mapWidth, mapHeight) {
  if (!Array.isArray(ring) || ring.length < 3) return null;

  const longitudes = ring.map(([lon]) => lon);
  const latitudes = ring.map(([, lat]) => lat);
  const minLon = Math.min(...longitudes);
  const maxLon = Math.max(...longitudes);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const averageLat =
    latitudes.reduce((sum, value) => sum + value, 0) / latitudes.length;

  // Equirectangular projection is sufficient for a single building footprint.
  // It preserves the footprint proportions much better than treating longitude
  // and latitude degrees as equal distances.
  const metersPerDegreeLat = 111320;
  const metersPerDegreeLon =
    111320 * Math.cos((averageLat * Math.PI) / 180);

  const projected = ring.map(([lon, lat]) => [
    (lon - minLon) * metersPerDegreeLon,
    (maxLat - lat) * metersPerDegreeLat,
  ]);

  const projectedWidth = Math.max(
    1,
    (maxLon - minLon) * metersPerDegreeLon
  );
  const projectedHeight = Math.max(
    1,
    (maxLat - minLat) * metersPerDegreeLat
  );

  // Keep a small margin around the floor plan and rotate 180 degrees so the
  // geographic footprint matches the orientation of the room data already in
  // lc2.json: long horizontal wing at the bottom, vertical wing on the right.
  const horizontalPadding = Math.max(12, mapWidth * 0.012);
  const verticalPadding = Math.max(6, mapHeight * 0.015);
  const availableWidth = Math.max(1, mapWidth - horizontalPadding * 2);
  const availableHeight = Math.max(1, mapHeight - verticalPadding * 2);
  const scale = Math.min(
    availableWidth / projectedWidth,
    availableHeight / projectedHeight
  );

  const fittedWidth = projectedWidth * scale;
  const fittedHeight = projectedHeight * scale;
  const offsetX = (mapWidth - fittedWidth) / 2;
  const offsetY = (mapHeight - fittedHeight) / 2;

  return projected.map(([x, y]) => [
    offsetX + (projectedWidth - x) * scale,
    offsetY + (projectedHeight - y) * scale,
  ]);
}

function applyGeoBoundaryToFloors(floors, siteGeoJSON) {
  const geoRing = getGeoJsonRing(siteGeoJSON);

  if (!geoRing) return floors;

  return (floors || []).map(floor => {
    const width = Number(floor?.map?.width) || 1200;
    const height = Number(floor?.map?.height) || 450;
    const boundary = projectGeoRingToFloor(geoRing, width, height);

    if (!boundary) return floor;

    return {
      ...floor,
      map: {
        ...floor.map,
        boundary,
        boundarySource: "geojson",
        geographicBoundary: geoRing,
      },
    };
  });
}

export function normalizeBuildingData(buildingData) {
  const floors = applyGeoBoundaryToFloors(
    buildingData.floors || [],
    buildingData.siteGeoJSON
  );

  const floorsById = Object.fromEntries(
    floors.map(floor => [floor.id, floor])
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
      geometryParts: geometry.parts,
      geometryOutline: geometry.outline,
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
    floors,
    nodes,
    edges,
    nodeMap: Object.fromEntries(nodes.map(node => [node.id, node])),
    floorMap: floorsById,
    buildingId: buildingData.building.id,
    buildingName: buildingData.building.name,
  };
}
