import React, { useRef, useState } from 'react';
import {
  View,
  ScrollView,
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

const IMAGE_WIDTH = 1200;
const IMAGE_HEIGHT = 450;

export default function FloorPlan({
  mapData,
  currentFloor,
  route,
  onNodeTap,
  destination,
  startNode,
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const currentScale = useRef(1);
  const initialScale = useRef(1);
  const initialDistance = useRef(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: event =>
        event.nativeEvent.touches.length >= 2,
      onMoveShouldSetPanResponder: event =>
        event.nativeEvent.touches.length >= 2,

      onPanResponderGrant: event => {
        if (event.nativeEvent.touches.length < 2) return;

        const [first, second] = event.nativeEvent.touches;
        const dx = first.pageX - second.pageX;
        const dy = first.pageY - second.pageY;

        initialDistance.current = Math.sqrt(dx * dx + dy * dy);
        initialScale.current = currentScale.current;
      },

      onPanResponderMove: event => {
        if (
          event.nativeEvent.touches.length < 2 ||
          initialDistance.current === null
        ) {
          return;
        }

        const [first, second] = event.nativeEvent.touches;
        const dx = first.pageX - second.pageX;
        const dy = first.pageY - second.pageY;

        const distance = Math.sqrt(dx * dx + dy * dy);
        const scaleFactor =
          initialDistance.current > 0
            ? distance / initialDistance.current
            : 1;

        const nextZoom = Math.max(
          0.6,
          Math.min(initialScale.current * scaleFactor, 3.5)
        );

        currentScale.current = nextZoom;
        setZoomLevel(nextZoom);
      },

      onPanResponderRelease: () => {
        initialDistance.current = null;
      },
      onPanResponderTerminate: () => {
        initialDistance.current = null;
      },
    })
  ).current;

  const scale = zoomLevel;
  const mapWidth = IMAGE_WIDTH * scale;
  const mapHeight = IMAGE_HEIGHT * scale;

  const toXY = (x, y) => ({
    x: x * scale,
    y: y * scale,
  });

  const isWaypoint = node =>
    node.type === 'corridor' ||
    node.width === 0 ||
    node.height === 0 ||
    node.id.startsWith('hall_') ||
    node.id.startsWith('corner_');

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

  const buildingFramePoints = [
    [5, 405],
    [1205, 405],
    [1205, 5],
    [990, 5],
    [990, 250],
    [5, 250],
  ]
    .map(([x, y]) => x * scale + ',' + y * scale)
    .join(' ');

  return (
    <View style={styles.wrapper} {...panResponder.panHandlers}>
      <ScrollView
        style={styles.verticalScroll}
        contentContainerStyle={{
          width: mapWidth,
          minHeight: mapHeight,
          justifyContent: 'center',
        }}
        centerContent
        showsVerticalScrollIndicator={false}
      >
        <ScrollView
          horizontal
          contentContainerStyle={{
            width: mapWidth,
            height: mapHeight,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          centerContent
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
        >
          <View style={{ width: mapWidth, height: mapHeight }}>
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
                if (isWaypoint(node)) return null;

                const { x, y } = toXY(node.x, node.y);
                const roomWidth =
                  Math.max(1, Number(node.width) || 50) * scale;
                const roomHeight =
                  Math.max(1, Number(node.height) || 50) * scale;
                const isElevator =
                  node.type === 'lift' ||
                  node.id.startsWith('elevator_');

                return (
                  <React.Fragment key={'structure-' + node.id}>
                    <Rect
                      x={x - roomWidth / 2}
                      y={y - roomHeight / 2}
                      width={roomWidth}
                      height={roomHeight}
                      fill={isElevator ? '#d0d0d0' : '#f8f8f8'}
                      stroke="#000000"
                      strokeWidth={2}
                    />

                    <SvgText
                      x={x}
                      y={y + (isElevator ? 4 : 5)}
                      fontSize={isElevator ? 11 * scale : 14 * scale}
                      fill="#333333"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      {isElevator ? 'Elev' : node.id}
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
                    previous.type === 'lift'
                      ? previous
                      : current.type === 'lift'
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
              if (isWaypoint(node)) return null;

              const { x, y } = toXY(node.x, node.y);
              const isElevator =
                node.type === 'lift' ||
                node.id.startsWith('elevator_');

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
                    (node.name || node.id) +
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
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#d8e3e8',
  },
  verticalScroll: {
    flex: 1,
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
