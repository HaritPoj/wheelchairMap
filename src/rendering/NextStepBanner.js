import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { generateRouteSteps } from '../logic/routeInstructions';

function getIcon(type) {
  switch (type) {
    case 'elevator': return '🛗';
    case 'toilet':
    case 'restroom': return '🚻';
    case 'entrance': return '🚪';
    case 'stairs': return '↕';
    default: return '➜';
  }
}

export default function NextStepBanner({ route, nodeMap, edges, onPress }) {
  if (!route || route.length < 2) return null;

  const steps = generateRouteSteps(route, nodeMap, edges);
  const firstAction = steps[1] || steps[0];
  const destination = nodeMap[route[route.length - 1]];

  if (!firstAction || !destination) return null;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.92}
      accessibilityRole="button"
      accessibilityLabel="Open accessible route directions"
      accessibilityHint="Shows the full turn-by-turn route"
    >
      <View style={styles.iconBox}>
        <Text style={styles.icon}>{getIcon(firstAction.icon)}</Text>
      </View>

      <View style={styles.copy}>
        <View style={styles.eyebrowRow}>
          <Text style={styles.eyebrow}>NEXT STEP</Text>
          <View style={styles.accessiblePill}>
            <Text style={styles.accessiblePillText}>♿ Accessible</Text>
          </View>
        </View>

        <Text style={styles.instruction} numberOfLines={2}>
          {firstAction.instruction}
        </Text>

        {firstAction.warning ? (
          <Text style={styles.warning} numberOfLines={1}>
            ! {firstAction.warning}
          </Text>
        ) : (
          <Text style={styles.destination} numberOfLines={1}>
            To {destination.name || destination.code || destination.id}
          </Text>
        )}
      </View>

      <View style={styles.actionBox}>
        <Text style={styles.actionText}>Directions</Text>
        <Text style={styles.chevron}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 88,
    minHeight: 92,
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#1D4ED8',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 25,
    elevation: 10,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.24,
    shadowRadius: 12,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },
  icon: {
    fontSize: 25,
    color: '#FFFFFF',
  },
  copy: {
    flex: 1,
    paddingRight: 8,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 4,
  },
  eyebrow: {
    color: '#BFDBFE',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.1,
  },
  accessiblePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: 'rgba(220,252,231,0.16)',
  },
  accessiblePillText: {
    color: '#DCFCE7',
    fontSize: 9,
    fontWeight: '700',
  },
  instruction: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18,
  },
  destination: {
    color: '#DBEAFE',
    fontSize: 11,
    marginTop: 4,
  },
  warning: {
    color: '#FFEDD5',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
  actionBox: {
    minWidth: 74,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  chevron: {
    color: '#BFDBFE',
    fontSize: 24,
    lineHeight: 24,
    marginTop: -1,
  },
});
