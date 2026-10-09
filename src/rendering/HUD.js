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
    case 'elevator': return '🛗';
    case 'toilet':
    case 'restroom': return '🚻';
    case 'entrance': return '🚪';
    case 'stairs': return '↕';
    default: return '📍';
  }
}

function nodeLabel(node) {
  if (!node) return 'Not set';
  return node.name || node.code || node.label || node.id;
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

  const results = query.trim().length > 0
    ? searchableNodes
        .filter(node => {
          const haystack = [node.label, node.name, node.code, node.id]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

          return haystack.includes(query.trim().toLowerCase());
        })
        .slice(0, 6)
    : [];

  const floors = useMemo(
    () => [...new Set(mapData.nodes.map(node => node.floor))]
      .sort((a, b) => a - b),
    [mapData.nodes]
  );

  const locationNode = locationId ? mapData.nodeMap[locationId] : null;
  const destinationNode = destination ? mapData.nodeMap[destination] : null;
  const buildingName = mapData.buildingName || 'LC2';

  function chooseMode(nextMode) {
    setMode(nextMode);
    setQuery('');
    Keyboard.dismiss();
  }

  function selectNode(id) {
    Keyboard.dismiss();
    setQuery('');
    onSelectNode(id);
  }

  return (
    <View style={styles.hud} pointerEvents="box-none">
      <View style={styles.headerCard}>
        <View style={styles.brandRow}>
          <View style={styles.brandIcon}>
            <Text style={styles.brandIconText}>♿</Text>
          </View>

          <View style={styles.brandTextBox}>
            <Text style={styles.buildingName}>{buildingName}</Text>
            <Text style={styles.subtitle}>Accessible indoor navigation</Text>
          </View>

          {(locationId || destination) && (
            <TouchableOpacity
              style={styles.resetButton}
              onPress={onClearAll}
              accessibilityRole="button"
              accessibilityLabel="Clear route"
            >
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.routeCard}>
          <TouchableOpacity
            style={[
              styles.locationRow,
              mode === 'location' && styles.locationRowActive,
            ]}
            onPress={() => chooseMode('location')}
            accessibilityRole="button"
            accessibilityState={{ selected: mode === 'location' }}
            accessibilityLabel="Choose starting location"
          >
            <View style={[styles.routeMarker, styles.startMarker]} />
            <View style={styles.locationTextBox}>
              <Text style={styles.locationLabel}>FROM</Text>
              <Text style={styles.locationValue} numberOfLines={1}>
                {locationNode ? nodeLabel(locationNode) : 'Set your location'}
              </Text>
            </View>
            {locationNode ? (
              <TouchableOpacity
                style={styles.rowClearButton}
                onPress={onClearLocation}
                accessibilityRole="button"
                accessibilityLabel="Clear starting location"
              >
                <Text style={styles.rowClearText}>✕</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.rowChevron}>›</Text>
            )}
          </TouchableOpacity>

          <View style={styles.routeDivider} />

          <TouchableOpacity
            style={[
              styles.locationRow,
              mode === 'destination' && styles.locationRowActive,
            ]}
            onPress={() => chooseMode('destination')}
            accessibilityRole="button"
            accessibilityState={{ selected: mode === 'destination' }}
            accessibilityLabel="Choose destination"
          >
            <View style={[styles.routeMarker, styles.destinationMarker]} />
            <View style={styles.locationTextBox}>
              <Text style={styles.locationLabel}>TO</Text>
              <Text style={styles.locationValue} numberOfLines={1}>
                {destinationNode ? nodeLabel(destinationNode) : 'Choose destination'}
              </Text>
            </View>
            {destinationNode ? (
              <TouchableOpacity
                style={styles.rowClearButton}
                onPress={onClearDestination}
                accessibilityRole="button"
                accessibilityLabel="Clear destination"
              >
                <Text style={styles.rowClearText}>✕</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.rowChevron}>›</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.searchRow}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            style={styles.searchInput}
            placeholder={
              mode === 'location'
                ? 'Search your current room'
                : 'Search room or destination'
            }
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            onSubmitEditing={() => Keyboard.dismiss()}
            accessibilityLabel={
              mode === 'location'
                ? 'Search starting location'
                : 'Search destination'
            }
          />

          {query.length > 0 && (
            <TouchableOpacity
              style={styles.searchClearButton}
              onPress={() => setQuery('')}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              <Text style={styles.searchClearText}>✕</Text>
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
                  nodeLabel(node) + ', Floor ' + node.floor
                }
              >
                <View style={styles.resultIconBox}>
                  <Text style={styles.resultIcon}>{getIcon(node.type)}</Text>
                </View>
                <View style={styles.resultTextBox}>
                  <Text style={styles.resultText} numberOfLines={1}>
                    {nodeLabel(node)}
                  </Text>
                  <Text style={styles.resultSub}>Floor {node.floor}</Text>
                </View>
                <Text style={styles.resultChevron}>›</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {routeMessage && (
          <View style={styles.messageBox}>
            <Text style={styles.messageIcon}>!</Text>
            <Text style={styles.messageText}>{routeMessage}</Text>
          </View>
        )}
      </View>

      <View style={styles.floorControl}>
        <Text style={styles.floorLabel}>FLOOR</Text>
        <View style={styles.floorSegments}>
          {floors.map(floor => {
            const selected = currentFloor === floor;
            return (
              <TouchableOpacity
                key={floor}
                style={[
                  styles.floorButton,
                  selected && styles.floorButtonActive,
                ]}
                onPress={() => onFloor(floor)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={'Floor ' + floor}
              >
                <Text
                  style={[
                    styles.floorButtonText,
                    selected && styles.floorButtonTextActive,
                  ]}
                >
                  {floor}F
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hud: {
    position: 'absolute',
    top: 18,
    left: 14,
    right: 14,
    zIndex: 30,
  },
  headerCard: {
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderRadius: 22,
    padding: 14,
    elevation: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandIconText: {
    fontSize: 23,
  },
  brandTextBox: {
    flex: 1,
    marginLeft: 10,
  },
  buildingName: {
    color: '#111827',
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 1,
  },
  resetButton: {
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
  },
  resetText: {
    color: '#4B5563',
    fontSize: 12,
    fontWeight: '700',
  },
  routeCard: {
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  locationRow: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  locationRowActive: {
    backgroundColor: '#EFF6FF',
    borderLeftColor: '#2563EB',
  },
  routeMarker: {
    width: 12,
    height: 12,
    marginRight: 11,
  },
  startMarker: {
    borderRadius: 6,
    backgroundColor: '#16A34A',
  },
  destinationMarker: {
    borderRadius: 3,
    backgroundColor: '#DC2626',
  },
  locationTextBox: {
    flex: 1,
  },
  locationLabel: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  locationValue: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '650',
    marginTop: 2,
  },
  routeDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginLeft: 35,
  },
  rowClearButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowClearText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '700',
  },
  rowChevron: {
    color: '#94A3B8',
    fontSize: 24,
    lineHeight: 24,
  },
  searchRow: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE3EA',
    borderRadius: 14,
    marginTop: 10,
    paddingHorizontal: 12,
  },
  searchIcon: {
    color: '#64748B',
    fontSize: 24,
    marginRight: 6,
    marginTop: -2,
  },
  searchInput: {
    flex: 1,
    color: '#111827',
    fontSize: 14,
    paddingVertical: 0,
  },
  searchClearButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchClearText: {
    color: '#94A3B8',
    fontSize: 13,
  },
  results: {
    maxHeight: 230,
    marginTop: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  resultItem: {
    minHeight: 56,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  resultIconBox: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  resultIcon: {
    fontSize: 18,
  },
  resultTextBox: {
    flex: 1,
    marginLeft: 10,
  },
  resultText: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '700',
  },
  resultSub: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  resultChevron: {
    color: '#CBD5E1',
    fontSize: 22,
  },
  messageBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  messageIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    textAlign: 'center',
    lineHeight: 22,
    color: '#FFFFFF',
    backgroundColor: '#EA580C',
    fontWeight: '900',
    marginRight: 8,
  },
  messageText: {
    flex: 1,
    color: '#9A3412',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
  },
  floorControl: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 5,
    paddingLeft: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.98)',
    elevation: 6,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 9,
  },
  floorLabel: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    marginRight: 7,
  },
  floorSegments: {
    flexDirection: 'row',
    gap: 4,
  },
  floorButton: {
    minWidth: 48,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  floorButtonActive: {
    backgroundColor: '#2563EB',
  },
  floorButtonText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '800',
  },
  floorButtonTextActive: {
    color: '#FFFFFF',
  },
});
