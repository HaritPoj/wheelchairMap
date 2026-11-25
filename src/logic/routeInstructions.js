import { formatDoorLeaves, getDoorMeasurements, needsDoorCaution } from './pathfinder';

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

export function getEdgeWarning(edge, destination, previous = null) {
  if (!edge || !destination) return '';

  const door = getDoorMeasurements(edge, previous, destination);
  const threshold = door ? door.threshold : numeric(destination.threshold);
  const doorWidth = door ? door.doorWidth : numeric(destination.door_width);
  const slope = numeric(edge.slope);
  const width = numeric(edge.width);

  const notices = [];
  const leaves = door && needsDoorCaution(door) ? formatDoorLeaves(door) : '';
  if (leaves) {
    notices.push(leaves);
    if (doorWidth === null) notices.push('Clear width not measured');
  }
  if (doorWidth !== null && doorWidth < 0.9) {
    notices.push('Door width ' + (doorWidth * 100).toFixed(0) +
      ' cm may not be wheelchair-accessible');
  }
  if (threshold !== null && threshold >= 0.01) {
    notices.push('Raised threshold: ' + (threshold * 100).toFixed(1) + ' cm');
  } else if (leaves && threshold !== null) {
    notices.push('Threshold height: ' + Number((threshold * 100).toFixed(1)) + ' cm');
  }
  if (notices.length > 0) return notices.join('. ') + '. Check on site.';

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

  const firstNode = nodeMap[route[1]];
  const firstDoorEdge = firstNode ? getEdge(edges, start.id, firstNode.id) : null;
  steps.push({
    key: 'start',
    icon: start.type,
    instruction: 'Start at ' + start.name,
    warning: firstNode ? getEdgeWarning(firstDoorEdge, firstNode, start) : '',
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
        warning: getEdgeWarning(edge, current, previous),
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
            target,
            nodeMap[route[end]]
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
          current,
          previous
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
          current,
          previous
        ),
        node: current,
      });
    }

    index += 1;
  }

  return steps;
}
