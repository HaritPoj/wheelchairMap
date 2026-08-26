import { View, StyleSheet, Dimensions, PanResponder } from 'react-native';
import Svg, { Circle, Text, Line } from 'react-native-svg';
import { useState, useRef, useEffect } from 'react';

const SCREEN = Dimensions.get('window');
const MAP_WIDTH = 1300;
const MAP_HEIGHT = 1200;
const LIMIT_X = SCREEN.width * 0.5;
const LIMIT_Y = SCREEN.height * 0.5;

export default function FloorPlan({ mapData, currentFloor, route, onNodeTap }) {
  const routeSet = new Set(route);
  const nodes = mapData.nodes.filter(n => n.floor === currentFloor);
  const scaleX = SCREEN.width / MAP_WIDTH;
  const scaleY = SCREEN.height / MAP_HEIGHT;

  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const lastTranslate = useRef({ x: 0, y: 0 });
  const lastTouch = useRef(null);
  const isDragging = useRef(false);

  // Auto-center on route when it changes
  useEffect(() => {
    if (route.length > 0) {
      const routeNodes = route
        .map(id => mapData.nodeMap[id])
        .filter(n => n && n.floor === currentFloor);

      if (routeNodes.length > 0) {
        // Find center point of the route
        const xs = routeNodes.map(n => n.x * scaleX);
        const ys = routeNodes.map(n => n.y * scaleY);
        const minX = Math.min(...xs), maxX = Math.max(...xs);
        const minY = Math.min(...ys), maxY = Math.max(...ys);
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        // Translate so route center aligns with screen center
        const newX = SCREEN.width / 2 - centerX;
        const newY = SCREEN.height / 2 - centerY;

        const clampedX = Math.min(LIMIT_X, Math.max(-LIMIT_X, newX));
        const clampedY = Math.min(LIMIT_Y, Math.max(-LIMIT_Y, newY));

        lastTranslate.current = { x: clampedX, y: clampedY };
        setTranslate({ x: clampedX, y: clampedY });
      }
    }
  }, [route, currentFloor]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 5 || Math.abs(g.dy) > 5,
    onPanResponderGrant: (e) => {
      isDragging.current = false;
      lastTouch.current = { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY };
    },
    onPanResponderMove: (e) => {
      const touch = e.nativeEvent;
      if (lastTouch.current) {
        const dx = touch.pageX - lastTouch.current.x;
        const dy = touch.pageY - lastTouch.current.y;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) isDragging.current = true;

        const newX = Math.min(LIMIT_X, Math.max(-LIMIT_X, lastTranslate.current.x + dx));
        const newY = Math.min(LIMIT_Y, Math.max(-LIMIT_Y, lastTranslate.current.y + dy));

        lastTranslate.current = { x: newX, y: newY };
        lastTouch.current = { x: touch.pageX, y: touch.pageY };
        setTranslate({ x: newX, y: newY });
      }
    },
    onPanResponderRelease: () => { lastTouch.current = null; },
  });

  const routeLines = [];
  for (let i = 0; i < route.length - 1; i++) {
    const a = mapData.nodeMap[route[i]];
    const b = mapData.nodeMap[route[i + 1]];
    if (a && b && a.floor === currentFloor && b.floor === currentFloor) {
      // Outline (darker, wider) — gives the route depth like Google Maps
      routeLines.push(
        <Line
          key={`line-outline-${i}`}
          x1={a.x * scaleX} y1={a.y * scaleY}
          x2={b.x * scaleX} y2={b.y * scaleY}
          stroke="#0C447C"
          strokeWidth={9}
          strokeLinecap="round"
        />
      );
    }
  }
  // Main line on top (solid, bright)
  for (let i = 0; i < route.length - 1; i++) {
    const a = mapData.nodeMap[route[i]];
    const b = mapData.nodeMap[route[i + 1]];
    if (a && b && a.floor === currentFloor && b.floor === currentFloor) {
      routeLines.push(
        <Line
          key={`line-${i}`}
          x1={a.x * scaleX} y1={a.y * scaleY}
          x2={b.x * scaleX} y2={b.y * scaleY}
          stroke="#185FA5"
          strokeWidth={6}
          strokeLinecap="round"
        />
      );
    }
  }

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={[styles.canvas, {
        transform: [
          { translateX: translate.x },
          { translateY: translate.y },
        ]
      }]}>
        <Svg style={styles.svg}>
          {routeLines}
          {nodes.map(node => (
            <Circle
              key={node.id}
              cx={node.x * scaleX}
              cy={node.y * scaleY}
              r={routeSet.has(node.id) ? 8 : 12}
              fill={
                route[0] === node.id ? '#185FA5' :
                route[route.length - 1] === node.id ? '#085041' :
                routeSet.has(node.id) ? '#185FA5' :
                node.door_width < 0.9 ? '#D3D1C7' :
                '#9FE1CB'
              }
              stroke="white"
              strokeWidth={2}
              onPress={() => { if (!isDragging.current) onNodeTap(node.id); }}
            />
          ))}
          {nodes.map(node => (
            <Text
              key={node.id + '_label'}
              x={node.x * scaleX}
              y={node.y * scaleY - 18}
              fontSize={10}
              textAnchor="middle"
              fill="#333"
            >
              {node.label}
            </Text>
          ))}
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0', overflow: 'hidden' },
  canvas: { width: SCREEN.width, height: SCREEN.height },
  svg: { position: 'absolute', width: '100%', height: '100%' },
});