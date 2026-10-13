import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { getMapData } from '../../assets/data/buildingLoader';
import { findPath } from '../logic/pathfinder';
import FloorPlan from '../rendering/FloorPlan';
import BuildingOverview from '../rendering/BuildingOverview';
import HUD from '../rendering/HUD';
import DirectionsSheet from '../rendering/DirectionsSheet';
import NextStepBanner from '../rendering/NextStepBanner';
import CameraScanner from '../rendering/CameraScanner';

export default function NavigationScreen() {
  const mapData = useMemo(() => getMapData(), []);
  const [currentFloor, setCurrentFloor] = useState(
    () => mapData.floors[0]?.level ?? 1
  );
  const [viewMode, setViewMode] = useState('floor');
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

    // findPath() uses A* and already applies wheelchair accessibility
    // constraints. Only the best accessible route is shown to the user.
    const bestPath = findPath(locationId, destination, mapData);
    const paths = bestPath.length > 0 ? [bestPath] : [];

    setRouteOptions(paths);
    setSelectedRouteIndex(0);

    if (paths.length === 0) {
      setShowDirections(false);
      setRouteMessage(
        'No wheelchair-accessible route was found between these locations.'
      );
      return;
    }

    if (bestPath.length === 1) {
      setShowDirections(false);
      setRouteMessage('You are already at the destination.');
      return;
    }

    setRouteMessage('Best wheelchair-accessible route selected with A*.');
    setShowDirections(false);
  }, [locationId, destination, mapData]);

  function openFloor(floor) {
    setCurrentFloor(floor);
    setViewMode('floor');
  }

  function handleNodeSelect(id) {
    const node = mapData.nodeMap[id];

    if (!node) return;

    setCurrentFloor(node.floor);
    setViewMode('floor');
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
    setRouteOptions([]);
    setSelectedRouteIndex(0);
    setShowDirections(false);
    setRouteMessage(null);
    setMode('location');
  }

  function handleClearDestination() {
    setDestination(null);
    setRouteOptions([]);
    setSelectedRouteIndex(0);
    setShowDirections(false);
    setRouteMessage(null);
    setMode('destination');
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
    setViewMode('floor');
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
      {viewMode === 'site' ? (
        <BuildingOverview
          mapData={mapData}
          onOpenFloor={openFloor}
        />
      ) : (
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
      )}

      <HUD
        mapData={mapData}
        currentFloor={currentFloor}
        viewMode={viewMode}
        onShowSite={() => setViewMode('site')}
        onFloor={openFloor}
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

      {!showDirections && viewMode !== 'site' && (
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => setIsScanning(true)}
          accessibilityRole="button"
          accessibilityLabel="Scan room sign"
          accessibilityHint="Uses the camera to set your current room"
        >
          <Text style={styles.scanIcon}>📷</Text>
          <Text style={styles.scanButtonText}>Scan</Text>
        </TouchableOpacity>
      )}

      {!showDirections && viewMode !== 'site' && route.length > 1 && (
        <NextStepBanner
          route={route}
          nodeMap={mapData.nodeMap}
          edges={mapData.edges}
          onPress={() => setShowDirections(true)}
        />
      )}

      {showDirections && viewMode !== 'site' && (
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF2F7',
  },
  scanButton: {
    position: 'absolute',
    right: 18,
    bottom: 24,
    minWidth: 92,
    height: 52,
    paddingHorizontal: 16,
    borderRadius: 26,
    backgroundColor: '#111827',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    zIndex: 20,
    elevation: 8,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
  },
  scanIcon: {
    fontSize: 19,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
