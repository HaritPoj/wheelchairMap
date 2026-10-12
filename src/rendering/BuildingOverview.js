import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Svg, {
  Circle,
  ClipPath,
  Defs,
  G,
  Line,
  Path,
  Polygon,
  Rect,
  Text as SvgText,
} from 'react-native-svg';

const VIEW_WIDTH = 1000;
const VIEW_HEIGHT = 650;
const MAP_BG = '#F7F8FA';
const BUILDING_FILL = '#E7EBF0';
const BUILDING_STROKE = '#D0D7DF';
const ROAD = '#B3C4D5';
const WALKWAY = '#58B89C';
const LABEL = '#667786';
const PIN = '#EA4335';

const LC2_TARGET = { x: 175, y: 270, width: 665, height: 220 };

function getBounds(points) {
  const xs = points.map(point => Number(point[0]) || 0);
  const ys = points.map(point => Number(point[1]) || 0);
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
}

function createIndoorToCampusTransform(points) {
  const sourcePoints =
    Array.isArray(points) && points.length >= 3
      ? points
      : [
          [14, 368],
          [1201, 368],
          [1201, 0],
          [1089, 0],
          [1089, 260],
          [14, 260],
        ];

  const bounds = getBounds(sourcePoints);
  const sourceWidth = Math.max(1, bounds.maxX - bounds.minX);
  const sourceHeight = Math.max(1, bounds.maxY - bounds.minY);
  const scale = Math.min(
    LC2_TARGET.width / sourceWidth,
    LC2_TARGET.height / sourceHeight
  );
  const fittedWidth = sourceWidth * scale;
  const fittedHeight = sourceHeight * scale;
  const offsetX = LC2_TARGET.x + (LC2_TARGET.width - fittedWidth) / 2;
  const offsetY = LC2_TARGET.y + (LC2_TARGET.height - fittedHeight) / 2;

  function point(x, y) {
    const px = Number(x) || 0;
    const py = Number(y) || 0;
    return [
      offsetX + (bounds.maxX - px) * scale,
      offsetY + (bounds.maxY - py) * scale,
    ];
  }

  return {
    scale,
    point,
    boundary: sourcePoints.map(([x, y]) => point(x, y)),
  };
}

function pointsToString(points, transformX, transformY) {
  return points
    .map(([x, y]) => `${transformX(x)},${transformY(y)}`)
    .join(' ');
}

function roomFill(type) {
  if (type === 'elevator') return '#DCEBFF';
  if (type === 'stairs') return '#E5E7EB';
  if (type === 'toilet' || type === 'restroom') return '#DDF4EE';
  if (type === 'corridor') return '#F2F5F8';
  return '#FFFFFF';
}

function roomStroke(type) {
  if (type === 'elevator') return '#4B83C4';
  if (type === 'toilet' || type === 'restroom') return '#4A9D87';
  if (type === 'stairs') return '#8A94A3';
  if (type === 'corridor') return '#C5CDD6';
  return '#8E99A8';
}

const CAMPUS_BUILDINGS = [
  { x: 555, y: 45, width: 68, height: 62 },
  { x: 730, y: 35, width: 88, height: 130 },
  { x: 830, y: 26, width: 58, height: 148 },
  { x: 900, y: 30, width: 48, height: 160 },
  { x: 760, y: 170, width: 72, height: 62 },
  { x: 847, y: 175, width: 68, height: 55 },
  { x: 74, y: 78, width: 92, height: 112 },
  { x: 190, y: 58, width: 44, height: 138 },
  { x: 248, y: 50, width: 45, height: 146 },
  { x: 307, y: 58, width: 45, height: 136 },
  { x: 70, y: 515, width: 120, height: 80 },
  { x: 245, y: 522, width: 205, height: 78 },
  { x: 535, y: 515, width: 162, height: 82 },
  { x: 780, y: 500, width: 175, height: 92 },
];

const FOOTPATHS = [
  [[330, 150], [455, 150], [470, 198]],
  [[475, 215], [475, 270]],
  [[475, 490], [475, 535]],
  [[455, 535], [645, 535], [695, 585]],
  [[695, 585], [915, 585]],
  [[915, 585], [915, 430]],
  [[825, 430], [915, 430]],
  [[210, 462], [340, 462], [385, 420]],
];

