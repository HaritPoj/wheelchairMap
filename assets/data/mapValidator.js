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

function finite(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function nullableNumber(value) {
  return value === null || value === undefined || finite(value);
}

function validateLocalGeometry(geometry, id, errors) {
  if (!geometry || (geometry.type !== "point" && geometry.type !== "rectangle")) {
    errors.push(id + ": geometry must be point or rectangle.");
    return;
  }

  if (!finite(geometry.x) || !finite(geometry.y)) {
    errors.push(id + ": geometry requires numeric x and y.");
  }

  if (
    geometry.type === "rectangle" &&
    (!finite(geometry.width) || !finite(geometry.height))
  ) {
    errors.push(id + ": rectangle requires numeric width and height.");
  }

  if (geometry.parts !== undefined) {
    if (
      !Array.isArray(geometry.parts) ||
      geometry.parts.length === 0 ||
      geometry.parts.some(part =>
        !part ||
        !finite(part.x) ||
        !finite(part.y) ||
        !finite(part.width) ||
        !finite(part.height) ||
        part.width <= 0 ||
        part.height <= 0
      )
    ) {
      errors.push(id + ": geometry.parts must contain positive rectangles.");
    }

    if (
      !Array.isArray(geometry.outline) ||
      geometry.outline.length < 3 ||
      geometry.outline.some(point =>
        !Array.isArray(point) ||
        point.length !== 2 ||
        !finite(point[0]) ||
        !finite(point[1])
      )
    ) {
      errors.push(id + ": multipart geometry requires a numeric outline.");
    }
  }
}

export function validateBuildingData(data) {
  const errors = [];
  const levelIds = new Set();
  const unitIds = new Set();
  const openingIds = new Set();
  const stateIds = new Set();

  if (!data || data.schemaVersion !== "2.0") {
    errors.push("schemaVersion must be 2.0.");
  }

  if (!data?.site || typeof data.site.id !== "string") {
    errors.push("site.id is required.");
  }

  if (!data?.facility || typeof data.facility.id !== "string") {
    errors.push("facility.id is required.");
  }

  if (data?.facility?.siteId !== data?.site?.id) {
    errors.push("facility.siteId must reference site.id.");
  }

  if (
    data?.facility?.geometry !== null &&
    data?.facility?.geometry !== undefined &&
    (data.facility.geometry.type !== "Polygon" ||
      !Array.isArray(data.facility.geometry.coordinates?.[0]) ||
      data.facility.geometry.coordinates[0].length < 3)
  ) {
    errors.push("facility.geometry must be a GeoJSON Polygon or null.");
  }

  if (!Array.isArray(data?.levels) || data.levels.length === 0) {
    errors.push("Facility must contain at least one level.");
  }

  for (const level of data?.levels || []) {
    if (!level?.id || typeof level.id !== "string") {
      errors.push("Level is missing id.");
      continue;
    }
    if (levelIds.has(level.id)) errors.push("Duplicate level id: " + level.id);
    levelIds.add(level.id);

    if (level.facilityId !== data.facility?.id) {
      errors.push(level.id + ": facilityId does not match facility.id.");
    }
    if (!finite(level.level)) errors.push(level.id + ": invalid level number.");
    if (!level.map || !finite(level.map.width) || !finite(level.map.height)) {
      errors.push(level.id + ": map width and height are required.");
    }
    if (
      level.map?.boundary !== undefined &&
      (!Array.isArray(level.map.boundary) ||
        level.map.boundary.length < 3 ||
        level.map.boundary.some(point =>
          !Array.isArray(point) ||
          point.length !== 2 ||
          !finite(point[0]) ||
          !finite(point[1])
        ))
    ) {
      errors.push(level.id + ": map.boundary must be numeric [x,y] points.");
    }
  }

  if (!Array.isArray(data?.units)) errors.push("units must be an array.");

  for (const unit of data?.units || []) {
    if (!unit?.id || typeof unit.id !== "string") {
      errors.push("Unit is missing id.");
      continue;
    }
    if (unitIds.has(unit.id)) errors.push("Duplicate unit id: " + unit.id);
    unitIds.add(unit.id);

    if (!levelIds.has(unit.levelId)) {
      errors.push(unit.id + ": references missing level " + unit.levelId);
    }
    if (!SUPPORTED_UNIT_TYPES.has(unit.type)) {
      errors.push(unit.id + ": unsupported unit type " + unit.type);
    }
    if (typeof unit.categoryId !== "string" || !unit.categoryId) {
      errors.push(unit.id + ": categoryId is required.");
    }
    validateLocalGeometry(unit.geometry, unit.id, errors);

    const accessibility = unit.accessibility || {};
    if (
      accessibility.wheelchairAccessible !== undefined &&
      typeof accessibility.wheelchairAccessible !== "boolean"
    ) {
      errors.push(unit.id + ": wheelchairAccessible must be boolean.");
    }
    for (const field of ["doorWidth", "threshold"]) {
      if (field in accessibility && !nullableNumber(accessibility[field])) {
        errors.push(unit.id + ": invalid accessibility." + field);
      }
    }
  }

  if (!Array.isArray(data?.openings)) errors.push("openings must be an array.");

  for (const opening of data?.openings || []) {
    if (!opening?.id || typeof opening.id !== "string") {
      errors.push("Opening is missing id.");
      continue;
    }
    if (openingIds.has(opening.id)) {
      errors.push("Duplicate opening id: " + opening.id);
    }
    openingIds.add(opening.id);

    if (!levelIds.has(opening.levelId)) {
      errors.push(opening.id + ": references missing level " + opening.levelId);
    }
    if (!Array.isArray(opening.connects) || opening.connects.length !== 2) {
      errors.push(opening.id + ": connects must contain exactly two unit ids.");
    } else {
      for (const unitId of opening.connects) {
        if (!unitIds.has(unitId)) {
          errors.push(opening.id + ": references missing unit " + unitId);
        }
      }
    }
  }

  for (const collectionName of ["details", "pois"]) {
    if (!Array.isArray(data?.[collectionName])) {
      errors.push(collectionName + " must be an array.");
    }
  }

  if (!data?.routing || !Array.isArray(data.routing.states)) {
    errors.push("routing.states must be an array.");
  }
  if (!data?.routing || !Array.isArray(data.routing.transitions)) {
    errors.push("routing.transitions must be an array.");
  }

  for (const state of data?.routing?.states || []) {
    if (!state?.id || typeof state.id !== "string") {
      errors.push("Routing state is missing id.");
      continue;
    }
    if (stateIds.has(state.id)) errors.push("Duplicate state id: " + state.id);
    stateIds.add(state.id);

    if (!levelIds.has(state.levelId)) {
      errors.push(state.id + ": references missing level " + state.levelId);
    }
    if (!unitIds.has(state.unitId)) {
      errors.push(state.id + ": references missing unit " + state.unitId);
    }
    if (
      state.geometry?.type !== "Point" ||
      !Array.isArray(state.geometry.coordinates) ||
      state.geometry.coordinates.length !== 2 ||
      !finite(state.geometry.coordinates[0]) ||
      !finite(state.geometry.coordinates[1])
    ) {
      errors.push(state.id + ": geometry must be a numeric GeoJSON Point.");
    }
  }

  const stateById = Object.fromEntries(
    (data?.routing?.states || []).map(state => [state.id, state])
  );

  for (const transition of data?.routing?.transitions || []) {
    if (!transition?.id || typeof transition.id !== "string") {
      errors.push("Routing transition is missing id.");
      continue;
    }
    if (!stateIds.has(transition.from)) {
      errors.push(transition.id + ": missing from state " + transition.from);
    }
    if (!stateIds.has(transition.to)) {
      errors.push(transition.id + ": missing to state " + transition.to);
    }
    if (!finite(transition.routing?.cost) || transition.routing.cost < 0) {
      errors.push(transition.id + ": routing.cost must be non-negative.");
    }

    if (transition.openingId && !openingIds.has(transition.openingId)) {
      errors.push(transition.id + ": references missing opening " + transition.openingId);
    }

    const accessibility = transition.accessibility || {};
    if (
      accessibility.wheelchairAccessible !== undefined &&
      typeof accessibility.wheelchairAccessible !== "boolean"
    ) {
      errors.push(transition.id + ": wheelchairAccessible must be boolean.");
    }
    for (const field of ["width", "slope"]) {
      if (field in accessibility && !nullableNumber(accessibility[field])) {
        errors.push(transition.id + ": invalid accessibility." + field);
      }
    }

    const fromState = stateById[transition.from];
    const toState = stateById[transition.to];
    if (
      fromState &&
      toState &&
      fromState.levelId !== toState.levelId &&
      !String(transition.type || "").startsWith("vertical.")
    ) {
      errors.push(
        transition.id + ": cross-level transition must use a vertical.* type."
      );
    }
  }

  return errors;
}
