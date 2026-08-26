import { View, Text, TextInput, TouchableOpacity,
         ScrollView, StyleSheet, Keyboard } from 'react-native';
import { useState } from 'react';

export default function HUD({ mapData, currentFloor, onFloor,
                               onDestination, onLocation,
                               locationId, destination,
                               mode, setMode, onClearAll }) { 
  const [query, setQuery] = useState('');
  //const [mode, setMode] = useState('destination'); // 'destination' or 'location'

  const results = query.length > 0
    ? mapData.nodes.filter(n =>
        n.label.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  function handleSelect(id) {
    Keyboard.dismiss();
    setQuery('');
    if (mode === 'location') {
      onLocation(id);
      setMode('destination'); // switch back after setting
    } else {
      onDestination(id);
    }
  }

  function handleClear() {
    Keyboard.dismiss();
    setQuery('');
    if (mode === 'destination') onDestination(null);
    else onLocation(null);
  }

  const locationNode = locationId
    ? mapData.nodeMap[locationId] : null;
  const destinationNode = destination
    ? mapData.nodeMap[destination] : null;

  return (
    <View style={styles.hud}>

      {/* Mode toggle */}
      <View style={styles.modeRow}>
        <TouchableOpacity
          style={[styles.modeBtn,
            mode === 'location' && styles.modeBtnActive]}
          onPress={() => { setMode('location'); setQuery(''); }}>
          <Text style={mode === 'location'
            ? styles.modeBtnTextActive : styles.modeBtnText}>
            📍 My location
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeBtn,
            mode === 'destination' && styles.modeBtnActive]}
          onPress={() => { setMode('destination'); setQuery(''); }}>
          <Text style={mode === 'destination'
            ? styles.modeBtnTextActive : styles.modeBtnText}>
            🏁 Destination
          </Text>
        </TouchableOpacity>
      </View>

      {/* Current selections display */}
      <View style={styles.selectionBox}>
        <Text style={styles.selectionLabel}>From:</Text>
        <Text style={styles.selectionValue} numberOfLines={1}>
          {locationNode ? locationNode.name : 'Not set — tap map or search'}
        </Text>
      </View>
      <View style={styles.selectionBox}>
        <Text style={styles.selectionLabel}>To:</Text>
        <Text style={styles.selectionValue} numberOfLines={1}>
          {destinationNode ? destinationNode.name : 'Not set — tap map or search'}
        </Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.search}
          placeholder={mode === 'location'
            ? 'Search your location...'
            : 'Search destination...'}
          value={query}
          onChangeText={setQuery}
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()}
        />
        {query.length > 0 && (
          <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Search results */}
      {results.length > 0 && (
        <ScrollView style={styles.results} keyboardShouldPersistTaps="handled">
          {results.map(n => (
            <TouchableOpacity
              key={n.id}
              style={styles.resultItem}
              onPress={() => handleSelect(n.id)}
            >
              <Text style={styles.resultText}>
                {n.type === 'lift' ? '🛗' :
                 n.type === 'toilet' ? '🚻' :
                 n.type === 'entrance' ? '🚪' : '📍'} {n.label}
              </Text>
              <Text style={styles.resultSub}>Floor {n.floor}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Floor switcher */}
      <View style={styles.floorRow}>
        {[1, 2].map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.floorBtn,
              currentFloor === f && styles.floorBtnActive]}
            onPress={() => onFloor(f)}
          >
            <Text style={currentFloor === f
              ? styles.floorBtnTextActive : styles.floorBtnText}>
              Floor {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Clear all button — only show when something is selected */}
      {(locationId || destination) && (
        <TouchableOpacity style={styles.clearAllBtn} onPress={onClearAll}>
          <Text style={styles.clearAllText}>✕ Clear route</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hud: {
    position: 'absolute', top: 50,
    left: 16, right: 16, zIndex: 10,
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
    maxHeight: 180,
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
  floorBtnActive: { backgroundColor: '#185FA5' },
  floorBtnText: { color: '#333', fontWeight: '500' },
  floorBtnTextActive: { color: 'white', fontWeight: '500' },
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