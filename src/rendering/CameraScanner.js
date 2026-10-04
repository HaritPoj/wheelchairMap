import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import TextRecognition from '@react-native-ml-kit/text-recognition';

// The critical 'export default' fixes your red screen error!
export default function CameraScanner({ onRoomDetected, onClose, mapData }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef(null);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Your optimized scanning logic
  const captureAndScan = async () => {
    if (!cameraRef.current) return;
    setIsProcessing(true);
    
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      const result = await TextRecognition.recognize(photo.uri);
      
      // Captures 100-299, optionally followed by a letter (e.g., 101A)
      const roomRegex = /\b([12]\d{2}[a-zA-Z]?)\b/g; 
      const matches = result.text.match(roomRegex);
      
      if (!matches || matches.length === 0) {
        Alert.alert("Try Again", "No valid room number detected.");
        return setIsProcessing(false);
      }

      const foundId = matches.find(id => mapData.nodeMap[id]);
      
      if (!foundId) {
        Alert.alert("Not Found", "Numbers detected, but not on the map.");
        return setIsProcessing(false);
      }

      Alert.alert("Location Found", `Are you at Room ${foundId}?`, [
        { text: "No", style: "cancel", onPress: () => setIsProcessing(false) },
        { text: "Yes", onPress: () => {
            onRoomDetected(foundId);
            setIsProcessing(false); 
        }}
      ]);

    } catch (error) {
      console.error("OCR Error:", error);
      Alert.alert("Error", "Failed to process the image.");
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing="back" 
        ref={cameraRef}
      >
        <View style={styles.overlay}>
          <Text style={styles.instructions}>Point camera at a room sign</Text>
          
          <View style={styles.controls}>
            <TouchableOpacity style={styles.buttonSecondary} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, isProcessing && styles.buttonDisabled]} 
              onPress={captureAndScan}
              disabled={isProcessing}
            >
              <Text style={styles.buttonText}>
                {isProcessing ? "Scanning..." : "Scan Sign"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  camera: { flex: 1 },
  text: { color: 'white', textAlign: 'center', marginBottom: 20 },
  overlay: { flex: 1, justifyContent: 'space-between', padding: 30, backgroundColor: 'rgba(0,0,0,0.3)' },
  instructions: { color: 'white', fontSize: 18, textAlign: 'center', marginTop: 40, fontWeight: 'bold' },
  controls: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
  button: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, flex: 1, marginLeft: 10, alignItems: 'center' },
  buttonSecondary: { backgroundColor: '#F44336', padding: 15, borderRadius: 8, flex: 1, marginRight: 10, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#888' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});