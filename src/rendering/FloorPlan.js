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
  G,
} from 'react-native-svg';
import { getRouteColor } from './routeColors';

const FLOOR_ONE_FILL = '#B2B1CA';
const FLOOR_ONE_STROKE = '#312E81';
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
  const isFloorOne = Number(currentFloor) === 1;

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
  const toXY = (x, y) => ({ x: Number(x || 0) * scale, y: Number(y || 0) * scale });

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

  function getSegment(nodeA, nodeB) {
    if (!nodeA || !nodeB) return null;

    const a = toXY(nodeA.x, nodeA.y);
    const b = toXY(nodeB.x, nodeB.y);
    const dx = b.x - a.x;
    const dy = b.y - a.y;

    const hasBounds = node => Number(node.width) > 0 && Number(node.height) > 0;
    const boundaryFraction = node => {
      const halfWidth = (Number(node.width) * scale) / 2;
      const halfHeight = (Number(node.height) * scale) / 2;
      const fx = Math.abs(dx) > 0 ? halfWidth / Math.abs(dx) : Infinity;
      const fy = Math.abs(dy) > 0 ? halfHeight / Math.abs(dy) : Infinity;
      return Math.min(fx, fy);
    };

    const startFraction = hasBounds(nodeA) ? boundaryFraction(nodeA) : 0;
    const endFraction = hasBounds(nodeB) ? boundaryFraction(nodeB) : 0;

    return {
      startX: a.x + dx * startFraction,
      startY: a.y + dy * startFraction,
      endX: b.x - dx * endFraction,
      endY: b.y - dy * endFraction,
    };
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
            fill={isFloorOne ? FLOOR_ONE_FILL : '#ffffff'}
            stroke={isFloorOne ? FLOOR_ONE_STROKE : '#888888'}
            strokeWidth={(isFloorOne ? 2.5 : 4) * scale}
            strokeLinejoin="round"
          />

          {!isFloorOne &&
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

            if (isFloorOne && isStairs) {
              return renderStairs(node, x, y, roomWidth, roomHeight);
            }

            if (isFloorOne && isElevator) {
              return renderElevator(node, x, y, roomWidth, roomHeight);
            }

            const structureFill = isFloorOne
              ? FLOOR_ONE_FILL
              : isElevator
                ? '#d0d0d0'
                : isStairs
                  ? '#e4e4e4'
                  : isRestroom
                    ? '#f2f5f6'
                    : '#f8f8f8';

            return (
              <React.Fragment key={'structure-' + node.id}>
                {Array.isArray(node.geometryParts) && node.geometryParts.length > 0 ? (
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
                  <Rect
                    x={x - roomWidth / 2}
                    y={y - roomHeight / 2}
                    width={roomWidth}
                    height={roomHeight}
                    fill={structureFill}
                    stroke={WALL_COLOR}
                    strokeWidth={2 * scale}
                  />
                )}

                <SvgText
                  x={x}
                  y={y + 5 * scale}
                  fontSize={(isRestroom ? 10 : 14) * scale}
                  fill="#111111"
                  textAnchor="middle"
                  fontWeight={isFloorOne ? 'normal' : 'bold'}
                >
                  {isRestroom ? node.code || 'WC' : node.code || node.label || node.id}
                </SvgText>
              </React.Fragment>
            );
          })}

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

              const segment = getSegment(previous, current);
              if (!segment) return null;

              return (
                <Line
                  key={'route-' + routeIndex + '-' + index}
                  x1={segment.startX}
                  y1={segment.startY}
                  x2={segment.endX}
                  y2={segment.endY}
                  stroke={getRouteColor(routeIndex)}
                  strokeWidth={(routeIndex === activeRouteIndex ? 6 : 4) * scale}
                  strokeOpacity={routeIndex === activeRouteIndex ? 1 : 0.72}
                  strokeLinecap="round"
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
          const touchWidth = Math.max(48, (Number(node.width) || 48) * scale);
          const touchHeight = Math.max(48, (Number(node.height) || 48) * scale);
          const isStart = startNode === node.id;
          const isDest = destination === node.id;

          let backgroundColor = 'transparent';
          let borderColor = 'transparent';

          if (isStart && isDest) {
            backgroundColor = 'rgba(24,95,165,0.25)';
            borderColor = '#185FA5';
          } else if (isStart) {
            backgroundColor = 'rgba(0,160,80,0.22)';
            borderColor = '#00834A';
          } else if (isDest) {
            backgroundColor = 'rgba(200,60,60,0.22)';
            borderColor = '#C63C3C';
          }

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
                  backgroundColor,
                  borderColor,
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
    color: FLOOR_ONE_STROKE,
    fontSize: 14,
    fontWeight: '600',
  },
  nodeTouchArea: {
    position: 'absolute',
    borderWidth: 2,
    zIndex: 10,
  },
});
