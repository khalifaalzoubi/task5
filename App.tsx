import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { Camera } from 'react-native-vision-camera';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

function App(): JSX.Element {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(
    null
  );
  const camera = useRef<Camera | null>(null); // Use useRef hook with Camera type
  const [imageSource, setImageSource] = useState('');
  const serverUrl = 'http://your-local-server-url'; // Replace with your server URL

  useEffect(() => {
    const checkCameraPermission = async () => {
      const result = await check(PERMISSIONS.IOS.CAMERA);

      if (result === RESULTS.GRANTED) {
        setHasCameraPermission(true);
      } else {
        const requestResult = await request(PERMISSIONS.IOS.CAMERA);
        setHasCameraPermission(requestResult === RESULTS.GRANTED);
      }
    };

    checkCameraPermission();
  }, []);

  const capturePhoto = async () => {
    if (hasCameraPermission && camera.current !== null) {
      try {
        const photo = await camera.current.takePhoto({});
        setImageSource(photo.path);

        // Sending the captured photo to the server
        try {
          const formData = new FormData();
          formData.append('photo', {
            uri: photo.path,
            name: 'photo.jpg',
            type: 'image/jpeg',
          });

          const response = await axios.post(serverUrl, formData);
          console.log('Photo uploaded successfully:', response.data);
          // Handle success response from the server
        } catch (error) {
          console.error('Error uploading photo:', error);
          // Handle error case
        }
      } catch (error) {
        console.error('Error capturing the photo:', error);
      }
    }
  };

  if (hasCameraPermission === null) {
    return <ActivityIndicator />;
  }

  if (!hasCameraPermission) {
    return (
      <View style={styles.camera}>
        <Text>Camera permission not granted</Text>
      </View>
    );
  }

  return (
    <View style={styles.camera}>
      <Camera
        ref={(ref) => (camera.current = ref)} // Set the ref using a callback
        style={StyleSheet.absoluteFill}
        isActive={true}
        photo={true}
        zoom={1}
      />
      <TouchableOpacity onPress={capturePhoto} style={styles.captureButton}>
        <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
          Capture Photo
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    position: 'absolute',
    bottom: 20,
  },
});

export default App;