export default function BuildingOverview({ mapData, onOpenFloor }) {
  const [zoom, setZoom] = useState(1);
  const buildingName = mapData.buildingName || 'LC2';
  const groundFloor = mapData.floors?.[0];
  const groundFloorLevel = Number(groundFloor?.level ?? 1);

  const indoorTransform = useMemo(
    () => createIndoorToCampusTransform(groundFloor?.map?.boundary),
    [groundFloor]
  );
  const footprint = indoorTransform.boundary;
  const groundFloorNodes = useMemo(
    () =>
      mapData.nodes.filter(
        node =>
          Number(node.floor) === groundFloorLevel &&
          Number(node.width) > 0 &&
          Number(node.height) > 0
      ),
    [mapData.nodes, groundFloorLevel]
  );

  const footprintBounds = getBounds(footprint);
  const markerX = (footprintBounds.minX + footprintBounds.maxX) / 2;
  const markerY = footprintBounds.minY + 45;
  const centerX = VIEW_WIDTH / 2;
  const centerY = VIEW_HEIGHT / 2;
  const tx = value => centerX + (value - centerX) * zoom;
  const ty = value => centerY + (value - centerY) * zoom;
  const ts = value => value * zoom;

  function zoomIn() {
    setZoom(value => Math.min(1.5, Number((value + 0.12).toFixed(2))));
  }

  function zoomOut() {
    setZoom(value => Math.max(0.78, Number((value - 0.12).toFixed(2))));
  }

  return (
    <View style={styles.container}>
      <Svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        preserveAspectRatio="xMidYMid slice"
        accessibilityLabel={`${buildingName} campus map overview`}
      >
        <Defs>
          <ClipPath id="lc2-footprint-clip">
            <Polygon points={pointsToString(footprint, tx, ty)} />
          </ClipPath>
        </Defs>

        <Rect width={VIEW_WIDTH} height={VIEW_HEIGHT} fill={MAP_BG} />

        <Circle
          cx={tx(575)}
          cy={ty(130)}
          r={ts(82)}
          fill="none"
          stroke={ROAD}
          strokeWidth={ts(22)}
        />
        <Line
          x1={tx(130)}
          y1={ty(135)}
          x2={tx(490)}
          y2={ty(135)}
          stroke={ROAD}
          strokeWidth={ts(18)}
          strokeLinecap="round"
        />
        <Line
          x1={tx(900)}
          y1={ty(0)}
          x2={tx(900)}
          y2={ty(650)}
          stroke={ROAD}
          strokeWidth={ts(17)}
          strokeLinecap="round"
        />
        <Line
          x1={tx(915)}
          y1={ty(455)}
          x2={tx(1000)}
          y2={ty(455)}
          stroke={ROAD}
          strokeWidth={ts(17)}
          strokeLinecap="round"
        />

        {FOOTPATHS.map((points, index) => (
          <Path
            key={`walkway-${index}`}
            d={points
              .map(([x, y], pointIndex) =>
                `${pointIndex === 0 ? 'M' : 'L'} ${tx(x)} ${ty(y)}`
              )
              .join(' ')}
            fill="none"
            stroke={WALKWAY}
            strokeWidth={ts(2)}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {CAMPUS_BUILDINGS.map((building, index) => (
          <Rect
            key={`context-building-${index}`}
            x={tx(building.x)}
            y={ty(building.y)}
            width={ts(building.width)}
            height={ts(building.height)}
            fill={BUILDING_FILL}
            stroke={BUILDING_STROKE}
            strokeWidth={ts(1.3)}
          />
        ))}

        <Polygon
          points={pointsToString(footprint, tx, ty)}
          fill="#E9EDF2"
          stroke="#B8C1CC"
          strokeWidth={ts(2.8)}
          strokeLinejoin="round"
        />

        <G clipPath="url(#lc2-footprint-clip)">
          {groundFloorNodes.map(node => {
            const [campusX, campusY] = indoorTransform.point(node.x, node.y);
            const width = Number(node.width) * indoorTransform.scale;
            const height = Number(node.height) * indoorTransform.scale;
            const label = node.code || node.name || '';

            return (
              <G key={`overview-space-${node.id}`}>
                <Rect
                  x={tx(campusX) - ts(width) / 2}
                  y={ty(campusY) - ts(height) / 2}
                  width={ts(width)}
                  height={ts(height)}
                  fill={roomFill(node.type)}
                  stroke={roomStroke(node.type)}
                  strokeWidth={ts(node.type === 'corridor' ? 0.7 : 1)}
                />
                {(node.type === 'room' ||
                  node.type === 'elevator' ||
                  node.type === 'stairs' ||
                  node.type === 'toilet' ||
                  node.type === 'restroom') &&
                width >= 16 &&
                height >= 12 ? (
                  <SvgText
                    x={tx(campusX)}
                    y={ty(campusY) + ts(2.5)}
                    fill="#425466"
                    fontSize={ts(node.type === 'room' ? 7.5 : 6.5)}
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {node.type === 'elevator'
                      ? 'E'
                      : node.type === 'stairs'
                        ? 'S'
                        : node.type === 'toilet' || node.type === 'restroom'
                          ? 'WC'
                          : label}
                  </SvgText>
                ) : null}
              </G>
            );
          })}
        </G>

        <Polygon
          points={pointsToString(footprint, tx, ty)}
          fill="none"
          stroke="#9DA8B5"
          strokeWidth={ts(2.2)}
          strokeLinejoin="round"
        />

        <G>
          <Circle cx={tx(markerX)} cy={ty(markerY - 12)} r={ts(13)} fill={PIN} />
          <Circle cx={tx(markerX)} cy={ty(markerY - 12)} r={ts(5)} fill="#B3261E" />
          <Polygon
            points={pointsToString(
              [
                [markerX - 7, markerY - 3],
                [markerX + 7, markerY - 3],
                [markerX, markerY + 17],
              ],
              tx,
              ty
            )}
            fill={PIN}
          />
        </G>

        <SvgText x={tx(565)} y={ty(228)} fill={LABEL} fontSize={ts(13)} fontWeight="600" textAnchor="middle">
          Faculty of Science and Technology
        </SvgText>
        <SvgText x={tx(markerX)} y={ty(505)} fill="#4B5563" fontSize={ts(15)} fontWeight="700" textAnchor="middle">
          อาคารบรรยายเรียนรวม 2
        </SvgText>
        <SvgText x={tx(markerX)} y={ty(524)} fill="#7B8794" fontSize={ts(11)} textAnchor="middle">
          LC2 · Floor 1 data fitted to building footprint
        </SvgText>
        <SvgText x={tx(700)} y={ty(452)} fill="#D97706" fontSize={ts(12)} fontWeight="600">
          59Degree coffee
        </SvgText>
        <SvgText x={tx(720)} y={ty(608)} fill={LABEL} fontSize={ts(12)} fontWeight="600">
          Environmental Science Building
        </SvgText>
      </Svg>

      <View style={styles.placeCard}>
        <View style={styles.placeTextBox}>
          <Text style={styles.placeEyebrow}>THAMMASAT UNIVERSITY</Text>
          <Text style={styles.placeTitle}>อาคารบรรยายเรียนรวม 2</Text>
          <Text style={styles.placeSubtitle}>LC2 · 1F indoor map fitted into the exterior building polygon</Text>
        </View>
        <TouchableOpacity
          style={styles.enterButton}
          onPress={() => onOpenFloor?.(groundFloorLevel)}
          accessibilityRole="button"
          accessibilityLabel="Open first floor indoor map"
        >
          <Text style={styles.enterButtonText}>Open 1F</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.zoomControls}>
        <TouchableOpacity style={styles.zoomButton} onPress={zoomIn} accessibilityRole="button" accessibilityLabel="Zoom in">
          <Text style={styles.zoomText}>＋</Text>
        </TouchableOpacity>
        <View style={styles.zoomDivider} />
        <TouchableOpacity style={styles.zoomButton} onPress={zoomOut} accessibilityRole="button" accessibilityLabel="Zoom out">
          <Text style={styles.zoomText}>−</Text>
        </TouchableOpacity>
        <View style={styles.zoomDivider} />
        <TouchableOpacity style={styles.zoomButton} onPress={() => setZoom(1)} accessibilityRole="button" accessibilityLabel="Reset campus map zoom">
          <Text style={styles.targetText}>◎</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mapBadge}>
        <Text style={styles.mapBadgeIcon}>▧</Text>
        <Text style={styles.mapBadgeText}>LC2 · 1F overlay</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: MAP_BG, overflow: 'hidden' },
  placeCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    minHeight: 82,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.98)',
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 7,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
  },
  placeTextBox: { flex: 1, paddingRight: 10 },
  placeEyebrow: { color: '#0F9D8A', fontSize: 9, fontWeight: '900', letterSpacing: 1.1 },
  placeTitle: { color: '#1F2937', fontSize: 17, fontWeight: '800', marginTop: 3 },
  placeSubtitle: { color: '#6B7280', fontSize: 11, marginTop: 2 },
  enterButton: {
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#0F9D8A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  enterButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  zoomControls: {
    position: 'absolute',
    right: 16,
    bottom: 124,
    width: 48,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.98)',
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  zoomButton: { height: 46, alignItems: 'center', justifyContent: 'center' },
  zoomDivider: { height: StyleSheet.hairlineWidth, backgroundColor: '#D1D5DB', marginHorizontal: 7 },
  zoomText: { color: '#4B5563', fontSize: 27, fontWeight: '300' },
  targetText: { color: '#4B5563', fontSize: 23 },
  mapBadge: {
    position: 'absolute',
    left: 16,
    bottom: 124,
    minHeight: 42,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.96)',
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
  },
  mapBadgeIcon: { color: '#4B5563', fontSize: 18, marginRight: 7 },
  mapBadgeText: { color: '#4B5563', fontSize: 11, fontWeight: '700' },
});
