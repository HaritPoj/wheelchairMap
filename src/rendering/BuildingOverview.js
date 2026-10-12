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
const BUILDING_FILL = '#E8ECF1';
const BUILDING_STROKE = '#D4DAE2';
const ROAD = '#AEBFD0';
const PATH_COLOR = '#63BFA3';
const LABEL = '#657786';
const PIN = '#EA4335';

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

function normalizeFootprint(points) {
  if (!Array.isArray(points) || points.length < 3) {
    return [
      [265, 290],
      [760, 290],
      [760, 385],
      [655, 385],
      [655, 415],
      [390, 415],
      [390, 470],
      [265, 470],
    ];
  }

  const bounds = getBounds(points);
  const sourceWidth = Math.max(1, bounds.maxX - bounds.minX);
  const sourceHeight = Math.max(1, bounds.maxY - bounds.minY);
  const targetWidth = 600;
  const targetHeight = 215;
  const scale = Math.min(
    targetWidth / sourceWidth,
    targetHeight / sourceHeight
  );

  const scaledWidth = sourceWidth * scale;
  const scaledHeight = sourceHeight * scale;
  const offsetX = (VIEW_WIDTH - scaledWidth) / 2 + 70;
  const offsetY = 330 - scaledHeight / 2;

  return points.map(([x, y]) => [
    offsetX + (Number(x) - bounds.minX) * scale,
    offsetY + (Number(y) - bounds.minY) * scale,
  ]);
}

function transformedPoints(points, zoom) {
  const centerX = VIEW_WIDTH / 2;
  const centerY = VIEW_HEIGHT / 2;

  return points
    .map(([x, y]) => {
      const sx = centerX + (x - centerX) * zoom;
      const sy = centerY + (y - centerY) * zoom;
      return `${sx},${sy}`;
    })
    .join(' ');
}

const CAMPUS_BUILDINGS = [
  { x: 730, y: 50, width: 120, height: 95 },
  { x: 850, y: 36, width: 52, height: 120 },
  { x: 910, y: 40, width: 40, height: 130 },
  { x: 758, y: 150, width: 72, height: 74 },
  { x: 848, y: 172, width: 76, height: 58 },
  { x: 920, y: 165, width: 55, height: 68 },
  { x: 87, y: 68, width: 90, height: 120 },
  { x: 190, y: 60, width: 48, height: 136 },
  { x: 250, y: 48, width: 46, height: 148 },
  { x: 312, y: 58, width: 45, height: 135 },
  { x: 795, y: 498, width: 160, height: 92 },
  { x: 545, y: 515, width: 155, height: 82 },
  { x: 250, y: 525, width: 205, height: 75 },
  { x: 72, y: 485, width: 120, height: 95 },
];

const FOOTPATHS = [
  [[330, 150], [480, 150], [480, 225]],
  [[480, 225], [480, 305]],
  [[480, 430], [480, 535]],
  [[460, 535], [640, 535], [690, 585]],
  [[690, 585], [910, 585]],
  [[910, 585], [910, 430]],
  [[800, 430], [910, 430]],
  [[215, 455], [345, 455], [380, 420]],
];

