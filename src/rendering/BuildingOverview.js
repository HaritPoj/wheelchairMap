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
  Polygon,
  Rect,
  Text as SvgText,
} from 'react-native-svg';

const VIEW_WIDTH = 1000;
const VIEW_HEIGHT = 650;
const GREEN = '#20D33A';
const MUTED_GREEN = '#149B2A';
const ORANGE = '#C58A00';
const RED = '#E84C4C';

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
      [255, 300],
      [765, 300],
      [765, 390],
      [660, 390],
      [660, 420],
      [390, 420],
      [390, 470],
      [255, 470],
    ];
  }

  const bounds = getBounds(points);
  const sourceWidth = Math.max(1, bounds.maxX - bounds.minX);
  const sourceHeight = Math.max(1, bounds.maxY - bounds.minY);
  const targetWidth = 610;
  const targetHeight = 205;
  const scale = Math.min(
    targetWidth / sourceWidth,
    targetHeight / sourceHeight
  );

  const scaledWidth = sourceWidth * scale;
  const scaledHeight = sourceHeight * scale;
  const offsetX = (VIEW_WIDTH - scaledWidth) / 2;
  const offsetY = 315 - scaledHeight / 2;

  return points.map(([x, y]) => [
    offsetX + (Number(x) - bounds.minX) * scale,
    offsetY + (Number(y) - bounds.minY) * scale,
  ]);
}

function pointsString(points, zoom = 1) {
  const centerX = VIEW_WIDTH / 2;
  const centerY = VIEW_HEIGHT / 2;

  return points
    .map(([x, y]) => {
      const sx = centerX + (x - centerX) * zoom;
      const sy = centerY + (y - centerY) * zoom;
      return sx + ',' + sy;
    })
    .join(' ');
}

const CONTEXT_BUILDINGS = [
  [[70, 92], [145, 92], [145, 168], [70, 168]],
  [[250, 66], [307, 66], [307, 205], [250, 205]],
  [[326, 55], [378, 55], [378, 205], [326, 205]],
  [[397, 48], [446, 48], [446, 205], [397, 205]],
  [[765, 58], [845, 58], [845, 225], [765, 225]],
  [[858, 75], [923, 75], [923, 236], [858, 236]],
  [[830, 455], [930, 455], [930, 530], [830, 530]],
  [[545, 500], [745, 500], [745, 532], [620, 532], [620, 572], [545, 572]],
  [[155, 510], [310, 510], [310, 548], [155, 548]],
  [[35, 540], [120, 540], [120, 565], [35, 565]],
];

