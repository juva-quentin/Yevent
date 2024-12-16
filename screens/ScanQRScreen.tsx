import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import {CameraView, useCameraPermissions} from "expo-camera";


export default function ScanQRScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);

    if (!permission) {
        // Permissions are still loading
        return <View />;
    }

    if (!permission.granted) {
        // Permissions are not granted
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>
                    We need your permission to access the camera.
                </Text>
                <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                    <Text style={styles.permissionButtonText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleBarCodeScanned = ({ data }: { data: string }) => {
        if (scanned) return;

        setScanned(true);
        Alert.alert("QR Code Scanned", `Data: ${data}`, [
            {
                text: "OK",
                onPress: () => setScanned(false), // Reset scanner
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                onBarcodeScanned={handleBarCodeScanned}
            >
                {!scanned && (
                    <View style={styles.scanBox}>
                        <Text style={styles.scanText}>Align QR Code within the frame</Text>
                    </View>
                )}
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    camera: {
        flex: 1,
    },
    scanBox: {
        position: "absolute",
        top: "40%",
        left: "15%",
        width: "70%",
        height: "20%",
        borderWidth: 2,
        borderColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
    },
    scanText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    permissionContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    permissionText: {
        textAlign: "center",
        marginBottom: 20,
        fontSize: 16,
    },
    permissionButton: {
        padding: 10,
        backgroundColor: "#6A5ACD",
        borderRadius: 5,
    },
    permissionButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
