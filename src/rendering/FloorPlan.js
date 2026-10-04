import React, { useState, useRef } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, PanResponder } from 'react-native';
import Svg, { Line, Rect, Circle, Text as SvgText, Polygon, G } from 'react-native-svg';

export default function FloorPlan({ mapData, currentFloor, route, onNodeTap, destination, startNode }) {
  const IMAGE_WIDTH = 1200; 
  const IMAGE_HEIGHT = 450; 
  const NODE_SIZE = 40; 

  const [zoomLevel, setZoomLevel] = useState(1.0); 

  const currentScale = useRef(1.0);
  const initialScale = useRef(1.0);
  const initialDistance = useRef(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt) => evt.nativeEvent.touches.length >= 2,
      onMoveShouldSetPanResponder: (evt) => evt.nativeEvent.touches.length >= 2,
      
      onPanResponderGrant: (evt) => {
        if (evt.nativeEvent.touches.length >= 2) {
          const touches = evt.nativeEvent.touches;
          const dx = touches[0].pageX - touches[1].pageX;
          const dy = touches[0].pageY - touches[1].pageY;
          
          initialDistance.current = Math.sqrt(dx * dx + dy * dy);
          initialScale.current = currentScale.current;
        }
      },
      
      onPanResponderMove: (evt) => {
        if (evt.nativeEvent.touches.length >= 2 && initialDistance.current !== null) {
          const touches = evt.nativeEvent.touches;
          const dx = touches[0].pageX - touches[1].pageX;
          const dy = touches[0].pageY - touches[1].pageY;
          
          const distance = Math.sqrt(dx * dx + dy * dy);
          const scaleFactor = distance / initialDistance.current;
          let newZoom = initialScale.current * scaleFactor;
          
          newZoom = Math.max(0.4, Math.min(newZoom, 3.5)); 
          
          currentScale.current = newZoom;
          setZoomLevel(newZoom);
        }
      },
      
      onPanResponderRelease: () => {
        initialDistance.current = null;
      },
    })
  ).current;

  const SCALE = zoomLevel; 
  const TRANS_WIDTH = IMAGE_WIDTH * SCALE; 
  const TRANS_HEIGHT = IMAGE_HEIGHT * SCALE; 

  const getTransXY = (origX, origY) => {
    return { x: origX * SCALE, y: origY * SCALE };
  };

  const isWaypoint = (node) => {
    return (
      node.width === 0 ||
      node.height === 0 ||
      node.id.startsWith('hall_') ||
      node.id.startsWith('corner_')
    );
  };

  const floorNodes = mapData.nodes.filter(node => node.floor === currentFloor);

  const buildingFramePoints = `
    ${5 * SCALE},${405 * SCALE} 
    ${1205 * SCALE},${405 * SCALE} 
    ${1205 * SCALE},${5 * SCALE} 
    ${990 * SCALE},${5 * SCALE} 
    ${990 * SCALE},${250 * SCALE} 
    ${5 * SCALE},${250 * SCALE}
  `;

  return (
    <View style={styles.wrapper} {...panResponder.panHandlers}>
      <ScrollView 
        style={styles.container} 
        /* เพิ่ม paddingTop และ paddingBottom ให้กว้างขึ้นเพื่อให้ลากขึ้นลงได้สุดขอบ */
        contentContainerStyle={{ paddingTop: 500, paddingBottom: 500 }}
        centerContent={true} 
      >
        <ScrollView 
          horizontal 
          /* เพิ่ม padding ซ้ายขวา ให้ลากได้อิสระเช่นกัน */
          contentContainerStyle={{ paddingLeft: 500, paddingRight: 500 }}
          centerContent={true}
        >
          <View style={{ width: TRANS_WIDTH, height: TRANS_HEIGHT, backgroundColor: 'transparent' }}>
            
            <Svg height="100%" width="100%" style={{ overflow: 'visible' }}>
              
              {/* โครงตึก */}
              <Polygon
                points={buildingFramePoints}
                fill="#ffffff"
                stroke="#888888"
                strokeWidth={4 * SCALE}
                strokeLinejoin="round"
              />

              {/* ห้องและลิฟต์ (เฉพาะชั้นปัจจุบัน) */}
              {floorNodes.map((nodeOrig) => {
                if (isWaypoint(nodeOrig)) return null;

                const nodeXY = getTransXY(nodeOrig.x, nodeOrig.y);
                const roomWidth = nodeOrig.width * SCALE;
                const roomHeight = nodeOrig.height * SCALE;
                
                const isElevator = nodeOrig.id.startsWith('elevator_');
                const boxColor = isElevator ? '#d0d0d0' : '#f8f8f8';
                const labelText = isElevator ? 'Elev' : nodeOrig.id;

                return (
                  <React.Fragment key={`structure-${nodeOrig.id}`}>
                    <Rect
                      x={nodeXY.x - (roomWidth / 2)}
                      y={nodeXY.y - (roomHeight / 2)}
                      width={roomWidth}
                      height={roomHeight}
                      fill={boxColor}
                      stroke="#000000"
                      strokeWidth="2"
                    />
                    <SvgText
                      x={nodeXY.x}
                      y={nodeXY.y + (isElevator ? 3 : 4)} 
                      fontSize={isElevator ? 11 * SCALE : 14 * SCALE}
                      fill="#333333"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      {labelText}
                    </SvgText>
                  </React.Fragment>
                );
              })}

              {/* เส้นนำทาง (สีเทา) สำหรับชั้นอื่น */}
              {route.map((nodeId, index) => {
                if (index === 0) return null;
                const prevNodeOrig = mapData.nodeMap[route[index - 1]];
                const currNodeOrig = mapData.nodeMap[nodeId];
                
                if (prevNodeOrig.floor === currentFloor || currNodeOrig.floor === currentFloor) return null;

                const prevXY = getTransXY(prevNodeOrig.x, prevNodeOrig.y);
                const currXY = getTransXY(currNodeOrig.x, currNodeOrig.y);

                let startX = prevXY.x;
                let startY = prevXY.y;
                let endX = currXY.x;
                let endY = currXY.y;

                if (!isWaypoint(prevNodeOrig)) {
                  const roomWidth = (prevNodeOrig.width || 50) * SCALE;
                  const roomHeight = (prevNodeOrig.height || 50) * SCALE;
                  if (prevXY.x === currXY.x) { startY = prevXY.y < currXY.y ? prevXY.y + (roomHeight / 2) : prevXY.y - (roomHeight / 2); } 
                  else if (prevXY.y === currXY.y) { startX = prevXY.x < currXY.x ? prevXY.x + (roomWidth / 2) : prevXY.x - (roomWidth / 2); }
                }

                if (!isWaypoint(currNodeOrig)) {
                  const roomWidth = (currNodeOrig.width || 50) * SCALE;
                  const roomHeight = (currNodeOrig.height || 50) * SCALE;
                  if (prevXY.x === currXY.x) { endY = prevXY.y < currXY.y ? currXY.y - (roomHeight / 2) : currXY.y + (roomHeight / 2); } 
                  else if (prevXY.y === currXY.y) { endX = prevXY.x < currXY.x ? currXY.x - (roomWidth / 2) : currXY.x + (roomWidth / 2); }
                }

                return (
                  <React.Fragment key={`line-inactive-${index}`}>
                    <Line
                      x1={startX}
                      y1={startY}
                      x2={endX}
                      y2={endY}
                      stroke="#c0c0c0" 
                      strokeWidth={6 * SCALE} 
                      strokeLinecap="round"
                    />
                  </React.Fragment>
                );
              })}

              {/* เส้นนำทาง (สีน้ำเงิน) สำหรับชั้นปัจจุบัน */}
              {route.map((nodeId, index) => {
                if (index === 0) return null;
                const prevNodeOrig = mapData.nodeMap[route[index - 1]];
                const currNodeOrig = mapData.nodeMap[nodeId];
                
                if (prevNodeOrig.floor !== currentFloor || currNodeOrig.floor !== currentFloor) return null;

                const prevXY = getTransXY(prevNodeOrig.x, prevNodeOrig.y);
                const currXY = getTransXY(currNodeOrig.x, currNodeOrig.y);

                let startX = prevXY.x;
                let startY = prevXY.y;
                let endX = currXY.x;
                let endY = currXY.y;

                if (!isWaypoint(prevNodeOrig)) {
                  const roomWidth = (prevNodeOrig.width || 50) * SCALE;
                  const roomHeight = (prevNodeOrig.height || 50) * SCALE;
                  if (prevXY.x === currXY.x) { startY = prevXY.y < currXY.y ? prevXY.y + (roomHeight / 2) : prevXY.y - (roomHeight / 2); } 
                  else if (prevXY.y === currXY.y) { startX = prevXY.x < currXY.x ? prevXY.x + (roomWidth / 2) : prevXY.x - (roomWidth / 2); }
                }

                if (!isWaypoint(currNodeOrig)) {
                  const roomWidth = (currNodeOrig.width || 50) * SCALE;
                  const roomHeight = (currNodeOrig.height || 50) * SCALE;
                  if (prevXY.x === currXY.x) { endY = prevXY.y < currXY.y ? currXY.y - (roomHeight / 2) : currXY.y + (roomHeight / 2); } 
                  else if (prevXY.y === currXY.y) { endX = prevXY.x < currXY.x ? currXY.x - (roomWidth / 2) : currXY.x + (roomWidth / 2); }
                }

                return (
                  <React.Fragment key={`line-active-${index}`}>
                    <Line
                      x1={startX}
                      y1={startY}
                      x2={endX}
                      y2={endY}
                      stroke="#0066ff" 
                      strokeWidth={6 * SCALE} 
                      strokeLinecap="round"
                    />
                    {!isWaypoint(currNodeOrig) && (
                      <Circle cx={endX} cy={endY} r={6 * SCALE} fill="#0044cc" />
                    )}
                  </React.Fragment>
                );
              })}

              {/* ไอคอนจุดเชื่อมต่อลิฟต์ข้ามชั้น */}
              {route.map((nodeId, index) => {
                if (index === 0) return null;
                const prevNodeOrig = mapData.nodeMap[route[index - 1]];
                const currNodeOrig = mapData.nodeMap[nodeId];
                
                if (prevNodeOrig.floor !== currNodeOrig.floor) {
                  const xy = getTransXY(prevNodeOrig.x, prevNodeOrig.y);
                  return (
                    <G key={`transition-node-${index}`} x={xy.x} y={xy.y}>
                      <Circle r={14 * SCALE} fill="#0066ff" stroke="#ffffff" strokeWidth={3 * SCALE} />
                      <Circle r={6 * SCALE} fill="#ffffff" />
                    </G>
                  );
                }
                return null;
              })}

            </Svg>

            {/* พื้นที่สัมผัส */}
            {floorNodes.map((nodeOrig) => {
              if (isWaypoint(nodeOrig)) return null;

              const nodeXY = getTransXY(nodeOrig.x, nodeOrig.y);
              const isElevator = nodeOrig.id.startsWith('elevator_');
              const transformedNodeSize = isElevator ? (30 * SCALE) : (NODE_SIZE * SCALE);

              const isStart = startNode === nodeOrig.id;
              const isDest = destination === nodeOrig.id;
              
              let bgColor = 'transparent';
              let borderColor = 'transparent';

              if (isStart) {
                bgColor = 'rgba(0, 255, 0, 0.4)'; 
                borderColor = 'green';
              } else if (isDest) {
                bgColor = 'rgba(255, 0, 0, 0.4)'; 
                borderColor = 'red';
              }

              return (
                <TouchableOpacity
                  key={`touch-${nodeOrig.id}`}
                  onPress={() => onNodeTap(nodeOrig.id)}
                  style={[
                    styles.nodeTouchArea,
                    { 
                      width: transformedNodeSize,
                      height: transformedNodeSize,
                      borderRadius: transformedNodeSize / 2,
                      left: nodeXY.x - (transformedNodeSize / 2),
                      top: nodeXY.y - (transformedNodeSize / 2),
                      backgroundColor: bgColor,
                      borderColor: borderColor
                    }
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
    backgroundColor: '#d8e3e8' 
  },
  container: { 
    flex: 1, 
  },
  nodeTouchArea: {
    position: 'absolute',
    borderWidth: 2,
    zIndex: 10,
  }
});