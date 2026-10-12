const EXTRA_UNITS = [
  {
    id: 'corridor_f1_center_lower_01',
    levelId: 'floor_1',
    type: 'corridor',
    categoryId: 'path.corridor',
    name: 'Central lower corridor west',
    displayName: 'Central lower corridor west',
    code: null,
    geometry: {
      type: 'point',
      x: 604,
      y: 340,
    },
    accessibility: {
      wheelchairAccessible: true,
      doorWidth: null,
      threshold: null,
    },
  },
  {
    id: 'corridor_f1_center_lower_02',
    levelId: 'floor_1',
    type: 'corridor',
    categoryId: 'path.corridor',
    name: 'Central lower corridor east',
    displayName: 'Central lower corridor east',
    code: null,
    geometry: {
      type: 'point',
      x: 650,
      y: 340,
    },
    accessibility: {
      wheelchairAccessible: true,
      doorWidth: null,
      threshold: null,
    },
  },
  {
    id: 'corridor_f1_center_upper_east',
    levelId: 'floor_1',
    type: 'corridor',
    categoryId: 'path.corridor',
    name: 'Central upper corridor east junction',
    displayName: 'Central upper corridor east junction',
    code: null,
    geometry: {
      type: 'point',
      x: 650,
      y: 272,
    },
    accessibility: {
      wheelchairAccessible: true,
      doorWidth: null,
      threshold: null,
    },
  },
];

const EXTRA_TRANSITIONS = [
  {
    id: 'lc2_alt_center_01',
    from: 'state:corridor_f1_main_junction',
    to: 'state:corridor_f1_center_lower_01',
    type: 'horizontal',
    openingId: null,
    routing: { cost: 2 },
    accessibility: {
      wheelchairAccessible: true,
      width: null,
      slope: null,
    },
  },
  {
    id: 'lc2_alt_center_02',
    from: 'state:corridor_f1_center_lower_01',
    to: 'state:corridor_f1_center_lower_02',
    type: 'horizontal',
    openingId: null,
    routing: { cost: 2 },
    accessibility: {
      wheelchairAccessible: true,
      width: null,
      slope: null,
    },
  },
  {
    id: 'lc2_alt_center_03',
    from: 'state:corridor_f1_center_lower_02',
    to: 'state:corridor_f1_center_upper_east',
    type: 'horizontal',
    openingId: null,
    routing: { cost: 2 },
    accessibility: {
      wheelchairAccessible: true,
      width: null,
      slope: null,
    },
  },
  {
    id: 'lc2_alt_center_04',
    from: 'state:corridor_f1_center_upper_east',
    to: 'state:corridor_f1_011',
    type: 'horizontal',
    openingId: null,
    routing: { cost: 2 },
    accessibility: {
      wheelchairAccessible: true,
      width: null,
      slope: null,
    },
  },
];

function stateForUnit(unit) {
  return {
    id: 'state:' + unit.id,
    levelId: unit.levelId,
    unitId: unit.id,
    type: 'state',
    geometry: {
      type: 'Point',
      coordinates: [unit.geometry.x, unit.geometry.y],
    },
  };
}

export function applyLC2RouteAlternatives(building) {
  const existingUnitIds = new Set(building.units.map(unit => unit.id));
  const existingStateIds = new Set(
    building.routing.states.map(state => state.id)
  );
  const existingTransitionIds = new Set(
    building.routing.transitions.map(transition => transition.id)
  );

  const extraUnits = EXTRA_UNITS.filter(unit => !existingUnitIds.has(unit.id));
  const extraStates = extraUnits
    .map(stateForUnit)
    .filter(state => !existingStateIds.has(state.id));
  const extraTransitions = EXTRA_TRANSITIONS.filter(
    transition => !existingTransitionIds.has(transition.id)
  );

  return {
    ...building,
    units: [...building.units, ...extraUnits],
    routing: {
      ...building.routing,
      states: [...building.routing.states, ...extraStates],
      transitions: [
        ...building.routing.transitions,
        ...extraTransitions,
      ],
    },
  };
}
