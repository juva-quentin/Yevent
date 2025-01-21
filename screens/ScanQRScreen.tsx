import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { useNavigation } from "@react-navigation/native";

export default function ScanQRScreen() {
    const navigation = useNavigation();
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        const getPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        };

        getPermissions();
    }, []);

    if (hasPermission === null) {
        return (
            <View style={styles.container}>
                <Text>Requesting Camera Permissions...</Text>
            </View>
        );
    }

    if (!hasPermission) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>Camera access is required to scan QR codes.</Text>
                <TouchableOpacity
                    style={styles.permissionButton}
                    onPress={async () => {
                        const { status } = await Camera.requestCameraPermissionsAsync();
                        setHasPermission(status === "granted");
                    }}
                >
                    <Text style={styles.permissionButtonText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleBarCodeScanned = ({ data }: { data: string }) => {
        if (scanned) return;

        setScanned(true);

        try {
            if (data.trim() !== "") {
                // @ts-ignore
                navigation.navigate("Event Detail", { eventId: data });
            } else {
                throw new Error("Invalid QR code format.");
            }
        } catch (error) {
            Alert.alert("Scan Error", "Invalid QR code. Please try again.");
        } finally {
            setTimeout(() => setScanned(false), 2000);
        }
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
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
