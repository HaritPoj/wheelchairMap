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

const SUPPORTED_TRANSITIONS = new Set([
  "elevator",
  "ramp",
  "stairs"
]);

function isNullableNumber(value) {
  return value === null ||
    value === undefined ||
    (typeof value === "number" && Number.isFinite(value));
}

function hasFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

export function validateBuildingData(data) {
  const errors = [];
  const floorIds = new Set();
  const spaceIds = new Set();

  if (!data || data.schemaVersion !== "1.0") {
    errors.push("schemaVersion must be 1.0.");
  }

  if (!data || !data.building || typeof data.building.id !== "string") {
    errors.push("building.id is required.");
  }

  if (!data || !Array.isArray(data.floors) || data.floors.length === 0) {
    errors.push("Building must contain at least one floor.");
  }

  for (const floor of data.floors || []) {
    if (!floor || typeof floor.id !== "string" || !floor.id) {
      errors.push("Floor is missing a valid id.");
      continue;
    }

    if (floorIds.has(floor.id)) {
      errors.push("Duplicate floor id: " + floor.id);
    }
    floorIds.add(floor.id);

    if (!hasFiniteNumber(floor.level)) {
      errors.push(floor.id + ": invalid floor level.");
    }

    if (!floor.map || !hasFiniteNumber(floor.map.width) || !hasFiniteNumber(floor.map.height)) {
      errors.push(floor.id + ": map width and height are required.");
    }

    if (
      floor.map &&
      floor.map.boundary !== undefined &&
      (!Array.isArray(floor.map.boundary) ||
        floor.map.boundary.some(point =>
          !Array.isArray(point) ||
          point.length !== 2 ||
          !hasFiniteNumber(point[0]) ||
          !hasFiniteNumber(point[1])
        ))
    ) {
      errors.push(floor.id + ": boundary must be an array of numeric [x, y] points.");
    }
  }

  for (const space of data.spaces || []) {
    if (!space || typeof space.id !== "string" || !space.id) {
      errors.push("Space is missing a valid id.");
      continue;
    }

    if (spaceIds.has(space.id)) {
      errors.push("Duplicate space id: " + space.id);
    }
    spaceIds.add(space.id);

    if (!floorIds.has(space.floorId)) {
      errors.push(space.id + ": references missing floor " + space.floorId);
    }

    if (!SUPPORTED_SPACE_TYPES.has(space.type)) {
      errors.push(space.id + ": unsupported space type " + space.type);
    }

    const geometry = space.geometry || {};
    if (
      (geometry.type !== "point" && geometry.type !== "rectangle") ||
      !hasFiniteNumber(geometry.x) ||
      !hasFiniteNumber(geometry.y)
    ) {
      errors.push(space.id + ": invalid geometry.");
    }

    if (geometry.type === "rectangle" &&
        (!hasFiniteNumber(geometry.width) || !hasFiniteNumber(geometry.height))) {
      errors.push(space.id + ": rectangle geometry requires width and height.");
    }

    if (geometry.parts !== undefined) {
      if (
        !Array.isArray(geometry.parts) ||
        geometry.parts.length === 0 ||
        geometry.parts.some(part =>
          !part ||
          !hasFiniteNumber(part.x) ||
          !hasFiniteNumber(part.y) ||
          !hasFiniteNumber(part.width) ||
          !hasFiniteNumber(part.height) ||
          part.width <= 0 ||
          part.height <= 0
        )
      ) {
        errors.push(space.id + ": geometry.parts must contain positive rectangle parts.");
      }
      if (
        !Array.isArray(geometry.outline) ||
        geometry.outline.length < 3 ||
        geometry.outline.some(point =>
          !Array.isArray(point) ||
          point.length !== 2 ||
          !hasFiniteNumber(point[0]) ||
          !hasFiniteNumber(point[1])
        )
      ) {
        errors.push(space.id + ": multipart geometry requires a numeric outline.");
      }
    }

    const accessibility = space.accessibility || {};
    for (const field of ["doorWidth", "threshold"]) {
      if (field in accessibility && !isNullableNumber(accessibility[field])) {
        errors.push(space.id + ": invalid accessibility." + field);
      }
    }
  }

  for (const connection of data.connections || []) {
    if (!connection || typeof connection.from !== "string" || typeof connection.to !== "string") {
      errors.push("Connection must contain from and to.");
      continue;
    }

    if (!spaceIds.has(connection.from)) {
      errors.push("Connection references missing space: " + connection.from);
    }
    if (!spaceIds.has(connection.to)) {
      errors.push("Connection references missing space: " + connection.to);
    }

    const cost = connection.routing && connection.routing.cost;
    if (!hasFiniteNumber(cost) || cost < 0) {
      errors.push(connection.id + ": routing.cost must be a non-negative number.");
    }

    const accessibility = connection.accessibility || {};
    for (const field of ["width", "slope"]) {
      if (field in accessibility && !isNullableNumber(accessibility[field])) {
        errors.push(connection.id + ": invalid accessibility." + field);
      }
    }

    if (connection.transition) {
      const transitionType = connection.transition.type;
      if (!SUPPORTED_TRANSITIONS.has(transitionType)) {
        errors.push(connection.id + ": unsupported transition type " + transitionType);
      }
    }

    const fromSpace = data.spaces.find(space => space.id === connection.from);
    const toSpace = data.spaces.find(space => space.id === connection.to);

    if (fromSpace && toSpace) {
      const fromFloor = data.floors.find(floor => floor.id === fromSpace.floorId);
      const toFloor = data.floors.find(floor => floor.id === toSpace.floorId);

      if (fromFloor && toFloor && fromFloor.id !== toFloor.id) {
        if (!connection.transition || !connection.transition.type) {
          errors.push(
            connection.id + ": cross-floor connection must declare transition.type."
          );
        }
      }
    }
  }

  return errors;
}
