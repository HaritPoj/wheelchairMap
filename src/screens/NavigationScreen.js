import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { getMapData } from '../../assets/data/buildingLoader';
import { findAllPaths } from '../logic/pathfinder';
import FloorPlan from '../rendering/FloorPlan';
import HUD from '../rendering/HUD';
import DirectionsSheet from '../rendering/DirectionsSheet';
import NextStepBanner from '../rendering/NextStepBanner';
import CameraScanner from '../rendering/CameraScanner';

export default function NavigationScreen() {
  const mapData = useMemo(() => getMapData(), []);
  const [currentFloor, setCurrentFloor] = useState(
    () => mapData.floors[0]?.level ?? 1
  );
  const [locationId, setLocationId] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routeOptions, setRouteOptions] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const route = routeOptions[selectedRouteIndex] || [];
  const [showDirections, setShowDirections] = useState(false);
  const [mode, setMode] = useState('destination');
  const [routeMessage, setRouteMessage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (!locationId || !destination) {
      setRouteOptions([]);
      setSelectedRouteIndex(0);
      setShowDirections(false);
      setRouteMessage(null);
      return;
    }

    const paths = findAllPaths(locationId, destination, mapData);
    setRouteOptions(paths);
    setSelectedRouteIndex(0);
    const path = paths[0] || [];

    if (path.length === 0) {
      setShowDirections(false);
      setRouteMessage(
        'No wheelchair-accessible route was found between these locations.'
      );
      return;
    }

    if (path.length === 1) {
      setShowDirections(false);
      setRouteMessage('You are already at the destination.');
      return;
    }

    setRouteMessage(null);
    setShowDirections(true);
  }, [locationId, destination, mapData]);

  function handleNodeSelect(id) {
    const node = mapData.nodeMap[id];

    if (!node) return;

    setCurrentFloor(node.floor);
    setRouteMessage(null);

    if (mode === 'destination') {
      setDestination(id);
      setMode('location');
    } else {
      setLocationId(id);
      setMode('destination');
    }
  }

  function handleClearAll() {
    setLocationId(null);
    setDestination(null);
    setRouteOptions([]);
    setSelectedRouteIndex(0);
    setShowDirections(false);
    setRouteMessage(null);
    setMode('destination');
  }

  function handleClearLocation() {
    setLocationId(null);
    setRouteMessage(null);
  }

  function handleClearDestination() {
    setDestination(null);
    setRouteMessage(null);
  }

  function handleRoomDetected(roomId) {
    const room = mapData.nodeMap[roomId];

    if (!room || room.type !== 'room') {
      Alert.alert(
        'Location not found',
        'That room is not on the current map.'
      );
      return;
    }

    setLocationId(roomId);
    setCurrentFloor(room.floor);
    setMode('destination');
    setRouteMessage(null);
    setIsScanning(false);
  }

  if (isScanning) {
    return (
      <CameraScanner
        mapData={mapData}
        onRoomDetected={handleRoomDetected}
        onClose={() => setIsScanning(false)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <FloorPlan
        mapData={mapData}
        currentFloor={currentFloor}
        route={route}
        routes={routeOptions}
        selectedRouteIndex={selectedRouteIndex}
        onNodeTap={handleNodeSelect}
        destination={destination}
        startNode={locationId}
      />

      <HUD
        mapData={mapData}
        currentFloor={currentFloor}
        onFloor={setCurrentFloor}
        locationId={locationId}
        destination={destination}
        mode={mode}
        setMode={setMode}
        onSelectNode={handleNodeSelect}
        onClearLocation={handleClearLocation}
        onClearDestination={handleClearDestination}
        onClearAll={handleClearAll}
        routeMessage={routeMessage}
      />

      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => setIsScanning(true)}
        accessibilityRole="button"
        accessibilityLabel="Scan room sign"
      >
        <Text style={styles.scanButtonText}>Scan Room Sign</Text>
      </TouchableOpacity>

      {showDirections && (
        <DirectionsSheet
          route={route}
          routes={routeOptions}
          selectedRouteIndex={selectedRouteIndex}
          onSelectRoute={setSelectedRouteIndex}
          nodeMap={mapData.nodeMap}
          edges={mapData.edges}
          onClose={() => setShowDirections(false)}
        />
      )}

      {route.length > 1 && (
        <NextStepBanner
          route={route}
          nodeMap={mapData.nodeMap}
          edges={mapData.edges}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scanButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: '#333',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    zIndex: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  scanButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
