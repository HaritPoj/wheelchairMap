import { View, Text, StyleSheet } from 'react-native';

function getIcon(type) {
  switch(type) {
    case 'lift':     return '🛗';
    case 'toilet':   return '🚻';
    case 'entrance': return '🚪';
    default:         return '🚶';
  }
}

export default function NextStepBanner({ route, nodeMap }) {
  if (!route || route.length < 2) return null;

  const destNode = nodeMap[route[route.length - 1]];
  const nextNode = nodeMap[route[1]] || destNode;

  return (
    <View style={styles.banner}>
      <Text style={styles.icon}>{getIcon(nextNode.type)}</Text>
      <View style={styles.textBox}>
        <Text style={styles.next}>Head to {nextNode.name}</Text>
        <Text style={styles.dest}>Destination: {destNode.name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 50,
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
  icon: { fontSize: 24 },
  textBox: { flex: 1 },
  next: { color: 'white', fontSize: 15, fontWeight: '600' },
  dest: { color: '#E6F1FB', fontSize: 12, marginTop: 2 },
});