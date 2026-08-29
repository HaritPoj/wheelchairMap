const captureAndScan = async () => {
    if (!cameraRef.current) return;
    setIsProcessing(true);
    
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      const result = await TextRecognition.recognize(photo.uri);
      
      const roomRegex = /\b([12]\d{2})\b/g; 
      const matches = result.text.match(roomRegex);
      
      if (matches && matches.length > 0) {
        const foundId = matches.find(id => mapData.nodeMap[id]);
        if (foundId) {
          Alert.alert("Location Found", `Are you at Room ${foundId}?`, [
              { text: "No", onPress: () => setIsProcessing(false), style: "cancel" },
              { text: "Yes", onPress: () => onRoomDetected(foundId) }
          ]);
        } else {
          Alert.alert("Not Found", "Numbers detected, but not on the map.");
          setIsProcessing(false);
        }
      } else {
        Alert.alert("Try Again", "No valid room number detected.");
        setIsProcessing(false);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to process the image.");
      setIsProcessing(false);
    }
  };