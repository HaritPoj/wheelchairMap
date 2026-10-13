function decodeXml(value = '') {
  return String(value)
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function parseAttributes(source = '') {
  const attrs = {};
  const pattern = /([\w:-]+)\s*=\s*"([^"]*)"/g;
  let match;

  while ((match = pattern.exec(source)) !== null) {
    attrs[match[1]] = decodeXml(match[2]);
  }

  return attrs;
}

function localAttr(attrs, name, fallback = null) {
  if (attrs[name] !== undefined) return attrs[name];
  const key = Object.keys(attrs).find(item => item.endsWith(':' + name));
  return key ? attrs[key] : fallback;
}

function numberOrNull(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function booleanValue(value, fallback = true) {
  if (value === null || value === undefined || value === '') return fallback;
  return String(value).toLowerCase() !== 'false';
}

function textContent(block, localName) {
  const pattern = new RegExp(
    '<(?:[\\w-]+:)?' + localName + '[^>]*>([\\s\\S]*?)<\\/(?:[\\w-]+:)?' + localName + '>',
    'i'
  );
  const match = block.match(pattern);
  return match ? decodeXml(match[1].replace(/<[^>]+>/g, '').trim()) : null;
}

function elementBlocks(xml, localName) {
  const pattern = new RegExp(
    '<(?:[\\w-]+:)?' + localName + '\\b([^>]*)>([\\s\\S]*?)<\\/(?:[\\w-]+:)?' + localName + '>',
    'gi'
  );
  const blocks = [];
  let match;

  while ((match = pattern.exec(xml)) !== null) {
    blocks.push({ attrs: parseAttributes(match[1]), body: match[2] });
  }

  return blocks;
}

function selfClosingElements(xml, localName) {
  const pattern = new RegExp(
    '<(?:[\\w-]+:)?' + localName + '\\b([^>]*)\\/\\s*>',
    'gi'
  );
  const elements = [];
  let match;

  while ((match = pattern.exec(xml)) !== null) {
    elements.push({ attrs: parseAttributes(match[1]) });
  }

  return elements;
}

function parseBoundary(value) {
  if (!value) return [];
  return String(value)
    .trim()
    .split(/\s+/)
    .map(pair => pair.split(',').map(Number))
    .filter(point => point.length === 2 && point.every(Number.isFinite));
}

function parseRectangle(body) {
  const match = body.match(/<(?:[\w-]+:)?Rectangle\b([^>]*)\/?\s*>/i);
  if (!match) return null;
  const attrs = parseAttributes(match[1]);
  return {
    type: 'rectangle',
    x: Number(localAttr(attrs, 'x', 0)),
    y: Number(localAttr(attrs, 'y', 0)),
    width: Number(localAttr(attrs, 'width', 0)),
    height: Number(localAttr(attrs, 'height', 0)),
  };
}

function parsePoint(body, attrs = {}) {
  const xAttr = numberOrNull(localAttr(attrs, 'x'));
  const yAttr = numberOrNull(localAttr(attrs, 'y'));
  if (xAttr !== null && yAttr !== null) {
    return { type: 'point', x: xAttr, y: yAttr };
  }

  const pos = textContent(body, 'pos');
  if (!pos) return { type: 'point', x: 0, y: 0 };
  const values = pos.trim().split(/\s+/).map(Number);
  return {
    type: 'point',
    x: Number.isFinite(values[0]) ? values[0] : 0,
    y: Number.isFinite(values[1]) ? values[1] : 0,
  };
}

export function parseIndoorGML(xmlText) {
  if (typeof xmlText !== 'string' || !xmlText.includes('IndoorFeatures')) {
    throw new Error('Invalid IndoorGML document: IndoorFeatures root is missing.');
  }

  const rootMatch = xmlText.match(/<(?:[\w-]+:)?IndoorFeatures\b([^>]*)>/i);
  const rootAttrs = parseAttributes(rootMatch?.[1] || '');
  const buildingId = localAttr(rootAttrs, 'id', 'lc2');
  const buildingName = textContent(xmlText, 'name') || 'LC2';

  const floors = selfClosingElements(xmlText, 'Level').map(({ attrs }) => ({
    id: localAttr(attrs, 'id'),
    level: Number(localAttr(attrs, 'number', 0)),
    name: localAttr(attrs, 'name') || localAttr(attrs, 'id'),
    map: {
      width: Number(localAttr(attrs, 'width', 1200)),
      height: Number(localAttr(attrs, 'height', 450)),
      boundary: parseBoundary(localAttr(attrs, 'boundary', '')),
    },
  }));

  const cellSpaces = elementBlocks(xmlText, 'CellSpace').map(({ attrs, body }) => {
    const id = localAttr(attrs, 'id');
    const type = localAttr(attrs, 'category', 'other');
    const accessibility = {
      wheelchairAccessible: booleanValue(localAttr(attrs, 'wheelchairAccessible'), true),
      doorWidth: numberOrNull(localAttr(attrs, 'doorWidth')),
      threshold: numberOrNull(localAttr(attrs, 'threshold')),
    };

    return {
      id,
      type,
      floorId: localAttr(attrs, 'levelId'),
      name: textContent(body, 'name') || localAttr(attrs, 'name') || id,
      code: localAttr(attrs, 'code'),
      geometry: parseRectangle(body) || parsePoint(body, attrs),
      accessibility,
    };
  });

  const routingStates = selfClosingElements(xmlText, 'State').map(({ attrs }) => ({
    id: localAttr(attrs, 'id'),
    type: 'corridor',
    floorId: localAttr(attrs, 'levelId'),
    name: localAttr(attrs, 'name') || localAttr(attrs, 'id'),
    geometry: {
      type: 'point',
      x: Number(localAttr(attrs, 'x', 0)),
      y: Number(localAttr(attrs, 'y', 0)),
    },
    accessibility: {
      wheelchairAccessible: booleanValue(localAttr(attrs, 'wheelchairAccessible'), true),
      doorWidth: null,
      threshold: null,
    },
  }));

  const connections = selfClosingElements(xmlText, 'Transition').map(({ attrs }) => {
    const transitionType = localAttr(attrs, 'transitionType');
    const width = numberOrNull(localAttr(attrs, 'width'));
    const slope = numberOrNull(localAttr(attrs, 'slope'));

    return {
      id: localAttr(attrs, 'id'),
      from: localAttr(attrs, 'from'),
      to: localAttr(attrs, 'to'),
      routing: {
        cost: Number(localAttr(attrs, 'cost', 1)),
      },
      accessibility: {
        wheelchairAccessible: booleanValue(localAttr(attrs, 'wheelchairAccessible'), true),
        width,
        slope,
      },
      ...(transitionType ? { transition: { type: transitionType } } : {}),
    };
  });

  return {
    schemaVersion: '1.0',
    sourceFormat: 'IndoorGML-GML',
    building: {
      id: buildingId,
      name: buildingName,
      coordinateSystem: localAttr(rootAttrs, 'coordinateSystem', 'local'),
      description: 'Parsed directly from IndoorGML XML/GML.',
    },
    floors,
    spaces: [...cellSpaces, ...routingStates],
    connections,
  };
}
