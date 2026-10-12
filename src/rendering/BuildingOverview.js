import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Svg, {
  Circle,
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

// Position of LC2 in the campus overview, estimated from the supplied map
// screenshot. The indoor floor boundary is fitted into this box after a 180°
// rotation so the long wing and vertical wing match the real map orientation.
const LC2_TARGET = {
  x: 175,
  y: 270,
  width: 665,
  height: 220,
};

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

function fitIndoorBoundaryToCampus(points) {
  if (!Array.isArray(points) || points.length < 3) {
    return [
      [185, 275],
      [835, 275],
      [835, 345],
      [255, 345],
      [255, 485],
      [185, 485],
    ];
  }

  const bounds = getBounds(points);
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

  return points.map(([x, y]) => {
    // Rotate the indoor map 180° to match the orientation in the campus map.
    const rotatedX = bounds.maxX - Number(x);
    const rotatedY = bounds.maxY - Number(y);

    return [
      offsetX + rotatedX * scale,
      offsetY + rotatedY * scale,
    ];
  });
}

function pointsToString(points, transformX, transformY) {
  return points
    .map(([x, y]) => `${transformX(x)},${transformY(y)}`)
    .join(' ');
}

const CAMPUS_BUILDINGS = [
  // North / roundabout area
  { x: 555, y: 45, width: 68, height: 62 },
  { x: 730, y: 35, width: 88, height: 130 },
  { x: 830, y: 26, width: 58, height: 148 },
  { x: 900, y: 30, width: 48, height: 160 },
  { x: 760, y: 170, width: 72, height: 62 },
  { x: 847, y: 175, width: 68, height: 55 },

  // West / south-west context
  { x: 74, y: 78, width: 92, height: 112 },
  { x: 190, y: 58, width: 44, height: 138 },
  { x: 248, y: 50, width: 45, height: 146 },
  { x: 307, y: 58, width: 45, height: 136 },

  // South context
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

  const footprint = useMemo(
    () => fitIndoorBoundaryToCampus(groundFloor?.map?.boundary),
    [groundFloor]
  );

  const footprintBounds = getBounds(footprint);
  const markerX = (footprintBounds.minX + footprintBounds.maxX) / 2;
  const markerY = footprintBounds.minY + 55;

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

  function resetZoom() {
    setZoom(1);
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
        <Rect width={VIEW_WIDTH} height={VIEW_HEIGHT} fill={MAP_BG} />

        {/* Campus roads based on the supplied map screenshot. */}
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

        {/* LC2 footprint generated from the real indoor building boundary. */}
        <Polygon
          points={pointsToString(footprint, tx, ty)}
          fill="#E1E5EA"
          stroke="#C9D0D8"
          strokeWidth={ts(2.4)}
          strokeLinejoin="round"
        />

        {/* Entrance / connector visible in the exterior reference. */}
        <Rect
          x={tx(495)}
          y={ty(330)}
          width={ts(38)}
          height={ts(76)}
          fill="#E1E5EA"
          stroke="#C9D0D8"
          strokeWidth={ts(1.6)}
        />

        <G>
          <Circle
            cx={tx(markerX)}
            cy={ty(markerY - 12)}
            r={ts(13)}
            fill={PIN}
          />
          <Circle
            cx={tx(markerX)}
            cy={ty(markerY - 12)}
            r={ts(5)}
            fill="#B3261E"
          />
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

        <SvgText
          x={tx(565)}
          y={ty(228)}
          fill={LABEL}
          fontSize={ts(13)}
          fontWeight="600"
          textAnchor="middle"
        >
          Faculty of Science and Technology
        </SvgText>

        <SvgText
          x={tx(markerX)}
          y={ty(365)}
          fill="#4B5563"
          fontSize={ts(16)}
          fontWeight="700"
          textAnchor="middle"
        >
          อาคารบรรยายเรียนรวม 2
        </SvgText>

        <SvgText
          x={tx(markerX)}
          y={ty(386)}
          fill="#7B8794"
          fontSize={ts(12)}
          textAnchor="middle"
        >
          Learning Center 2 · {buildingName}
        </SvgText>

        <SvgText
          x={tx(700)}
          y={ty(452)}
          fill="#D97706"
          fontSize={ts(12)}
          fontWeight="600"
        >
          59Degree coffee
        </SvgText>

        <SvgText
          x={tx(720)}
          y={ty(608)}
          fill={LABEL}
          fontSize={ts(12)}
          fontWeight="600"
        >
          Environmental Science Building
        </SvgText>
      </Svg>

      <View style={styles.placeCard}>
        <View style={styles.placeTextBox}>
          <Text style={styles.placeEyebrow}>THAMMASAT UNIVERSITY</Text>
          <Text style={styles.placeTitle}>อาคารบรรยายเรียนรวม 2</Text>
          <Text style={styles.placeSubtitle}>
            LC2 · Building footprint aligned to the campus map
          </Text>
        </View>

        <TouchableOpacity
          style={styles.enterButton}
          onPress={() => onOpenFloor?.(mapData.floors?.[0]?.level ?? 1)}
          accessibilityRole="button"
          accessibilityLabel="Open first floor indoor map"
        >
          <Text style={styles.enterButtonText}>Indoor map</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.zoomControls}>
        <TouchableOpacity
          style={styles.zoomButton}
          onPress={zoomIn}
          accessibilityRole="button"
          accessibilityLabel="Zoom in"
        >
          <Text style={styles.zoomText}>＋</Text>
        </TouchableOpacity>
        <View style={styles.zoomDivider} />
        <TouchableOpacity
          style={styles.zoomButton}
          onPress={zoomOut}
          accessibilityRole="button"
          accessibilityLabel="Zoom out"
        >
          <Text style={styles.zoomText}>−</Text>
        </TouchableOpacity>
        <View style={styles.zoomDivider} />
        <TouchableOpacity
          style={styles.zoomButton}
          onPress={resetZoom}
          accessibilityRole="button"
          accessibilityLabel="Reset campus map zoom"
        >
          <Text style={styles.targetText}>◎</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mapBadge}>
        <Text style={styles.mapBadgeIcon}>▧</Text>
        <Text style={styles.mapBadgeText}>LC2 campus context</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MAP_BG,
    overflow: 'hidden',
  },
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
  placeTextBox: {
    flex: 1,
    paddingRight: 10,
  },
  placeEyebrow: {
    color: '#0F9D8A',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.1,
  },
  placeTitle: {
    color: '#1F2937',
    fontSize: 17,
    fontWeight: '800',
    marginTop: 3,
  },
  placeSubtitle: {
    color: '#6B7280',
    fontSize: 11,
    marginTop: 2,
  },
  enterButton: {
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#0F9D8A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  enterButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
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
  zoomButton: {
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 7,
  },
  zoomText: {
    color: '#4B5563',
    fontSize: 27,
    fontWeight: '300',
  },
  targetText: {
    color: '#4B5563',
    fontSize: 23,
  },
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
  mapBadgeIcon: {
    color: '#4B5563',
    fontSize: 18,
    marginRight: 7,
  },
  mapBadgeText: {
    color: '#4B5563',
    fontSize: 11,
    fontWeight: '700',
  },
});
