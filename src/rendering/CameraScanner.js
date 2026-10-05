import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import TextRecognition from '@react-native-ml-kit/text-recognition';

function normalizeOCRText(text) {
  return String(text || '')
    .replace(/[Oo]/g, '0')
    .replace(/[Il|]/g, '1')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeCode(value) {
  return String(value || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
}

function extractRoomCandidates(text, mapData) {
  const normalized = normalizeOCRText(text).toUpperCase();
  const tokens = normalized
    .split(/[^A-Z0-9]+/)
    .filter(Boolean);

  const candidates = [];
  const rooms = mapData.nodes.filter(node => node.type === 'room');

  for (const room of rooms) {
    const code = normalizeCode(room.code || room.id || room.name);
    if (!code) continue;

    const found = tokens.some((token, index) => {
      if (normalizeCode(token) === code) return true;

      for (
        let length = 2;
        length <= 4 && index + length <= tokens.length;
        length += 1
      ) {
        const combined = tokens
          .slice(index, index + length)
          .map(normalizeCode)
          .join('');

        if (combined === code) return true;
      }

      return false;
    });

    if (found && !candidates.includes(room.id)) {
      candidates.push(room.id);
    }
  }

  return candidates;
}

export default function CameraScanner({ onRoomDetected, onClose, mapData }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef(null);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>Camera permission needed</Text>
        <Text style={styles.permissionText}>
          Allow camera access so the app can read room signs.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={requestPermission}
          accessibilityRole="button"
          accessibilityLabel="Grant camera permission"
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Cancel room sign scanning"
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  async function captureAndScan() {
    if (!cameraRef.current || !cameraReady || isProcessing) {
      return;
    }

    setIsProcessing(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });

      if (!photo?.uri) {
        throw new Error('Camera did not return an image URI.');
      }

      const result = await TextRecognition.recognize(photo.uri);
      const candidates = extractRoomCandidates(result?.text || '', mapData);

      const foundId = candidates.find(
        roomId => mapData.nodeMap[roomId]?.type === 'room'
      );

      if (!foundId) {
        Alert.alert(
          'Try again',
          candidates.length
            ? 'A room code was detected, but it does not match a mapped room.'
            : 'No mapped room code was detected.'
        );
        return;
      }

      const room = mapData.nodeMap[foundId];
      const label = room.name || room.code || foundId;

      Alert.alert(
        'Location found',
        'Are you at ' + label + '?',
        [
          { text: 'No', style: 'cancel' },
          {
            text: 'Yes',
            onPress: () => onRoomDetected(foundId),
          },
        ]
      );
    } catch (error) {
      console.error('OCR Error:', error);
      Alert.alert(
        'Scan failed',
        'The room sign could not be read. Try moving closer and keeping the sign inside the frame.'
      );
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        ref={cameraRef}
        onCameraReady={() => setCameraReady(true)}
      >
        <View style={styles.overlay}>
          <View style={styles.topArea}>
            <Text style={styles.title}>Scan Room Sign</Text>
            <Text style={styles.instructions}>
              Center the room code inside the frame.
            </Text>
          </View>

          <View style={styles.scanFrame} />

          <View style={styles.bottomArea}>
            <Text style={styles.status}>
              {!cameraReady
                ? 'Starting camera...'
                : isProcessing
                  ? 'Reading sign...'
                  : 'Ready to scan'}
            </Text>

            <View style={styles.controls}>
              <TouchableOpacity
                style={styles.buttonSecondary}
                onPress={onClose}
                disabled={isProcessing}
                accessibilityRole="button"
                accessibilityLabel="Cancel scan"
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  (!cameraReady || isProcessing) && styles.buttonDisabled,
                ]}
                onPress={captureAndScan}
                disabled={!cameraReady || isProcessing}
                accessibilityRole="button"
                accessibilityLabel="Scan room sign"
              >
                <Text style={styles.buttonText}>
                  {isProcessing ? 'Scanning...' : 'Scan Sign'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  camera: { flex: 1 },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 36,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  topArea: { alignItems: 'center' },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
  },
  instructions: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 8,
  },
  scanFrame: {
    alignSelf: 'center',
    width: '82%',
    aspectRatio: 1.9,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 16,
  },
  bottomArea: { alignItems: 'center' },
  status: {
    color: 'white',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    width: '100%',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#F44336',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: '#888' },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 28,
  },
  permissionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionText: {
    color: '#ddd',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  cancelButton: {
    width: '100%',
    backgroundColor: '#555',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
});
