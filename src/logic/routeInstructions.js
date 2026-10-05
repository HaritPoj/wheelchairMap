function getEdge(edges, fromId, toId) {
  return edges.find(edge =>
    (edge.from === fromId && edge.to === toId) ||
    (edge.to === fromId && edge.from === toId)
  ) || null;
}

function numeric(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function getEdgeWarning(edge, destination) {
  if (!edge || !destination) return '';

  const threshold = numeric(destination.threshold);
  const doorWidth = numeric(destination.door_width);
  const slope = numeric(edge.slope);
  const width = numeric(edge.width);

  if (threshold !== null && threshold >= 0.02) {
    return 'Threshold ahead: ' + (threshold * 100).toFixed(0) + ' cm';
  }

  if (doorWidth !== null && doorWidth < 0.9) {
    return 'Narrow door ahead: ' + doorWidth.toFixed(2) + ' m';
  }

  if (slope !== null && slope >= 3) {
    return 'Steep slope ahead: ' + slope.toFixed(1) + '°';
  }

  if (width !== null && width < 1.2) {
    return 'Corridor width: ' + width.toFixed(2) + ' m';
  }

  return '';
}

export function generateRouteSteps(route, nodeMap, edges) {
  if (!route || route.length < 2) return [];

  const steps = [];
  const start = nodeMap[route[0]];

  if (!start) return [];

  steps.push({
    key: 'start',
    icon: start.type,
    instruction: 'Start at ' + start.name,
    warning: '',
    node: start,
  });

  let index = 1;

  while (index < route.length) {
    const current = nodeMap[route[index]];
    const previous = nodeMap[route[index - 1]];

    if (!current || !previous) {
      index += 1;
      continue;
    }

    if (previous.floor !== current.floor) {
      const edge = getEdge(edges, previous.id, current.id);
      const transitionType = edge ? edge.transition : null;
      let instruction = 'Continue to Floor ' + current.floor;

      if (transitionType === 'elevator') {
        instruction = 'Take the elevator to Floor ' + current.floor;
      } else if (transitionType === 'ramp') {
        instruction = 'Follow the accessible ramp to Floor ' + current.floor;
      }

      steps.push({
        key: 'floor-' + index,
        icon: transitionType || 'corridor',
        instruction,
        warning: getEdgeWarning(edge, current),
        node: current,
      });
      index += 1;
      continue;
    }

    if (current.type === 'corridor') {
      let end = index;

      while (
        end + 1 < route.length &&
        nodeMap[route[end + 1]] &&
        nodeMap[route[end + 1]].type === 'corridor' &&
        nodeMap[route[end + 1]].floor === current.floor
      ) {
        end += 1;
      }

      const target = nodeMap[route[end + 1]];

      if (target) {
        steps.push({
          key: 'corridor-' + index,
          icon: target.type,
          instruction: 'Follow the accessible corridor to ' + target.name,
          warning: getEdgeWarning(
            getEdge(edges, route[end], target.id),
            target
          ),
          node: target,
        });

        index = end + 1;
        continue;
      }
    }

    if (index === route.length - 1) {
      steps.push({
        key: 'arrival',
        icon: current.type,
        instruction: 'Arrive at ' + current.name,
        warning: getEdgeWarning(
          getEdge(edges, previous.id, current.id),
          current
        ),
        node: current,
      });
    } else if (current.type === 'elevator') {
      steps.push({
        key: 'elevator-' + index,
        icon: 'elevator',
        instruction: 'Enter ' + current.name,
        warning: '',
        node: current,
      });
    } else {
      steps.push({
        key: 'node-' + index,
        icon: current.type,
        instruction: 'Continue to ' + current.name,
        warning: getEdgeWarning(
          getEdge(edges, previous.id, current.id),
          current
        ),
        node: current,
      });
    }

    index += 1;
  }

  return steps;
}
