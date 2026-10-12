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

function getBounds(points) {
  const xs = points.map(([x]) => Number(x));
  const ys = points.map(([, y]) => Number(y));

  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
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

  // Equirectangular projection is accurate enough at one-building scale and
  // keeps the real footprint proportions from the supplied GeoJSON.
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

  // Rotate 180 degrees so the real footprint matches the directory-board
  // orientation used by the existing Floor 1 room data: the long wing runs
  // left-to-right and the tall wing is on the right.
  return projected.map(([x, y]) => [
    offsetX + (projectedWidth - x) * scale,
    offsetY + (projectedHeight - y) * scale,
  ]);
}

function createLayoutTransform(sourceBoundary, targetBoundary) {
  if (
    !Array.isArray(sourceBoundary) ||
    sourceBoundary.length < 3 ||
    !Array.isArray(targetBoundary) ||
    targetBoundary.length < 3
  ) {
    return null;
  }

  const source = getBounds(sourceBoundary);
  const target = getBounds(targetBoundary);
  const sourceWidth = Math.max(1, source.maxX - source.minX);
  const sourceHeight = Math.max(1, source.maxY - source.minY);
  const targetWidth = Math.max(1, target.maxX - target.minX);
  const targetHeight = Math.max(1, target.maxY - target.minY);

  // Uniform scaling preserves all room proportions from the photographed
  // directory layout while moving the entire floor plan inside the GeoJSON
  // footprint. This prevents rooms/facilities from "splitting out" beyond the
  // building outline.
  const scale = Math.min(
    targetWidth / sourceWidth,
    targetHeight / sourceHeight
  );

  const sourceCenterX = (source.minX + source.maxX) / 2;
  const sourceCenterY = (source.minY + source.maxY) / 2;
  const targetCenterX = (target.minX + target.maxX) / 2;
  const targetCenterY = (target.minY + target.maxY) / 2;

  return {
    scale,
    point(x, y) {
      return [
        targetCenterX + (Number(x) - sourceCenterX) * scale,
        targetCenterY + (Number(y) - sourceCenterY) * scale,
      ];
    },
  };
}

function transformRect(rect, transform) {
  const x = Number(rect?.x) || 0;
  const y = Number(rect?.y) || 0;
  const width = Number(rect?.width) || 0;
  const height = Number(rect?.height) || 0;
  const [x1, y1] = transform.point(x, y);
  const [x2, y2] = transform.point(x + width, y + height);

  return {
    ...rect,
    x: Math.min(x1, x2),
    y: Math.min(y1, y2),
    width: Math.abs(x2 - x1),
    height: Math.abs(y2 - y1),
  };
}

function transformGeometry(geometry, transform) {
  if (!geometry || !transform) return geometry;

  if (geometry.type === "point") {
    const [x, y] = transform.point(geometry.x, geometry.y);
    return {
      ...geometry,
      x,
      y,
    };
  }

  if (geometry.type === "rectangle") {
    const result = transformRect(geometry, transform);

    if (Array.isArray(geometry.parts)) {
      result.parts = geometry.parts.map(part => transformRect(part, transform));
    }

    if (Array.isArray(geometry.outline)) {
      result.outline = geometry.outline.map(([x, y]) => transform.point(x, y));
    }

    return result;
  }

  return geometry;
}

function prepareFloors(floors, siteGeoJSON) {
  const geoRing = getGeoJsonRing(siteGeoJSON);
  const geometryTransforms = {};

  if (!geoRing) {
    return {
      floors: floors || [],
      geometryTransforms,
    };
  }

  const nextFloors = (floors || []).map(floor => {
    // The supplied surveyed polygon and directory-board reference are only
    // for Floor 1. Floor 2 keeps its original hand-traced outline.
    if (Number(floor?.level) !== 1) {
      return floor;
    }

    const width = Number(floor?.map?.width) || 1200;
    const height = Number(floor?.map?.height) || 450;
    const sourceBoundary = Array.isArray(floor?.map?.boundary)
      ? floor.map.boundary
      : null;
    const targetBoundary = projectGeoRingToFloor(geoRing, width, height);

    if (!targetBoundary) return floor;

    const layoutTransform = createLayoutTransform(
      sourceBoundary,
      targetBoundary
    );

    if (layoutTransform) {
      geometryTransforms[floor.id] = layoutTransform;
    }

    return {
      ...floor,
      map: {
        ...floor.map,
        boundary: targetBoundary,
        boundarySource: "geojson",
        geographicBoundary: geoRing,
        sourceBoundary,
        layoutFittedToGeoJSON: Boolean(layoutTransform),
      },
    };
  });

  return {
    floors: nextFloors,
    geometryTransforms,
  };
}

export function normalizeBuildingData(buildingData) {
  const prepared = prepareFloors(
    buildingData.floors || [],
    buildingData.siteGeoJSON
  );
  const floors = prepared.floors;
  const floorsById = Object.fromEntries(
    floors.map(floor => [floor.id, floor])
  );

  const nodes = (buildingData.spaces || []).map(space => {
    const floor = floorsById[space.floorId];
    const layoutTransform = prepared.geometryTransforms[space.floorId] || null;
    const transformedGeometry = transformGeometry(
      space.geometry,
      layoutTransform
    );
    const geometry = geometryToNodeFields(transformedGeometry);
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
