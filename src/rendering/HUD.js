import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { useMemo, useState } from 'react';

function getIcon(type) {
  switch (type) {
    case 'lift': return '🛗';
    case 'toilet': return '🚻';
    case 'entrance': return '🚪';
    default: return '📍';
  }
}

export default function HUD({
  mapData,
  currentFloor,
  onFloor,
  locationId,
  destination,
  mode,
  setMode,
  onSelectNode,
  onClearLocation,
  onClearDestination,
  onClearAll,
  routeMessage,
}) {
  const [query, setQuery] = useState('');

  const searchableNodes = useMemo(
    () => mapData.nodes.filter(node => node.type !== 'corridor'),
    [mapData.nodes]
  );

  const results = query.length > 0
    ? searchableNodes
        .filter(node =>
          (node.label || node.name || node.id)
            .toLowerCase()
            .includes(query.toLowerCase())
        )
        .slice(0, 8)
    : [];

  const floors = useMemo(
    () => [...new Set(mapData.nodes.map(node => node.floor))]
      .sort((a, b) => a - b),
    [mapData.nodes]
  );

  function selectNode(id) {
    Keyboard.dismiss();
    setQuery('');
    onSelectNode(id);
  }

  const locationNode = locationId ? mapData.nodeMap[locationId] : null;
  const destinationNode = destination ? mapData.nodeMap[destination] : null;

  return (
    <View style={styles.hud}>
      <View style={styles.modeRow}>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'location' && styles.modeBtnActive]}
          onPress={() => {
            setMode('location');
            setQuery('');
          }}
          accessibilityRole="button"
          accessibilityState={{ selected: mode === 'location' }}
        >
          <Text style={mode === 'location' ? styles.modeBtnTextActive : styles.modeBtnText}>
            My location
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeBtn, mode === 'destination' && styles.modeBtnActive]}
          onPress={() => {
            setMode('destination');
            setQuery('');
          }}
          accessibilityRole="button"
          accessibilityState={{ selected: mode === 'destination' }}
        >
          <Text style={mode === 'destination' ? styles.modeBtnTextActive : styles.modeBtnText}>
            Destination
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.selectionBox}>
        <Text style={styles.selectionLabel}>From</Text>
        <Text style={styles.selectionValue} numberOfLines={1}>
          {locationNode ? locationNode.name : 'Not set'}
        </Text>
        {locationNode && (
          <TouchableOpacity
            style={styles.selectionClear}
            onPress={onClearLocation}
            accessibilityRole="button"
            accessibilityLabel="Clear starting location"
          >
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.selectionBox}>
        <Text style={styles.selectionLabel}>To</Text>
        <Text style={styles.selectionValue} numberOfLines={1}>
          {destinationNode ? destinationNode.name : 'Not set'}
        </Text>
        {destinationNode && (
          <TouchableOpacity
            style={styles.selectionClear}
            onPress={onClearDestination}
            accessibilityRole="button"
            accessibilityLabel="Clear destination"
          >
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.search}
          placeholder={
            mode === 'location'
              ? 'Search starting location...'
              : 'Search destination...'
          }
          value={query}
          onChangeText={setQuery}
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()}
          accessibilityLabel={
            mode === 'location'
              ? 'Search starting location'
              : 'Search destination'
          }
        />

        {query.length > 0 && (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={() => {
              Keyboard.dismiss();
              setQuery('');
            }}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {results.length > 0 && (
        <ScrollView
          style={styles.results}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
        >
          {results.map(node => (
            <TouchableOpacity
              key={node.id}
              style={styles.resultItem}
              onPress={() => selectNode(node.id)}
              accessibilityRole="button"
              accessibilityLabel={
                (node.name || node.id) + ', Floor ' + node.floor
              }
            >
              <Text style={styles.resultText}>
                {getIcon(node.type)} {node.label || node.name || node.id}
              </Text>
              <Text style={styles.resultSub}>Floor {node.floor}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {routeMessage && (
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>{routeMessage}</Text>
        </View>
      )}

      <View style={styles.floorRow}>
        {floors.map(floor => (
          <TouchableOpacity
            key={floor}
            style={[
              styles.floorBtn,
              currentFloor === floor && styles.floorBtnActive,
            ]}
            onPress={() => onFloor(floor)}
            accessibilityRole="button"
            accessibilityState={{ selected: currentFloor === floor }}
          >
            <Text style={currentFloor === floor ? styles.floorBtnTextActive : styles.floorBtnText}>
              Floor {floor}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {(locationId || destination) && (
        <TouchableOpacity
          style={styles.clearAllBtn}
          onPress={onClearAll}
          accessibilityRole="button"
          accessibilityLabel="Clear route"
        >
          <Text style={styles.clearAllText}>✕ Clear route</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hud: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  modeBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    elevation: 2,
  },
  modeBtnActive: {
    backgroundColor: '#185FA5',
  },
  modeBtnText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  modeBtnTextActive: {
    fontSize: 13,
    color: 'white',
    fontWeight: '500',
  },
  selectionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 4,
    elevation: 2,
    gap: 8,
  },
  selectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#185FA5',
    width: 36,
  },
  selectionValue: {
    flex: 1,
    fontSize: 13,
    color: '#333',
  },
  selectionClear: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  search: {
    flex: 1,
    padding: 12,
    fontSize: 15,
  },
  clearBtn: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  clearText: {
    fontSize: 16,
    color: '#888',
  },
  results: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 4,
    maxHeight: 220,
    elevation: 3,
  },
  resultItem: {
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  resultSub: {
    fontSize: 12,
    color: '#888',
  },
  messageBox: {
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#E6C96A',
  },
  messageText: {
    fontSize: 12,
    color: '#633806',
    lineHeight: 17,
  },
  floorRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  floorBtn: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 2,
  },
  floorBtnActive: {
    backgroundColor: '#185FA5',
  },
  floorBtnText: {
    color: '#333',
    fontWeight: '500',
  },
  floorBtnTextActive: {
    color: 'white',
    fontWeight: '500',
  },
  clearAllBtn: {
    backgroundColor: '#FCEBEB',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#F7C1C1',
  },
  clearAllText: {
    color: '#A32D2D',
    fontWeight: '500',
    fontSize: 14,
  },
});
