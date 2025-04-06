import React, { useEffect, useRef, useState } from "react";
import { Alert, Platform, Text, SafeAreaView, TouchableOpacity, View, StyleSheet, Animated, Easing, Image } from "react-native";
import { request, PERMISSIONS, openSettings, RESULTS } from "react-native-permissions";
import { Commands, ReactNativeScannerView } from "@pushpendersingh/react-native-scanner";
import LinearGradient from "react-native-linear-gradient"; // You'll need to install this

export default function App() {
  const scannerRef = useRef(null);
  const [isCameraPermissionGranted, setIsCameraPermissionGranted] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Animation references
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const successAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    checkCameraPermission();
    startScanLineAnimation();
    startPulseAnimation();
  }, []);

  // Animation for scan line
  const startScanLineAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      ])
    ).start();
  };

  // Animation for pulsing QR frame
  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      ])
    ).start();
  };

  // Animation for successful scan
  const playSuccessAnimation = () => {
    setShowSuccess(true);
    Animated.sequence([
      Animated.timing(successAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.delay(1500),
      Animated.timing(successAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowSuccess(false);
    });
  };

  const handleBarcodeScanned = (event) => {
    // Only process if we're in active scanning mode
    if (isActive) {
      const { data, bounds, type } = event?.nativeEvent;
      setScannedData({ data, bounds, type });
      playSuccessAnimation();
      console..log("Barcode / QR Code scanned:", data, bounds, type);

      // Important: Stop scanning after successful scan
      stopScanning();
    }
  };

  const enableFlashlight = () => {
    if (scannerRef?.current) {
      Commands.enableFlashlight(scannerRef.current);
      setIsFlashlightOn(true);
    }
  };

  const disableFlashlight = () => {
    if (scannerRef?.current) {
      Commands.disableFlashlight(scannerRef.current);
      setIsFlashlightOn(false);
    }
  };

  const toggleFlashlight = () => {
    if (isFlashlightOn) {
      disableFlashlight();
    } else {
      enableFlashlight();
    }
  };

  // Pause the camera after barcode / QR code is scanned
  const stopScanning = () => {
    if (scannerRef?.current) {
      Commands.stopScanning(scannerRef?.current);
      setIsActive(false);
      console..log("Scanning paused");
    }
  };

  // Resume the camera after barcode / QR code is scanned
  const resumeScanning = () => {
    if (scannerRef?.current) {
      // Clear scanned data first
      setScannedData(null);
      // Then resume scanning and update the state
      Commands.resumeScanning(scannerRef?.current);
      setIsActive(true);
      console..log("Scanning resumed");
    }
  };

  const releaseCamera = () => {
    if (scannerRef?.current) {
      Commands.releaseCamera(scannerRef?.current);
    }
  };

  const startScanning = () => {
    if (scannerRef?.current) {
      Commands.startCamera(scannerRef?.current);
      setIsActive(true);
    }
  };

  const checkCameraPermission = async () => {
    request(Platform.OS === "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA).then(async (result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          Alert.alert("Camera Unavailable", "This feature is not available on your device");
          break;
        case RESULTS.DENIED:
          Alert.alert("Permission Denied", "You need to grant camera permission to scan QR codes", [
            { text: "Cancel", style: "cancel" },
            { text: "Settings", onPress: openSettings },
          ]);
          break;
        case RESULTS.GRANTED:
          setIsCameraPermissionGranted(true);
          break;
        case RESULTS.BLOCKED:
          Alert.alert("Permission Blocked", "You need to grant camera permission in settings", [
            { text: "Cancel", style: "cancel" },
            { text: "Settings", onPress: openSettings },
          ]);
          break;
      }
    });
  };

  if (isCameraPermissionGranted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Scan & Pay</Text>
        </View>

        <View style={styles.scannerContainer}>
          {/* Only render the scanner if isActive is true or if we have no scanned data */}
          <ReactNativeScannerView
            ref={scannerRef}
            style={styles.scanner}
            onQrScanned={handleBarcodeScanned}
            pauseAfterCapture={true}
            isActive={isActive}
            showBox={false}
          />

          {/* Animated scan frame */}
          <Animated.View
            style={[
              styles.scanFrame,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />
          </Animated.View>

          {/* Animated scan line - only show when active */}
          {isActive && (
            <Animated.View
              style={[
                styles.scanLine,
                {
                  transform: [
                    {
                      translateY: scanLineAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-120, 120],
                      }),
                    },
                  ],
                },
              ]}
            />
          )}

          {/* Success animation overlay */}
          {showSuccess && (
            <Animated.View
              style={[
                styles.successOverlay,
                {
                  opacity: successAnim,
                },
              ]}
            >
              <View style={styles.successContent}>
                <View style={styles.successIconContainer}>
                  <View style={styles.successIcon}>
                    <Text style={styles.successIconText}>✓</Text>
                  </View>
                </View>
                <Text style={styles.successText}>QR Scan Successful</Text>
              </View>
            </Animated.View>
          )}
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={toggleFlashlight}>
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>{isFlashlightOn ? "⚡" : "🔦"}</Text>
            </View>
            <Text style={styles.buttonText}>{isFlashlightOn ? "Flash Off" : "Flash On"}</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={styles.controlButton}
            onPress={() => {
              if (isActive) {
                stopScanning();
              } else {
                resumeScanning();
              }
            }}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>{isActive ? "⏸️" : "▶️"}</Text>
            </View>
            <Text style={styles.buttonText}>{isActive ? "Stop" : "Resume"}</Text>
          </TouchableOpacity> */}
        </View>

        <LinearGradient colors={["rgba(255,255,255,0)", "rgba(255,255,255,0.9)", "#ffffff"]} style={styles.detailsContainer}>
          {scannedData ? (
            <View style={styles.resultContainer}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultTitle}>Scanned Result</Text>
              </View>
              <View style={styles.resultContent}>
                <Text style={styles.resultDataLabel}>Data:</Text>
                <Text style={styles.resultDataText}>{scannedData.data}</Text>
                <Text style={styles.resultTypeLabel}>Type:</Text>
                <Text style={styles.resultTypeText}>{scannedData.type}</Text>
                <TouchableOpacity style={styles.scanAgainButton} onPress={resumeScanning}>
                  <Text style={styles.scanAgainText}>Scan Again</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.instructions}>
              <Text style={styles.instructionText}>Position the QR code within the frame to scan</Text>
            </View>
          )}
        </LinearGradient>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <View style={styles.permissionContent}>
          <View style={styles.cameraIconContainer}>
            <Text style={styles.cameraIcon}>📷</Text>
          </View>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>To scan QR codes, we need permission to use your camera</Text>
          <TouchableOpacity style={styles.grantPermissionButton} onPress={checkCameraPermission}>
            <Text style={styles.grantPermissionText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const PhonePeColors = {
  purple: "#5f259f",
  lightPurple: "#8952bf",
  yellow: "#ffe01b",
  green: "#00b36b",
  darkGray: "#333333",
  lightGray: "#f9f9f9",
  white: "#ffffff",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: PhonePeColors.purple,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    color: PhonePeColors.white,
    fontSize: 20,
    fontWeight: "bold",
  },
  scannerContainer: {
    flex: 1,
    position: "relative",
  },
  scanner: {
    flex: 1,
  },
  scanFrame: {
    position: "absolute",
    width: 240,
    height: 240,
    top: "50%",
    left: "50%",
    marginLeft: -120,
    marginTop: -120,
  },
  cornerTL: {
    position: "absolute",
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    top: 0,
    left: 0,
    borderColor: PhonePeColors.purple,
  },
  cornerTR: {
    position: "absolute",
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderRightWidth: 4,
    top: 0,
    right: 0,
    borderColor: PhonePeColors.purple,
  },
  cornerBL: {
    position: "absolute",
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    bottom: 0,
    left: 0,
    borderColor: PhonePeColors.purple,
  },
  cornerBR: {
    position: "absolute",
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    bottom: 0,
    right: 0,
    borderColor: PhonePeColors.purple,
  },
  scanLine: {
    position: "absolute",
    width: 230,
    height: 2,
    backgroundColor: PhonePeColors.yellow,
    top: "50%",
    left: "50%",
    marginLeft: -115,
    marginTop: 0,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 20,
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
  },
  controlButton: {
    alignItems: "center",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  iconText: {
    fontSize: 22,
  },
  buttonText: {
    color: PhonePeColors.white,
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  detailsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 20,
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  instructions: {
    alignItems: "center",
    marginBottom: 10,
  },
  instructionText: {
    color: PhonePeColors.darkGray,
    fontSize: 16,
    textAlign: "center",
  },
  resultContainer: {
    backgroundColor: PhonePeColors.white,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 10,
  },
  resultHeader: {
    backgroundColor: PhonePeColors.purple,
    padding: 15,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  resultTitle: {
    color: PhonePeColors.white,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  resultContent: {
    padding: 15,
  },
  resultDataLabel: {
    color: PhonePeColors.darkGray,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  resultDataText: {
    color: PhonePeColors.darkGray,
    fontSize: 16,
    marginBottom: 12,
  },
  resultTypeLabel: {
    color: PhonePeColors.darkGray,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  resultTypeText: {
    color: PhonePeColors.darkGray,
    fontSize: 16,
    marginBottom: 20,
  },
  scanAgainButton: {
    backgroundColor: PhonePeColors.purple,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  scanAgainText: {
    color: PhonePeColors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  successOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  successContent: {
    alignItems: "center",
  },
  successIconContainer: {
    marginBottom: 15,
  },
  successIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: PhonePeColors.green,
    justifyContent: "center",
    alignItems: "center",
  },
  successIconText: {
    color: PhonePeColors.white,
    fontSize: 40,
    fontWeight: "bold",
  },
  successText: {
    color: PhonePeColors.white,
    fontSize: 22,
    fontWeight: "bold",
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: PhonePeColors.white,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  permissionContent: {
    alignItems: "center",
  },
  cameraIconContainer: {
    marginBottom: 20,
  },
  cameraIcon: {
    fontSize: 60,
  },
  permissionTitle: {
    color: PhonePeColors.darkGray,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  permissionText: {
    color: PhonePeColors.darkGray,
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
  },
  grantPermissionButton: {
    backgroundColor: PhonePeColors.purple,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  grantPermissionText: {
    color: PhonePeColors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