export default function BuildingOverview({ mapData, onOpenFloor }) {
  const [zoom, setZoom] = useState(1);

  const buildingName = mapData.buildingName || 'LC2';
  const groundFloor = mapData.floors?.[0];
  const footprint = useMemo(
    () => normalizeFootprint(groundFloor?.map?.boundary),
    [groundFloor]
  );

  const bounds = getBounds(footprint);
  const markerX = (bounds.minX + bounds.maxX) / 2;
  const markerY = (bounds.minY + bounds.maxY) / 2;
  const centerX = VIEW_WIDTH / 2;
  const centerY = VIEW_HEIGHT / 2;

  const tx = value => centerX + (value - centerX) * zoom;
  const ty = value => centerY + (value - centerY) * zoom;
  const ts = value => value * zoom;

  function zoomIn() {
    setZoom(value => Math.min(1.5, Number((value + 0.12).toFixed(2))));
  }

  function zoomOut() {
    setZoom(value => Math.max(0.8, Number((value - 0.12).toFixed(2))));
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

        <Circle
          cx={tx(555)}
          cy={ty(125)}
          r={ts(88)}
          fill="none"
          stroke={ROAD}
          strokeWidth={ts(24)}
        />

        <Line
          x1={tx(120)}
          y1={ty(120)}
          x2={tx(470)}
          y2={ty(120)}
          stroke={ROAD}
          strokeWidth={ts(18)}
          strokeLinecap="round"
        />

        <Line
          x1={tx(902)}
          y1={ty(0)}
          x2={tx(902)}
          y2={ty(650)}
          stroke={ROAD}
          strokeWidth={ts(18)}
          strokeLinecap="round"
        />

        <Line
          x1={tx(915)}
          y1={ty(455)}
          x2={tx(1000)}
          y2={ty(455)}
          stroke={ROAD}
          strokeWidth={ts(18)}
          strokeLinecap="round"
        />

        {FOOTPATHS.map((points, index) => (
          <Path
            key={`path-${index}`}
            d={points
              .map(([x, y], pointIndex) =>
                `${pointIndex === 0 ? 'M' : 'L'} ${tx(x)} ${ty(y)}`
              )
              .join(' ')}
            fill="none"
            stroke={PATH_COLOR}
            strokeWidth={ts(2)}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {CAMPUS_BUILDINGS.map((building, index) => (
          <Rect
            key={`campus-building-${index}`}
            x={tx(building.x)}
            y={ty(building.y)}
            width={ts(building.width)}
            height={ts(building.height)}
            fill={BUILDING_FILL}
            stroke={BUILDING_STROKE}
            strokeWidth={ts(1.4)}
          />
        ))}

        <Polygon
          points={transformedPoints(footprint, zoom)}
          fill="#E5E7EB"
          stroke="#D1D5DB"
          strokeWidth={ts(2.2)}
        />

        <G>
          <Circle
            cx={tx(markerX)}
            cy={ty(markerY - 18)}
            r={ts(13)}
            fill={PIN}
          />
          <Circle
            cx={tx(markerX)}
            cy={ty(markerY - 18)}
            r={ts(5)}
            fill="#B3261E"
          />
          <Polygon
            points={transformedPoints(
              [
                [markerX - 7, markerY - 8],
                [markerX + 7, markerY - 8],
                [markerX, markerY + 11],
              ],
              zoom
            )}
            fill={PIN}
          />
        </G>

        <SvgText
          x={tx(505)}
          y={ty(215)}
          fill={LABEL}
          fontSize={ts(14)}
          fontWeight="600"
          textAnchor="middle"
        >
          Faculty of Science and Technology
        </SvgText>

        <SvgText
          x={tx(markerX)}
          y={ty(markerY + 35)}
          fill="#4B5563"
          fontSize={ts(17)}
          fontWeight="700"
          textAnchor="middle"
        >
          อาคารบรรยายเรียนรวม 2
        </SvgText>

        <SvgText
          x={tx(markerX)}
          y={ty(markerY + 57)}
          fill="#7A8794"
          fontSize={ts(13)}
          textAnchor="middle"
        >
          Learning Center 2 · {buildingName}
        </SvgText>

        <SvgText
          x={tx(690)}
          y={ty(455)}
          fill="#D97706"
          fontSize={ts(13)}
          fontWeight="600"
        >
          59Degree coffee
        </SvgText>

        <SvgText
          x={tx(725)}
          y={ty(600)}
          fill={LABEL}
          fontSize={ts(13)}
          fontWeight="600"
        >
          Environmental Science Building
        </SvgText>
      </Svg>

      <View style={styles.placeCard}>
        <View style={styles.placeTextBox}>
          <Text style={styles.placeEyebrow}>CAMPUS MAP</Text>
          <Text style={styles.placeTitle}>อาคารบรรยายเรียนรวม 2</Text>
          <Text style={styles.placeSubtitle}>
            Learning Center 2 · Thammasat University
          </Text>
        </View>

        <TouchableOpacity
          style={styles.enterButton}
          onPress={() => onOpenFloor?.(mapData.floors?.[0]?.level ?? 1)}
          accessibilityRole="button"
          accessibilityLabel="Open first floor indoor map"
        >
          <Text style={styles.enterButtonText}>Open 1F</Text>
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
        <Text style={styles.mapBadgeText}>Campus map</Text>
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
    fontSize: 12,
    fontWeight: '700',
  },
});
