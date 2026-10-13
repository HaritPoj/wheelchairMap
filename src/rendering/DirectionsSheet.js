import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { generateRouteSteps } from '../logic/routeInstructions';
import { getRouteColor } from './routeColors';

const SCREEN = Dimensions.get('window');

function getTypeIcon(type) {
  switch (type) {
    case 'elevator': return '🛗';
    case 'toilet':
    case 'restroom': return '🚻';
    case 'entrance': return '🚪';
    case 'stairs': return '↕';
    default: return '•';
  }
}

function nodeLabel(node) {
  return node?.name || node?.code || node?.label || node?.id || 'Location';
}

export default function DirectionsSheet({
  route,
  routes,
  selectedRouteIndex = 0,
  onSelectRoute,
  nodeMap,
  edges,
  onClose,
}) {
  if (!route || route.length < 2) return null;

  const routeOptions = routes && routes.length > 0 ? routes : [route];
  const steps = generateRouteSteps(route, nodeMap, edges);
  const start = nodeMap[route[0]];
  const destination = nodeMap[route[route.length - 1]];

  return (
    <View style={styles.sheet}>
      <View style={styles.handle} />

      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <View style={styles.accessibleBadge}>
            <Text style={styles.accessibleBadgeText}>♿ ACCESSIBLE ROUTE</Text>
          </View>
          <Text style={styles.title}>Directions</Text>
          <Text style={styles.routeSummary} numberOfLines={1}>
            {nodeLabel(start)}  →  {nodeLabel(destination)}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close directions"
        >
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statPill}>
          <Text style={styles.statValue}>{steps.length}</Text>
          <Text style={styles.statLabel}>STEPS</Text>
        </View>
        <View style={styles.statPill}>
          <Text style={styles.statValue}>{routeOptions.length}</Text>
          <Text style={styles.statLabel}>
            {routeOptions.length === 1 ? 'ROUTE' : 'ROUTES'}
          </Text>
        </View>
        <View style={[styles.statPill, styles.elevatorStat]}>
          <Text style={styles.statValue}>🛗</Text>
          <Text style={styles.statLabel}>ELEVATOR OK</Text>
        </View>
      </View>

      {routeOptions.length > 1 && (
        <View style={styles.routeOptionsWrap}>
          <Text style={styles.sectionLabel}>CHOOSE ROUTE</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.routeOptions}
          >
            {routeOptions.map((option, index) => {
              const isSelected = index === selectedRouteIndex;
              const optionSteps = generateRouteSteps(option, nodeMap, edges).length;

              return (
                <TouchableOpacity
                  key={'route-option-' + index}
                  style={[
                    styles.routeOption,
                    isSelected && styles.routeOptionSelected,
                  ]}
                  onPress={() => onSelectRoute(index)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                >
                  <View
                    style={[
                      styles.routeColor,
                      { backgroundColor: getRouteColor(index) },
                    ]}
                  />
                  <View>
                    <Text
                      style={[
                        styles.routeOptionTitle,
                        isSelected && styles.routeOptionTitleSelected,
                      ]}
                    >
                      Route {index + 1}
                    </Text>
                    <Text style={styles.routeOptionSub}>{optionSteps} steps</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      <View style={styles.listHeader}>
        <Text style={styles.sectionLabel}>TURN-BY-TURN</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {steps.map((step, index) => {
          const isFirst = index === 0;
          const isLast = index === steps.length - 1;

          return (
            <View key={step.key} style={styles.stepRow}>
              <View style={styles.timelineCol}>
                <View
                  style={[
                    styles.stepIcon,
                    isFirst && styles.stepIconStart,
                    isLast && styles.stepIconFinish,
                  ]}
                >
                  <Text
                    style={[
                      styles.stepIconText,
                      (isFirst || isLast) && styles.stepIconTextStrong,
                    ]}
                  >
                    {isLast ? '✓' : getTypeIcon(step.icon)}
                  </Text>
                </View>
                {!isLast && <View style={styles.timelineLine} />}
              </View>

              <View style={[styles.stepCard, isLast && styles.stepCardLast]}>
                <Text style={styles.stepNumber}>
                  {isFirst ? 'START' : isLast ? 'ARRIVE' : `STEP ${index}`}
                </Text>
                <Text style={styles.instruction}>{step.instruction}</Text>

                {step.warning ? (
                  <View style={styles.warningBox}>
                    <Text style={styles.warningIcon}>!</Text>
                    <Text style={styles.warningText}>{step.warning}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: SCREEN.height * 0.64,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    zIndex: 60,
    elevation: 18,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
  },
  handle: {
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 12,
  },
  headerCopy: {
    flex: 1,
  },
  accessibleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 7,
    backgroundColor: '#DCFCE7',
    marginBottom: 7,
  },
  accessibleBadgeText: {
    color: '#15803D',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  title: {
    color: '#111827',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  routeSummary: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 3,
    paddingRight: 8,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  closeText: {
    color: '#475569',
    fontSize: 15,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  statPill: {
    flex: 1,
    minHeight: 54,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
  },
  elevatorStat: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  statValue: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '800',
  },
  statLabel: {
    color: '#94A3B8',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginTop: 2,
  },
  routeOptionsWrap: {
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  sectionLabel: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  routeOptions: {
    paddingHorizontal: 20,
    gap: 8,
  },
  routeOption: {
    minWidth: 126,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  routeOptionSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#93C5FD',
  },
  routeColor: {
    width: 4,
    height: 30,
    borderRadius: 2,
  },
  routeOptionTitle: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '700',
  },
  routeOptionTitleSelected: {
    color: '#1D4ED8',
  },
  routeOptionSub: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 2,
  },
  listHeader: {
    paddingTop: 13,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  stepRow: {
    flexDirection: 'row',
    minHeight: 76,
  },
  timelineCol: {
    width: 38,
    alignItems: 'center',
  },
  stepIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#93C5FD',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  stepIconStart: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  stepIconFinish: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  stepIconText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '800',
  },
  stepIconTextStrong: {
    color: '#FFFFFF',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#DBEAFE',
  },
  stepCard: {
    flex: 1,
    marginLeft: 10,
    paddingTop: 2,
    paddingBottom: 18,
  },
  stepCardLast: {
    paddingBottom: 6,
  },
  stepNumber: {
    color: '#94A3B8',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 4,
  },
  instruction: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '650',
    lineHeight: 20,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#FFF7ED',
  },
  warningIcon: {
    width: 20,
    height: 20,
    lineHeight: 20,
    textAlign: 'center',
    borderRadius: 10,
    color: '#FFFFFF',
    backgroundColor: '#EA580C',
    fontSize: 11,
    fontWeight: '900',
    marginRight: 7,
  },
  warningText: {
    flex: 1,
    color: '#9A3412',
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 16,
  },
});
