import { View, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import mapData from '../../assets/data/map.json';
import { findPath } from '../logic/pathfinder';
import FloorPlan from '../rendering/FloorPlan';
import HUD from '../rendering/HUD';
import DirectionsSheet from '../rendering/DirectionsSheet';
import NextStepBanner from '../rendering/NextStepBanner';

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

  // When user taps a node on the map
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

  return (
    <View style={styles.container}>
      <FloorPlan
        mapData={mapData}
        currentFloor={currentFloor}
        route={route}
        onNodeTap={handleNodeTap}
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
});