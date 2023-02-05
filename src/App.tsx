/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  Camera,
  CameraPermissionStatus,
  Frame,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {Text, StyleSheet} from 'react-native';
import HomeScreen from 'screens/HomeScreen';
import {runOnJS} from 'react-native-reanimated';
import {Face, scanFaces} from 'vision-camera-face-detector';

type PermissionIOS = CameraPermissionStatus | null;

async function cameraPermission(): Promise<PermissionIOS> {
  try {
    return await Camera.getCameraPermissionStatus();
  } catch (e) {
    console.error(e);
    return Promise.resolve(null);
  }
}

async function microPermission(): Promise<PermissionIOS> {
  try {
    return await Camera.getMicrophonePermissionStatus();
  } catch (e) {
    console.error(e);
    return Promise.resolve(null);
  }
}

async function requestPermission(): Promise<Array<PermissionIOS>> {
  try {
    const r1 = await cameraPermission();
    const r2 = await microPermission();
    return [r1, r2];
  } catch (e) {
    console.error(e);
    return [];
  }
}

function App(): JSX.Element {
  const [cameraPermit, setCameraPermission] = useState<PermissionIOS>(null);
  const [microPermit, setMicroPermission] = useState<PermissionIOS>(null);
  const [faces, setFaces] = useState<Face[]>([]);

  const devices = useCameraDevices();
  const device = devices.back;

  const frameProcessor = useFrameProcessor((frame: Frame) => {
    'worklet';
    console.log('Frame processor is running...');
    const scannedFaces = scanFaces(frame);
    console.log('Scan faces:', scannedFaces);
    runOnJS(setFaces)(scannedFaces);
  }, []);

  useEffect(() => {
    requestPermission().then(results => {
      if (results?.length <= 0) {
        return;
      }
      setCameraPermission(results[0]);
      setMicroPermission(results[1]);
    });
  }, [setCameraPermission, setMicroPermission]);

  if (device == null) {
    return <HomeScreen />;
  }
  if (cameraPermit !== 'authorized') {
    return <Text>Don't allow to request camera</Text>;
  }
  if (microPermit !== 'authorized') {
    return <Text>Don't allow to request microphone</Text>;
  }
  console.log('Faces:', faces);
  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
      frameProcessor={frameProcessor}
      frameProcessorFps={5}
    />
  );
  // return <HomeScreen />;
}

export default App;