const MEDIUM_CONFIDENCE = [
  [[120, 125], [145, 125], [145, 172], [120, 172]],
  [[182, 540], [265, 540], [265, 565], [182, 565]],
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

  function zoomIn() {
    setZoom(value => Math.min(1.45, Number((value + 0.12).toFixed(2))));
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
        accessibilityLabel={`${buildingName} building overview`}
      >
        <Rect width={VIEW_WIDTH} height={VIEW_HEIGHT} fill="#20252D" />

        {[125, 250, 375, 500, 625, 750, 875].map(x => (
          <Line
            key={'grid-x-' + x}
            x1={x}
            x2={x}
            y1={0}
            y2={VIEW_HEIGHT}
            stroke="#3A424D"
            strokeWidth={1}
          />
        ))}

        {[105, 210, 315, 420, 525].map(y => (
          <Line
            key={'grid-y-' + y}
            x1={0}
            x2={VIEW_WIDTH}
            y1={y}
            y2={y}
            stroke="#3A424D"
            strokeWidth={1}
          />
        ))}

        <Circle
          cx={515}
          cy={165}
          r={82}
          fill="none"
          stroke="#303842"
          strokeWidth={1.5}
        />

        {CONTEXT_BUILDINGS.map((points, index) => (
          <Polygon
            key={'context-' + index}
            points={pointsString(points, zoom)}
            fill="rgba(20,155,42,0.04)"
            stroke={MUTED_GREEN}
            strokeWidth={2}
          />
        ))}

        {MEDIUM_CONFIDENCE.map((points, index) => (
          <Polygon
            key={'medium-' + index}
            points={pointsString(points, zoom)}
            fill="rgba(197,138,0,0.03)"
            stroke={ORANGE}
            strokeWidth={2}
            strokeDasharray="6 4"
          />
        ))}

        <G>
          <Polygon
            points={pointsString(footprint, zoom)}
            fill="rgba(32,211,58,0.055)"
            stroke={GREEN}
            strokeWidth={3.2}
          />

          <Circle
            cx={VIEW_WIDTH / 2 + (markerX - VIEW_WIDTH / 2) * zoom}
            cy={VIEW_HEIGHT / 2 + (markerY - VIEW_HEIGHT / 2) * zoom - 24}
            r={12}
            fill={RED}
          />
          <Circle
            cx={VIEW_WIDTH / 2 + (markerX - VIEW_WIDTH / 2) * zoom}
            cy={VIEW_HEIGHT / 2 + (markerY - VIEW_HEIGHT / 2) * zoom - 24}
            r={4}
            fill="#20252D"
          />
          <SvgText
            x={VIEW_WIDTH / 2 + (markerX - VIEW_WIDTH / 2) * zoom}
            y={VIEW_HEIGHT / 2 + (markerY - VIEW_HEIGHT / 2) * zoom + 12}
            fill="#B9C2CC"
            fontSize={19}
            fontWeight="700"
            textAnchor="middle"
          >
            {buildingName}
          </SvgText>
          <SvgText
            x={VIEW_WIDTH / 2 + (markerX - VIEW_WIDTH / 2) * zoom}
            y={VIEW_HEIGHT / 2 + (markerY - VIEW_HEIGHT / 2) * zoom + 34}
            fill="#7F8B96"
            fontSize={13}
            textAnchor="middle"
          >
            Learning Center 2
          </SvgText>
        </G>
      </Svg>

      <View style={styles.locationCard}>
        <View>
          <Text style={styles.locationEyebrow}>BUILDING FOOTPRINT</Text>
          <Text style={styles.locationTitle}>{buildingName}</Text>
          <Text style={styles.locationSubtitle}>Open Buildings-style overview</Text>
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
          accessibilityLabel="Reset building overview zoom"
        >
          <Text style={styles.targetText}>◎</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendRow}>
          <View style={[styles.legendBox, styles.highConfidence]} />
          <Text style={styles.legendText}>LC2 building footprint</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendBox, styles.mediumConfidence]} />
          <Text style={styles.legendText}>Nearby building context</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#20252D',
    overflow: 'hidden',
  },
  locationCard: {
    position: 'absolute',
    left: 16,
    top: 18,
    right: 16,
    minHeight: 74,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.97)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 5,
  },
  locationEyebrow: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.1,
  },
  locationTitle: {
    color: '#111827',
    fontSize: 19,
    fontWeight: '900',
    marginTop: 2,
  },
  locationSubtitle: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 1,
  },
  enterButton: {
    minHeight: 42,
    paddingHorizontal: 15,
    borderRadius: 13,
    backgroundColor: '#16A34A',
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
    bottom: 112,
    width: 50,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.96)',
    overflow: 'hidden',
    elevation: 6,
  },
  zoomButton: {
    height: 48,
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
    fontSize: 28,
    fontWeight: '300',
  },
  targetText: {
    color: '#4B5563',
    fontSize: 24,
  },
  legend: {
    position: 'absolute',
    left: 16,
    bottom: 24,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(28,33,40,0.88)',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  legendBox: {
    width: 18,
    height: 18,
    marginRight: 9,
    backgroundColor: 'transparent',
  },
  highConfidence: {
    borderWidth: 2,
    borderColor: GREEN,
  },
  mediumConfidence: {
    borderWidth: 2,
    borderColor: ORANGE,
    borderStyle: 'dashed',
  },
  legendText: {
    color: '#F3F4F6',
    fontSize: 11,
    fontWeight: '600',
  },
});
