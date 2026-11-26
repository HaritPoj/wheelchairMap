import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
} from 'react-native';
import Svg, {
  Line,
  Rect,
  Circle,
  Text as SvgText,
  Polygon,
  Polyline,
  G,
} from 'react-native-svg';
import { getRouteColor } from './routeColors';
import { getDoorSpecs, getRouteSegmentPoints } from './routeGeometry';

const INDOOR_FILL = '#B2B1CA';
const INDOOR_STROKE = '#312E81';
const WALL_COLOR = '#111111';

export default function FloorPlan({
  mapData,
  currentFloor,
  route = [],
  routes = [],
  selectedRouteIndex = 0,
  onNodeTap,
  destination,
  startNode,
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });

  const currentScale = useRef(1);
  const zoomMultiplier = useRef(1);
  const currentOffset = useRef({ x: 0, y: 0 });
  const gestureStartOffset = useRef({ x: 0, y: 0 });
  const gestureStartDistance = useRef(null);
  const gestureStartScale = useRef(1);

  const currentFloorData =
    mapData.floors.find(floor => floor.level === currentFloor) ||
    mapData.floors[0] ||
    { map: { width: 1200, height: 450 } };

  const mapWidthSource = Number(currentFloorData.map?.width) || 1200;
  const mapHeightSource = Number(currentFloorData.map?.height) || 450;
  const useIndoorStyle = [1, 2, 3].includes(Number(currentFloor));
  const wallLines = currentFloorData.map?.walls || [];

  const fitScale =
    viewport.width > 0 && viewport.height > 0
      ? Math.min(
          1,
          (viewport.width * 0.98) / mapWidthSource,
          (viewport.height * 0.98) / mapHeightSource
        )
      : 1;

  const latestMapState = useRef({
    viewport,
    mapWidthSource,
    mapHeightSource,
    fitScale,
  });

  latestMapState.current = {
    viewport,
    mapWidthSource,
    mapHeightSource,
    fitScale,
  };

  const centerMap = () => {
    const {
      viewport: currentViewport,
      mapWidthSource: width,
      mapHeightSource: height,
      fitScale: baseScale,
    } = latestMapState.current;

    if (!currentViewport.width || !currentViewport.height) return;

    const scale = baseScale * zoomMultiplier.current;
    const contentWidth = width * scale;
    const contentHeight = height * scale;
    currentScale.current = scale;

    const centeredOffset = {
      x: (currentViewport.width - contentWidth) / 2,
      y: (currentViewport.height - contentHeight) / 2,
    };

    currentOffset.current = centeredOffset;
    setMapOffset(centeredOffset);
  };

  useEffect(() => {
    zoomMultiplier.current = 1;
    currentScale.current = fitScale;
    setZoomLevel(1);
    centerMap();
  }, [currentFloor, mapWidthSource, mapHeightSource, fitScale]);

  const clampOffset = (offset, scale = currentScale.current) => {
    const {
      viewport: currentViewport,
      mapWidthSource: width,
      mapHeightSource: height,
    } = latestMapState.current;

    const contentWidth = width * scale;
    const contentHeight = height * scale;
    const xDifference = currentViewport.width - contentWidth;
    const yDifference = currentViewport.height - contentHeight;

    return {
      x: Math.max(
        Math.min(0, xDifference),
        Math.min(offset.x, Math.max(0, xDifference))
      ),
      y: Math.max(
        Math.min(0, yDifference),
        Math.min(offset.y, Math.max(0, yDifference))
      ),
    };
  };

  const updateOffset = (offset, scale = currentScale.current) => {
    const next = clampOffset(offset, scale);
    currentOffset.current = next;
    setMapOffset(next);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 4 || Math.abs(gestureState.dy) > 4,

      onPanResponderGrant: event => {
        const touches = event.nativeEvent.touches;
        gestureStartOffset.current = { ...currentOffset.current };
        gestureStartScale.current = zoomMultiplier.current;

        if (touches.length >= 2) {
          const [first, second] = touches;
          const dx = first.pageX - second.pageX;
          const dy = first.pageY - second.pageY;
          gestureStartDistance.current = Math.sqrt(dx * dx + dy * dy);
        } else {
          gestureStartDistance.current = null;
        }
      },

      onPanResponderMove: (event, gestureState) => {
        const touches = event.nativeEvent.touches;

        if (touches.length >= 2 && gestureStartDistance.current !== null) {
          const [first, second] = touches;
          const dx = first.pageX - second.pageX;
          const dy = first.pageY - second.pageY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const factor =
            gestureStartDistance.current > 0
              ? distance / gestureStartDistance.current
              : 1;

          const nextZoom = Math.max(
            0.6,
            Math.min(3.5, gestureStartScale.current * factor)
          );
          const nextScale = latestMapState.current.fitScale * nextZoom;

          zoomMultiplier.current = nextZoom;
          currentScale.current = nextScale;
          setZoomLevel(nextZoom);
          updateOffset(gestureStartOffset.current, nextScale);
          return;
        }

        if (touches.length === 1) {
          updateOffset({
            x: gestureStartOffset.current.x + gestureState.dx,
            y: gestureStartOffset.current.y + gestureState.dy,
          });
        }
      },

      onPanResponderRelease: () => {
        gestureStartDistance.current = null;
      },
      onPanResponderTerminate: () => {
        gestureStartDistance.current = null;
      },
    })
  ).current;

  const scale = fitScale * zoomLevel;
  const mapWidth = mapWidthSource * scale;
  const mapHeight = mapHeightSource * scale;
  const toXY = (x, y) => ({
    x: Number(x || 0) * scale,
    y: Number(y || 0) * scale,
  });

  const isWaypoint = node =>
    node.type === 'corridor' &&
    !(Number(node.width) > 0 && Number(node.height) > 0);

  const floorNodes = mapData.nodes.filter(node => node.floor === currentFloor);
  const routePaths =
    routes.length > 0 ? routes : route && route.length > 0 ? [route] : [];
  const activeRouteIndex =
    routePaths.length > 0
      ? Math.max(0, Math.min(selectedRouteIndex, routePaths.length - 1))
      : 0;
  const routeDrawOrder = routePaths
    .map((_, index) => index)
    .filter(index => index !== activeRouteIndex)
    .concat(routePaths.length > 0 ? [activeRouteIndex] : []);

  function getEdgeBetween(nodeA, nodeB) {
    if (!nodeA || !nodeB) return null;

    return (
      (mapData.edges || []).find(
        edge =>
          (edge.from === nodeA.id && edge.to === nodeB.id) ||
          (edge.from === nodeB.id && edge.to === nodeA.id)
      ) || null
    );
  }

  const boundary =
    Array.isArray(currentFloorData.map?.boundary) &&
    currentFloorData.map.boundary.length >= 3
      ? currentFloorData.map.boundary
      : [
          [0, 0],
          [mapWidthSource, 0],
          [mapWidthSource, mapHeightSource],
          [0, mapHeightSource],
        ];

  const buildingFramePoints = boundary
    .map(([x, y]) => `${x * scale},${y * scale}`)
    .join(' ');

  function renderRoomWalls(node, x, y, width, height) {
    const left = x - width / 2;
    const right = x + width / 2;
    const top = y - height / 2;
    const bottom = y + height / 2;
    const doorSpecs = getDoorSpecs(node, mapData.edges, mapData.nodeMap);
    const horizontalGap = Math.min(18 * scale, width * 0.42);
    const verticalGap = Math.min(18 * scale, height * 0.34);
    const strokeWidth = 2 * scale;

    function wall(side, fixed, horizontal) {
      const origin = horizontal ? left : top;
      const length = horizontal ? width : height;
      const gap = horizontal ? horizontalGap : verticalGap;
      const positions = (doorSpecs.get(side) || []).slice().sort((a, b) => a - b);
      const segments = [];
      let cursor = origin;
      for (const fraction of positions) {
        const center = origin + fraction * length;
        const before = Math.min(origin + length, center - gap / 2);
        if (before > cursor) segments.push([cursor, before]);
        cursor = Math.max(cursor, center + gap / 2);
      }
      if (cursor < origin + length) segments.push([cursor, origin + length]);
      return segments.map(([a, b]) => (
        <Line key={side + '-' + a} x1={horizontal ? a : fixed} y1={horizontal ? fixed : a}
          x2={horizontal ? b : fixed} y2={horizontal ? fixed : b}
          stroke={WALL_COLOR} strokeWidth={strokeWidth} />
      ));
    }

    return (
      <G key={'walls-' + node.id}>
        {wall('top', top, true)}
        {wall('bottom', bottom, true)}
        {wall('left', left, false)}
        {wall('right', right, false)}
      </G>
    );
  }

  function renderStairs(node, x, y, width, height) {
    const left = x - width / 2;
    const top = y - height / 2;
    const stepCount = 6;

    return (
      <G key={'stairs-' + node.id}>
        <Rect
          x={left}
          y={top}
          width={width}
          height={height}
          fill="none"
          stroke={WALL_COLOR}
          strokeWidth={2 * scale}
        />
        {Array.from({ length: stepCount }).map((_, index) => {
          const stepY = top + ((index + 1) * height) / (stepCount + 1);
          return (
            <Line
              key={'stair-step-' + index}
              x1={left}
              y1={stepY}
              x2={left + width}
              y2={stepY}
              stroke={WALL_COLOR}
              strokeWidth={1.4 * scale}
            />
          );
        })}
      </G>
    );
  }

  function renderElevator(node, x, y, width, height) {
    const size = Math.max(18 * scale, Math.min(width, height));
    const left = x - size / 2;
    const top = y - size / 2;

    return (
      <G key={'elevator-' + node.id}>
        <Rect
          x={left}
          y={top}
          width={size}
          height={size}
          rx={1.5 * scale}
          fill="#ffffff"
          stroke={WALL_COLOR}
          strokeWidth={2 * scale}
        />
        <SvgText
          x={x}
          y={y + 4 * scale}
          fontSize={12 * scale}
          fill={WALL_COLOR}
          textAnchor="middle"
          fontWeight="bold"
        >
          ⇅
        </SvgText>
      </G>
    );
  }

  return (
    <View
      style={styles.wrapper}
      {...panResponder.panHandlers}
      onLayout={event => {
        const { width, height } = event.nativeEvent.layout;
        setViewport(current =>
          current.width === width && current.height === height
            ? current
            : { width, height }
        );
      }}
    >
      <View
        style={[
          styles.mapLayer,
          {
            width: mapWidth,
            height: mapHeight,
            left: mapOffset.x,
            top: mapOffset.y,
          },
        ]}
      >
        <Svg
          width={mapWidth}
          height={mapHeight}
          style={styles.svg}
          accessible
          accessibilityLabel={'Floor ' + currentFloor + ' map'}
        >
          <Polygon
            points={buildingFramePoints}
            fill={useIndoorStyle ? INDOOR_FILL : '#ffffff'}
            stroke={useIndoorStyle ? INDOOR_STROKE : '#888888'}
            strokeWidth={(useIndoorStyle ? 2.5 : 4) * scale}
            strokeLinejoin="round"
          />

          {wallLines.map((line, index) => (
            <Polyline
              key={'wall-' + index}
              points={line.map(([x, y]) => (x * scale) + ',' + (y * scale)).join(' ')}
              fill="none"
              stroke={WALL_COLOR}
              strokeWidth={3 * scale}
            />
          ))}

          {!useIndoorStyle &&
            floorNodes.map(node => {
              if (
                node.type !== 'corridor' ||
                !(Number(node.width) > 0) ||
                !(Number(node.height) > 0)
              ) {
                return null;
              }

              const { x, y } = toXY(node.x, node.y);
              const corridorWidth = node.width * scale;
              const corridorHeight = node.height * scale;

              return (
                <Rect
                  key={'corridor-area-' + node.id}
                  x={x - corridorWidth / 2}
                  y={y - corridorHeight / 2}
                  width={corridorWidth}
                  height={corridorHeight}
                  fill="#eef2f3"
                  stroke="#000000"
                  strokeWidth={2 * scale}
                />
              );
            })}

          {floorNodes.map(node => {
            if (isWaypoint(node) || node.type === 'corridor') return null;

            const { x, y } = toXY(node.x, node.y);
            const roomWidth = Math.max(1, Number(node.width) || 50) * scale;
            const roomHeight = Math.max(1, Number(node.height) || 50) * scale;
            const isElevator = node.type === 'elevator';
            const isStairs = node.type === 'stairs';
            const isRestroom = node.type === 'restroom' || node.type === 'toilet';

            if (useIndoorStyle && isStairs) {
              return renderStairs(node, x, y, roomWidth, roomHeight);
            }

            if (useIndoorStyle && isElevator) {
              return renderElevator(node, x, y, roomWidth, roomHeight);
            }

            const structureFill = useIndoorStyle
              ? INDOOR_FILL
              : isElevator
                ? '#d0d0d0'
                : isStairs
                  ? '#e4e4e4'
                  : isRestroom
                    ? '#f2f5f6'
                    : '#f8f8f8';

            const smallLabel = Math.min(roomWidth, roomHeight) < 32 * scale;
            const fontSize = (smallLabel ? 8 : isRestroom ? 10 : 14) * scale;

            return (
              <React.Fragment key={'structure-' + node.id}>
                {wallLines.length > 0 ? null : useIndoorStyle ? (
                  <>
                    <Rect
                      x={x - roomWidth / 2}
                      y={y - roomHeight / 2}
                      width={roomWidth}
                      height={roomHeight}
                      fill={structureFill}
                      stroke="none"
                    />
                    {renderRoomWalls(node, x, y, roomWidth, roomHeight)}
                  </>
                ) : Array.isArray(node.geometryParts) && node.geometryParts.length > 0 ? (
                  <>
                    {node.geometryParts.map((part, index) => (
                      <Rect
                        key={'shape-part-' + node.id + '-' + index}
                        x={part.x * scale}
                        y={part.y * scale}
                        width={part.width * scale}
                        height={part.height * scale}
                        fill={structureFill}
                        stroke="none"
                      />
                    ))}
                    {Array.isArray(node.geometryOutline) && node.geometryOutline.length >= 3 ? (
                      <Polygon
                        points={node.geometryOutline
                          .map(([pointX, pointY]) => `${pointX * scale},${pointY * scale}`)
                          .join(' ')}
                        fill="none"
                        stroke={WALL_COLOR}
                        strokeWidth={2 * scale}
                        strokeLinejoin="miter"
                      />
                    ) : null}
                  </>
                ) : (
                  <>
                    <Rect
                      x={x - roomWidth / 2}
                      y={y - roomHeight / 2}
                      width={roomWidth}
                      height={roomHeight}
                      fill={structureFill}
                      stroke="none"
                    />
                    {renderRoomWalls(node, x, y, roomWidth, roomHeight)}
                  </>
                )}

                <SvgText
                  x={x}
                  y={y + 5 * scale}
                  fontSize={fontSize}
                  fill="#111111"
                  textAnchor="middle"
                  fontWeight={useIndoorStyle ? 'normal' : 'bold'}
                >
                  {isRestroom ? node.code || 'WC' : node.code || node.label || node.id}
                </SvgText>
              </React.Fragment>
            );
          })}

          {/* Match the colored selection to the real room footprint.
              Hit targets may be larger, but must never paint into
              adjacent rooms (especially narrow Rooms 109/110/113). */}
          {floorNodes
            .filter(node => node.id === startNode || node.id === destination)
            .filter(node => node.type !== 'corridor' && node.type !== 'stairs')
            .map(node => {
              const center = toXY(node.x, node.y);
              const roomWidth = Math.max(1, Number(node.width) || 50) * scale;
              const roomHeight = Math.max(1, Number(node.height) || 50) * scale;
              const both = node.id === startNode && node.id === destination;
              const isStart = node.id === startNode;
              return (
                <Rect
                  key={'selection-' + node.id}
                  x={center.x - roomWidth / 2}
                  y={center.y - roomHeight / 2}
                  width={roomWidth}
                  height={roomHeight}
                  rx={5 * scale}
                  ry={5 * scale}
                  fill={both
                    ? 'rgba(24,95,165,0.25)'
                    : isStart
                      ? 'rgba(0,160,80,0.22)'
                      : 'rgba(200,60,60,0.22)'}
                  stroke={both ? '#185FA5' : isStart ? '#00834A' : '#C63C3C'}
                  strokeWidth={2 * scale}
                  pointerEvents="none"
                />
              );
            })}

          {route.length < 2 && mapData.edges.filter(edge =>
            edge.displayPath?.length && mapData.nodeMap[edge.from]?.floor === currentFloor
          ).map(edge => (
            <Polyline key={'possible-' + edge.id}
              points={edge.displayPath.map(p => (p.x * scale) + ',' + (p.y * scale)).join(' ')}
              fill="none" stroke="#38AFFF" strokeWidth={3 * scale}
              strokeLinejoin="round" strokeLinecap="round" pointerEvents="none" />
          ))}
          {routeDrawOrder.map(routeIndex =>
            routePaths[routeIndex].map((nodeId, index) => {
              if (index === 0) return null;

              const routePath = routePaths[routeIndex];
              const previous = mapData.nodeMap[routePath[index - 1]];
              const current = mapData.nodeMap[nodeId];

              if (!previous || !current) return null;
              if (previous.floor !== currentFloor || current.floor !== currentFloor) {
                return null;
              }

              const edge = getEdgeBetween(previous, current);
              const points = getRouteSegmentPoints(previous, current, edge);
              if (points.length < 2) return null;

              return (
                <Polyline
                  key={'route-' + routeIndex + '-' + index}
                  points={points.map(point => `${point.x * scale},${point.y * scale}`).join(' ')}
                  fill="none"
                  stroke={getRouteColor(routeIndex)}
                  strokeWidth={(routeIndex === activeRouteIndex ? 6 : 4) * scale}
                  strokeOpacity={routeIndex === activeRouteIndex ? 1 : 0.72}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })
          )}

          {route.map((nodeId, index) => {
            if (index === 0) return null;

            const previous = mapData.nodeMap[route[index - 1]];
            const current = mapData.nodeMap[nodeId];
            if (!previous || !current || previous.floor === current.floor) return null;

            const liftNode =
              previous.type === 'elevator'
                ? previous
                : current.type === 'elevator'
                  ? current
                  : null;

            if (!liftNode || liftNode.floor !== currentFloor) return null;

            const xy = toXY(liftNode.x, liftNode.y);
            return (
              <G key={'transition-' + index} x={xy.x} y={xy.y}>
                <Circle
                  r={15 * scale}
                  fill={getRouteColor(activeRouteIndex)}
                  stroke="#ffffff"
                  strokeWidth={3 * scale}
                />
                <SvgText
                  y={5 * scale}
                  fontSize={12 * scale}
                  fill="#ffffff"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  E
                </SvgText>
              </G>
            );
          })}
        </Svg>

        {floorNodes.map(node => {
          if (isWaypoint(node) || node.type === 'corridor' || node.type === 'stairs') {
            return null;
          }

          const { x, y } = toXY(node.x, node.y);
          // Keep touch targets usable without stealing neighboring narrow rooms.
          // Selection highlighting is handled by SVG at exact room geometry.
          const touchWidth = Math.max(32, (Number(node.width) || 32) * scale);
          const touchHeight = Math.max(44, (Number(node.height) || 44) * scale);

          return (
            <TouchableOpacity
              key={'touch-' + node.id}
              onPress={() => onNodeTap(node.id)}
              accessibilityRole="button"
              accessibilityLabel={(node.name || node.label || node.id) + ', Floor ' + node.floor}
              style={[
                styles.nodeTouchArea,
                {
                  width: touchWidth,
                  height: touchHeight,
                  left: x - touchWidth / 2,
                  top: y - touchHeight / 2,
                  borderRadius: 6,
                  backgroundColor: 'transparent',
                  borderColor: 'transparent',
                },
              ]}
            />
          );
        })}
      </View>

      <TouchableOpacity
        style={styles.fitButton}
        onPress={() => {
          zoomMultiplier.current = 1;
          currentScale.current = latestMapState.current.fitScale;
          setZoomLevel(1);
          centerMap();
        }}
        accessibilityRole="button"
        accessibilityLabel="Fit full floor plan in view"
      >
        <Text style={styles.fitButtonText}>Fit map</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    overflow: 'hidden',
  },
  mapLayer: {
    position: 'absolute',
  },
  svg: {
    overflow: 'visible',
  },
  fitButton: {
    position: 'absolute',
    left: 16,
    bottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    zIndex: 20,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
  },
  fitButtonText: {
    color: INDOOR_STROKE,
    fontSize: 14,
    fontWeight: '600',
  },
  nodeTouchArea: {
    position: 'absolute',
    borderWidth: 2,
    zIndex: 10,
  },
});
