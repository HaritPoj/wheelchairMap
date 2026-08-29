import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import mapData from '../../assets/data/map.json';
import { findPath } from '../logic/pathfinder';
import FloorPlan from '../rendering/FloorPlan';
import HUD from '../rendering/HUD';
import DirectionsSheet from '../rendering/DirectionsSheet';
import NextStepBanner from '../rendering/NextStepBanner';
import CameraScanner from '../rendering/CameraScanner';

mapData.nodeMap = {};
mapData.nodes.forEach(n => {
  n.label = n.name;
  mapData.nodeMap[n.id] = n;
});

export default function NavigationScreen() {
  const [currentFloor, setCurrentFloor] = useState(1);
  const [locationId, setLocationId] = useState(null);
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState([]);
  const [showDirections, setShowDirections] = useState(false);
  const [mode, setMode] = useState('destination');
  
  // State to show/hide the camera
  const [isScanning, setIsScanning] = useState(false); 

  useEffect(() => {
    if (locationId && destination) {
      const path = findPath(locationId, destination, mapData);
      setRoute(path);
      setShowDirections(true);
    } else {
      setRoute([]);
      setShowDirections(false);
    }
  }, [locationId, destination]);

  function handleNodeTap(id) {
    if (mode === 'location') {
      setLocationId(id);
      setMode('destination');
    } else {
      setDestination(id);
    }
  }

  function handleClearAll() {
    setLocationId(null);
    setDestination(null);
    setRoute([]);
    setShowDirections(false);
    setMode('destination');
  }

  // Handler for when the camera finds a room
  const handleRoomDetected = (roomId) => {
    setLocationId(roomId); 
    setMode('destination'); 
    setIsScanning(false); 
  };

  // If scanning is active, render the camera instead of the map
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
      {/* FLOATING SCAN BUTTON */}
      <TouchableOpacity 
        style={styles.scanButton}
        onPress={() => setIsScanning(true)}
      >
        <Text style={styles.scanButtonText}>📷 Scan Sign</Text>
      </TouchableOpacity>

      <FloorPlan 
        mapData={mapData}
        currentFloor={currentFloor}
        route={route}
        onNodeTap={handleNodeTap}
        destination={destination}
      />
      
      <HUD
        mapData={mapData}
        currentFloor={currentFloor}
        onFloor={setCurrentFloor}
        onDestination={setDestination}
        onLocation={setLocationId}
        locationId={locationId}
        destination={destination}
        mode={mode}
        setMode={setMode}
        onClearAll={handleClearAll}
      />
      
      {showDirections && (
        <DirectionsSheet
          route={route}
          nodeMap={mapData.nodeMap}
          edges={mapData.edges}
          onClose={() => setShowDirections(false)}
        />
      )}
      
      {route.length > 0 && (
        <NextStepBanner route={route} nodeMap={mapData.nodeMap} />
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
    fontSize: 16
  }
});