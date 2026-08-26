import { View, Text, ScrollView, 
         TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const SCREEN = Dimensions.get('window');

function getTypeIcon(type) {
  switch(type) {
    case 'lift':     return '🛗';
    case 'toilet':   return '🚻';
    case 'entrance': return '🚪';
    case 'corridor': return '🚶';
    default:         return '📍';
  }
}

function generateSteps(route, nodeMap, edges) {
  if (!route || route.length < 2) return [];
  const steps = [];

  for (let i = 0; i < route.length; i++) {
    const node = nodeMap[route[i]];
    const nextNode = i < route.length - 1 ? nodeMap[route[i + 1]] : null;

    // Find edge between current and next node
    const edge = nextNode ? edges.find(e =>
      (e.from === route[i] && e.to === route[i + 1]) ||
      (e.to === route[i] && e.from === route[i + 1])
    ) : null;

    // Build instruction
    let instruction = '';
    let warning = '';

    if (i === 0) {
      instruction = `Start at ${node.name}`;
    } else if (node.type === 'lift') {
      const prevNode = nodeMap[route[i - 1]];
      if (prevNode.floor !== node.floor) {
        instruction = `Take ${node.name} to Floor ${node.floor}`;
      } else {
        instruction = `Enter ${node.name}`;
      }
    } else if (node.type === 'corridor') {
      instruction = `Continue through ${node.name}`;
    } else if (i === route.length - 1) {
      instruction = `Arrive at ${node.name}`;
    } else {
      instruction = `Head towards ${node.name}`;
    }

    // Add warnings based on next edge/node
    if (nextNode) {
      if (nextNode.threshold >= 0.02)
        warning = `⚠️ Threshold ahead (${(nextNode.threshold * 100).toFixed(0)}cm)`;
      else if (nextNode.door_width < 0.9)
        warning = `⚠️ Narrow door ahead (${nextNode.door_width}m)`;
      else if (edge && edge.slope >= 3.0)
        warning = `⚠️ Slope ahead (${edge.slope}°)`;
      else if (edge && edge.width < 1.2)
        warning = `ℹ️ Corridor width ${edge.width}m`;
    }

    steps.push({
      index: i,
      icon: getTypeIcon(node.type),
      instruction,
      warning,
      isFirst: i === 0,
      isLast: i === route.length - 1,
      node,
    });
  }

  return steps;
}

export default function DirectionsSheet({ route, nodeMap, edges, onClose }) {
  if (!route || route.length < 2) return null;

  const steps = generateSteps(route, nodeMap, edges);
  const totalSteps = steps.length;

  return (
    <View style={styles.sheet}>
      {/* Handle bar */}
      <View style={styles.handle} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Directions</Text>
          <Text style={styles.headerSub}>{totalSteps - 1} steps to destination</Text>
        </View>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Steps */}
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {steps.map((step, i) => (
          <View key={i} style={styles.stepRow}>
            {/* Left: icon + line */}
            <View style={styles.stepLeft}>
              <View style={[
                styles.iconCircle,
                step.isFirst && styles.iconFirst,
                step.isLast && styles.iconLast,
              ]}>
                <Text style={styles.iconText}>{step.icon}</Text>
              </View>
              {!step.isLast && <View style={styles.stepLine} />}
            </View>

            {/* Right: instruction */}
            <View style={styles.stepRight}>
              <Text style={[
                styles.stepInstruction,
                step.isLast && styles.stepInstructionLast,
              ]}>
                {step.instruction}
              </Text>
              {step.warning ? (
                <Text style={styles.stepWarning}>{step.warning}</Text>
              ) : null}
            </View>
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN.height * 0.5,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#D3D1C7',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  headerSub: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 14,
    color: '#555',
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 14,
    minHeight: 60,
  },
  stepLeft: {
    alignItems: 'center',
    width: 36,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E6F1FB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#185FA5',
  },
  iconFirst: {
    backgroundColor: '#185FA5',
  },
  iconLast: {
    backgroundColor: '#085041',
    borderColor: '#085041',
  },
  iconText: {
    fontSize: 16,
  },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#B5D4F4',
    marginVertical: 2,
  },
  stepRight: {
    flex: 1,
    paddingBottom: 16,
    paddingTop: 6,
  },
  stepInstruction: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
    lineHeight: 20,
  },
  stepInstructionLast: {
    color: '#085041',
    fontWeight: '600',
  },
  stepWarning: {
    fontSize: 12,
    color: '#633806',
    marginTop: 4,
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
  },
});