import React, { useEffect, useRef, useState } from 'react';
import {
  View,
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

export default function FloorPlan({
  mapData,
  currentFloor,
  route,
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
  const gestureStartPoint = useRef(null);

  const currentFloorData =
    mapData.floors.find(floor => floor.level === currentFloor) ||
    mapData.floors[0] ||
    { map: { width: 1200, height: 450 } };

  const mapWidthSource = Number(currentFloorData.map?.width) || 1200;
  const mapHeightSource = Number(currentFloorData.map?.height) || 450;
  const fitScale =
    viewport.width > 0 && viewport.height > 0
      ? Math.min(
          1,
          (viewport.width * 0.94) / mapWidthSource,
          (viewport.height * 0.94) / mapHeightSource
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

    // When the map is larger than the viewport, its top-left position
    // can move from (viewport - content) to 0.
    //
    // When the map is smaller than the viewport, it can move from 0 to
    // (viewport - content), so the user can scroll it all the way down/right.
    const xDifference = currentViewport.width - contentWidth;
    const yDifference = currentViewport.height - contentHeight;

    const minX = Math.min(0, xDifference);
    const maxX = Math.max(0, xDifference);

    const minY = Math.min(0, yDifference);
    const maxY = Math.max(0, yDifference);

    return {
      x: Math.max(minX, Math.min(offset.x, maxX)),
      y: Math.max(minY, Math.min(offset.y, maxY)),
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

      onMoveShouldSetPanResponder: (_, gestureState) => {
        if (Math.abs(gestureState.dx) > 4 || Math.abs(gestureState.dy) > 4) {
          return true;
        }

        return false;
      },

      onPanResponderGrant: event => {
        const touches = event.nativeEvent.touches;

        gestureStartOffset.current = { ...currentOffset.current };
        gestureStartScale.current = zoomMultiplier.current;

        if (touches.length === 1) {
          gestureStartPoint.current = {
            x: touches[0].pageX,
            y: touches[0].pageY,
          };
        } else {
          gestureStartPoint.current = null;
        }

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

          const scaleFactor =
            gestureStartDistance.current > 0
              ? distance / gestureStartDistance.current
              : 1;

          const nextZoom = Math.max(
            0.6,
            Math.min(3.5, gestureStartScale.current * scaleFactor)
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
        gestureStartPoint.current = null;
      },

      onPanResponderTerminate: () => {
        gestureStartDistance.current = null;
        gestureStartPoint.current = null;
      },
    })
  ).current;

  const scale = fitScale * zoomLevel;
  const mapWidth = mapWidthSource * scale;
  const mapHeight = mapHeightSource * scale;

  const toXY = (x, y) => ({
    x: x * scale,
    y: y * scale,
  });

  const isWaypoint = node =>
    node.type === 'corridor' &&
    !(Number(node.width) > 0 && Number(node.height) > 0);

  const floorNodes = mapData.nodes.filter(node => node.floor === currentFloor);

  function getSegment(nodeA, nodeB) {
    if (!nodeA || !nodeB) return null;

    const a = toXY(nodeA.x, nodeA.y);
    const b = toXY(nodeB.x, nodeB.y);

    let startX = a.x;
    let startY = a.y;
    let endX = b.x;
    let endY = b.y;

    if (!isWaypoint(nodeA)) {
      const width = Math.max(1, Number(nodeA.width) || 50) * scale;
      const height = Math.max(1, Number(nodeA.height) || 50) * scale;

      if (a.x === b.x) {
        startY = a.y < b.y ? a.y + height / 2 : a.y - height / 2;
      } else if (a.y === b.y) {
        startX = a.x < b.x ? a.x + width / 2 : a.x - width / 2;
      }
    }

    if (!isWaypoint(nodeB)) {
      const width = Math.max(1, Number(nodeB.width) || 50) * scale;
      const height = Math.max(1, Number(nodeB.height) || 50) * scale;

      if (a.x === b.x) {
        endY = a.y < b.y ? b.y - height / 2 : b.y + height / 2;
      } else if (a.y === b.y) {
        endX = a.x < b.x ? b.x - width / 2 : b.x + width / 2;
      }
    }

    return { startX, startY, endX, endY };
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
    .map(([x, y]) => x * scale + ',' + y * scale)
    .join(' ');

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
            fill="#ffffff"
            stroke="#888888"
            strokeWidth={4 * scale}
            strokeLinejoin="round"
          />

          {floorNodes.map(node => {
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
            const roomWidth =
              Math.max(1, Number(node.width) || 50) * scale;
            const roomHeight =
              Math.max(1, Number(node.height) || 50) * scale;
            const isElevator = node.type === 'elevator';
            const isStairs = node.type === 'stairs';
            const isRestroom =
              node.type === 'restroom' || node.type === 'toilet';
            const isSmallFacility = isStairs || isRestroom;

            return (
              <React.Fragment key={'structure-' + node.id}>
                <Rect
                  x={x - roomWidth / 2}
                  y={y - roomHeight / 2}
                  width={roomWidth}
                  height={roomHeight}
                  fill={
                    isElevator
                      ? '#d0d0d0'
                      : isStairs
                        ? '#e4e4e4'
                        : isRestroom
                          ? '#f2f5f6'
                          : '#f8f8f8'
                  }
                  stroke="#000000"
                  strokeWidth={2}
                />

                <SvgText
                  x={x}
                  y={y + (isElevator ? 4 : 5)}
                  fontSize={isElevator ? 11 * scale : isSmallFacility ? 9 * scale : 14 * scale}
                  fill="#333333"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  {isElevator
                    ? 'Elevator'
                    : isStairs
                      ? 'Stairs'
                      : isRestroom
                        ? (node.code || 'WC')
                        : (node.code || node.label || node.id)}
                </SvgText>
              </React.Fragment>
            );
          })}

          {route.map((nodeId, index) => {
            if (index === 0) return null;

            const previous = mapData.nodeMap[route[index - 1]];
            const current = mapData.nodeMap[nodeId];

            if (!previous || !current) return null;

            if (
              previous.floor !== currentFloor ||
              current.floor !== currentFloor
            ) {
              return null;
            }

            const segment = getSegment(previous, current);

            return segment ? (
              <Line
                key={'route-' + index}
                x1={segment.startX}
                y1={segment.startY}
                x2={segment.endX}
                y2={segment.endY}
                stroke="#0066ff"
                strokeWidth={6 * scale}
                strokeLinecap="round"
              />
            ) : null;
          })}

          {route.map((nodeId, index) => {
            if (index === 0) return null;

            const previous = mapData.nodeMap[route[index - 1]];
            const current = mapData.nodeMap[nodeId];

            if (!previous || !current) return null;

            if (previous.floor !== current.floor) {
              const liftNode =
                previous.type === 'elevator'
                  ? previous
                  : current.type === 'elevator'
                    ? current
                    : null;

              if (!liftNode || liftNode.floor !== currentFloor) {
                return null;
              }

              const xy = toXY(liftNode.x, liftNode.y);

              return (
                <G
                  key={'transition-' + index}
                  x={xy.x}
                  y={xy.y}
                >
                  <Circle
                    r={15 * scale}
                    fill="#0066ff"
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
            }

            return null;
          })}
        </Svg>

        {floorNodes.map(node => {
          if (isWaypoint(node) || node.type === 'corridor' || node.type === 'stairs') return null;

          const { x, y } = toXY(node.x, node.y);
          const isElevator = node.type === 'elevator';

          const touchWidth = Math.max(
            48,
            (Number(node.width) || 48) * scale
          );
          const touchHeight = Math.max(
            48,
            (Number(node.height) || 48) * scale
          );

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
              accessibilityLabel={
                (node.name || node.label || node.id) +
                ', Floor ' +
                node.floor
              }
              style={[
                styles.nodeTouchArea,
                {
                  width: touchWidth,
                  height: touchHeight,
                  left: x - touchWidth / 2,
                  top: y - touchHeight / 2,
                  borderRadius: isElevator ? 8 : 10,
                  backgroundColor,
                  borderColor,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#d8e3e8',
    overflow: 'hidden',
  },
  mapLayer: {
    position: 'absolute',
  },
  svg: {
    overflow: 'visible',
  },
  nodeTouchArea: {
    position: 'absolute',
    borderWidth: 2,
    zIndex: 10,
  },
});
