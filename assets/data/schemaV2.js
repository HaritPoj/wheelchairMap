const UNIT_CATEGORY = {
  room: "room",
  corridor: "path.corridor",
  elevator: "vertical.elevator",
  entrance: "opening.entrance",
  toilet: "amenity.restroom",
  restroom: "amenity.restroom",
  stairs: "vertical.stairs",
  ramp: "vertical.ramp",
  lobby: "space.lobby",
  exit: "opening.exit",
  other: "space.other",
};

function centerOfGeometry(geometry) {
  const source = geometry || {};
  const x = Number(source.x) || 0;
  const y = Number(source.y) || 0;
  const width = Number(source.width) || 0;
  const height = Number(source.height) || 0;

  if (source.type === "rectangle") {
    return [x + width / 2, y + height / 2];
  }

  return [x, y];
}

function firstPolygonGeometry(siteGeoJSON) {
  const features = Array.isArray(siteGeoJSON?.features)
    ? siteGeoJSON.features
    : [];
  const feature = features.find(
    item =>
      item?.geometry?.type === "Polygon" &&
      Array.isArray(item.geometry.coordinates?.[0])
  );
  return feature?.geometry || null;
}

function openingTypeFor(unit) {
  if (!unit) return "opening.portal";
  if (unit.type === "entrance") return "opening.entrance";
  if (unit.type === "exit") return "opening.exit";
  if (unit.type === "elevator") return "opening.elevator_door";
  return "opening.door";
}

function shouldCreateOpening(fromUnit, toUnit) {
  if (!fromUnit || !toUnit) return false;
  if (fromUnit.levelId !== toUnit.levelId) return false;
  return fromUnit.type !== "corridor" || toUnit.type !== "corridor";
}

function transitionType(connection) {
  const vertical = connection?.transition?.type;
  if (vertical) return "vertical." + vertical;
  return "horizontal";
}

export function migrateBuildingV1ToV2(
  legacy,
  siteGeoJSON,
  options = {}
) {
  const facilityId = legacy?.building?.id || options.facilityId || "building";
  const siteId = options.siteId || "tu_rangsit";
  const siteName = options.siteName || "Thammasat University Rangsit Campus";
  const facilityName = legacy?.building?.name || facilityId;

  const levels = (legacy?.floors || []).map(floor => ({
    id: floor.id,
    facilityId,
    level: Number(floor.level),
    name: floor.name || "Floor " + floor.level,
    elevation: null,
    floorToFloorHeight: null,
    map: floor.map,
  }));

  const units = (legacy?.spaces || []).map(space => ({
    id: space.id,
    levelId: space.floorId,
    type: space.type,
    categoryId: UNIT_CATEGORY[space.type] || "space.other",
    name: space.name || space.code || space.id,
    displayName: space.name || space.code || space.id,
    code: space.code || null,
    geometry: space.geometry,
    accessibility: {
      wheelchairAccessible: space.type !== "stairs",
      doorWidth:
        space.accessibility?.doorWidth === undefined
          ? null
          : space.accessibility.doorWidth,
      threshold:
        space.accessibility?.threshold === undefined
          ? null
          : space.accessibility.threshold,
    },
  }));

  const unitById = Object.fromEntries(units.map(unit => [unit.id, unit]));
  const openingByConnectionId = {};
  const openings = [];

  for (const connection of legacy?.connections || []) {
    const fromUnit = unitById[connection.from];
    const toUnit = unitById[connection.to];
    if (!shouldCreateOpening(fromUnit, toUnit)) continue;

    const primary = fromUnit.type === "corridor" ? toUnit : fromUnit;
    const id = "opening:" + connection.id;
    openingByConnectionId[connection.id] = id;

    openings.push({
      id,
      levelId: fromUnit.levelId,
      type: openingTypeFor(primary),
      categoryId: openingTypeFor(primary),
      name: primary.name + " access",
      connects: [fromUnit.id, toUnit.id],
      geometry: null,
      accessibility: {
        wheelchairAccessible:
          fromUnit.type !== "stairs" && toUnit.type !== "stairs",
        width:
          connection.accessibility?.width === undefined
            ? primary.accessibility?.doorWidth ?? null
            : connection.accessibility.width,
        threshold: primary.accessibility?.threshold ?? null,
      },
    });
  }

  const states = units.map(unit => {
    const [x, y] = centerOfGeometry(unit.geometry);
    return {
      id: "state:" + unit.id,
      levelId: unit.levelId,
      unitId: unit.id,
      type: "state",
      geometry: {
        type: "Point",
        coordinates: [x, y],
      },
    };
  });

  const transitions = (legacy?.connections || []).map(connection => {
    const fromUnit = unitById[connection.from];
    const toUnit = unitById[connection.to];
    const type = transitionType(connection);

    return {
      id: connection.id,
      from: "state:" + connection.from,
      to: "state:" + connection.to,
      type,
      openingId: openingByConnectionId[connection.id] || null,
      routing: {
        cost: Number(connection.routing?.cost ?? 1),
      },
      accessibility: {
        wheelchairAccessible:
          type !== "vertical.stairs" &&
          fromUnit?.type !== "stairs" &&
          toUnit?.type !== "stairs",
        width:
          connection.accessibility?.width === undefined
            ? null
            : connection.accessibility.width,
        slope:
          connection.accessibility?.slope === undefined
            ? null
            : connection.accessibility.slope,
      },
    };
  });

  return {
    schemaVersion: "2.0",
    site: {
      id: siteId,
      name: siteName,
      geometry: null,
    },
    facility: {
      id: facilityId,
      siteId,
      name: facilityName,
      displayName: options.displayName || facilityName,
      description:
        legacy?.building?.description ||
        "Indoor navigation facility using the generic schema v2.",
      coordinateSystem: legacy?.building?.coordinateSystem || "local",
      geometry: firstPolygonGeometry(siteGeoJSON),
      geographicReference: siteGeoJSON || null,
    },
    levels,
    units,
    openings,
    details: [],
    pois: [],
    routing: {
      states,
      transitions,
    },
    migration: {
      sourceSchemaVersion: legacy?.schemaVersion || "1.0",
      generatedFromLegacyData: true,
    },
  };
}
