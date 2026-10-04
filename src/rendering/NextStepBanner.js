import { View, Text, StyleSheet } from 'react-native';
import { generateRouteSteps } from '../logic/routeInstructions';

function getIcon(type) {
  switch (type) {
    case 'lift': return '🛗';
    case 'toilet': return '🚻';
    case 'entrance': return '🚪';
    default: return '🚶';
  }
}

export default function NextStepBanner({ route, nodeMap, edges }) {
  if (!route || route.length < 2) return null;

  const steps = generateRouteSteps(route, nodeMap, edges);
  const firstAction = steps[1] || steps[0];
  const destination = nodeMap[route[route.length - 1]];

  if (!firstAction || !destination) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.icon}>{getIcon(firstAction.icon)}</Text>

      <View style={styles.textBox}>
        <Text style={styles.next}>{firstAction.instruction}</Text>
        <Text style={styles.dest}>
          Destination: {destination.name}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    bottom: 110,
    left: 16,
    right: 16,
    backgroundColor: '#185FA5',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    elevation: 5,
    zIndex: 15,
  },
  icon: {
    fontSize: 24,
  },
  textBox: {
    flex: 1,
  },
  next: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  dest: {
    color: '#E6F1FB',
    fontSize: 12,
    marginTop: 2,
  },
});
