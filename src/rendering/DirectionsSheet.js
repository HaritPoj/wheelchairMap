import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { generateRouteSteps } from '../logic/routeInstructions';

const SCREEN = Dimensions.get('window');

function getTypeIcon(type) {
  switch (type) {
    case 'lift': return '🛗';
    case 'toilet': return '🚻';
    case 'entrance': return '🚪';
    default: return '📍';
  }
}

export default function DirectionsSheet({ route, nodeMap, edges, onClose }) {
  if (!route || route.length < 2) return null;

  const steps = generateRouteSteps(route, nodeMap, edges);

  return (
    <View style={styles.sheet}>
      <View style={styles.handle} />

      <View style={styles.header}>
        <View style={styles.headerTextBox}>
          <Text style={styles.headerTitle}>Accessible directions</Text>
          <Text style={styles.headerSub}>
            {steps.length} instructions
          </Text>
        </View>

        <TouchableOpacity
          style={styles.closeBtn}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close directions"
        >
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {steps.map((step, index) => (
          <View key={step.key} style={styles.stepRow}>
            <View style={styles.stepLeft}>
              <View
                style={[
                  styles.iconCircle,
                  index === 0 && styles.iconFirst,
                  index === steps.length - 1 && styles.iconLast,
                ]}
              >
                <Text style={styles.iconText}>
                  {getTypeIcon(step.icon)}
                </Text>
              </View>

              {index < steps.length - 1 && <View style={styles.stepLine} />}
            </View>

            <View style={styles.stepRight}>
              <Text
                style={[
                  styles.stepInstruction,
                  index === steps.length - 1 &&
                    styles.stepInstructionLast,
                ]}
              >
                {step.instruction}
              </Text>

              {step.warning ? (
                <Text style={styles.stepWarning}>
                  {step.warning}
                </Text>
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
  headerTextBox: {
    flex: 1,
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
