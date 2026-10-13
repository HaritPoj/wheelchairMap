const SUPPORTED_UNIT_TYPES = new Set([
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

  return {
    x: source.type === "rectangle" ? x + width / 2 : x,
    y: source.type === "rectangle" ? y + height / 2 : y,
    width,
    height,
    parts: Array.isArray(source.parts) ? source.parts : null,
    outline: Array.isArray(source.outline) ? source.outline : null,
  };
}

function getGeographicRing(buildingData) {
  const geometry = buildingData?.facility?.geometry;
  if (
    geometry?.type !== "Polygon" ||
    !Array.isArray(geometry.coordinates?.[0])
  ) {
    return null;
  }

  const ring = geometry.coordinates[0]
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

  // LC2 Floor 1 is drawn in the same orientation as the directory board.
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
  const scale = Math.min(targetWidth / sourceWidth, targetHeight / sourceHeight);

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
    return { ...geometry, x, y };
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

function prepareLevels(levels, buildingData) {
  const geoRing = getGeographicRing(buildingData);
  const geometryTransforms = {};

  const nextLevels = (levels || []).map(level => {
    // The surveyed GeoJSON supplied for LC2 represents Floor 1 only.
    if (!geoRing || Number(level?.level) !== 1) return level;

    const width = Number(level?.map?.width) || 1200;
    const height = Number(level?.map?.height) || 450;
    const sourceBoundary = Array.isArray(level?.map?.boundary)
      ? level.map.boundary
      : null;
    const targetBoundary = projectGeoRingToFloor(geoRing, width, height);
    if (!targetBoundary) return level;

    const layoutTransform = createLayoutTransform(sourceBoundary, targetBoundary);
    if (layoutTransform) geometryTransforms[level.id] = layoutTransform;

    return {
      ...level,
      map: {
        ...level.map,
        boundary: targetBoundary,
        boundarySource: "facility.geojson",
        geographicBoundary: geoRing,
        sourceBoundary,
        layoutFittedToGeoJSON: Boolean(layoutTransform),
      },
    };
  });

  return { levels: nextLevels, geometryTransforms };
}

function legacyTransitionType(type) {
  if (typeof type !== "string") return undefined;
  if (!type.startsWith("vertical.")) return undefined;
  return type.slice("vertical.".length);
}

export function normalizeBuildingData(buildingData) {
  const prepared = prepareLevels(buildingData.levels || [], buildingData);
  const levels = prepared.levels;
  const levelMap = Object.fromEntries(levels.map(level => [level.id, level]));

  const nodes = (buildingData.units || []).map(unit => {
    const level = levelMap[unit.levelId];
    const transform = prepared.geometryTransforms[unit.levelId] || null;
    const transformedGeometry = transformGeometry(unit.geometry, transform);
    const geometry = geometryToNodeFields(transformedGeometry);
    const accessibility = unit.accessibility || {};

    return {
      id: unit.id,
      name: unit.name || unit.displayName || unit.code || unit.id,
      label: unit.displayName || unit.name || unit.code || unit.id,
      code: unit.code || null,
      floorId: unit.levelId,
      floor: level ? Number(level.level) : null,
      x: geometry.x,
      y: geometry.y,
      width: geometry.width,
      height: geometry.height,
      geometryParts: geometry.parts,
      geometryOutline: geometry.outline,
      type: SUPPORTED_UNIT_TYPES.has(unit.type) ? unit.type : "other",
      categoryId: unit.categoryId || null,
      door_width:
        accessibility.doorWidth === undefined ? null : accessibility.doorWidth,
      threshold:
        accessibility.threshold === undefined ? null : accessibility.threshold,
      accessibility,
    };
  });

  const stateMap = Object.fromEntries(
    (buildingData.routing?.states || []).map(state => [state.id, state])
  );

  const edges = (buildingData.routing?.transitions || [])
    .map(transition => {
      const fromState = stateMap[transition.from];
      const toState = stateMap[transition.to];
      if (!fromState?.unitId || !toState?.unitId) return null;

      return {
        id: transition.id,
        from: fromState.unitId,
        to: toState.unitId,
        weight: Number(transition.routing?.cost ?? 1),
        width:
          transition.accessibility?.width === undefined
            ? null
            : transition.accessibility.width,
        slope:
          transition.accessibility?.slope === undefined
            ? null
            : transition.accessibility.slope,
        wheelchairAccessible:
          transition.accessibility?.wheelchairAccessible !== false,
        openingId: transition.openingId || null,
        transition: legacyTransitionType(transition.type),
      };
    })
    .filter(Boolean);

  const floors = levels.map(level => ({
    id: level.id,
    level: Number(level.level),
    name: level.name,
    elevation: level.elevation,
    floorToFloorHeight: level.floorToFloorHeight,
    map: level.map,
  }));

  return {
    ...buildingData,
    floors,
    nodes,
    edges,
    nodeMap: Object.fromEntries(nodes.map(node => [node.id, node])),
    floorMap: Object.fromEntries(floors.map(floor => [floor.id, floor])),
    buildingId: buildingData.facility.id,
    buildingName: buildingData.facility.name,
  };
}
