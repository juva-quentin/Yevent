import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Camera } from "expo-camera";
import { useNavigation } from "@react-navigation/native";

export default function ScanQRScreen() {
    const navigation = useNavigation();
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);

    React.useEffect(() => {
        const getCameraPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        };

        getCameraPermissions();
    }, []);

    if (hasPermission === null) {
        return <View />;
    }

    if (hasPermission === false) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>
                    We need your permission to access the camera.
                </Text>
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
            // Suppose the QR code contains JSON data with `eventId`
            const eventData = JSON.parse(data);
            if (eventData?.eventId) {
                // @ts-ignore
                navigation.navigate("Event Detail", { eventId: eventData.eventId });
            } else {
                throw new Error("Invalid QR code data");
            }
        } catch (error) {
            alert("Invalid QR Code: Unable to retrieve event details.");
        } finally {
            setScanned(false); // Reset scanner after processing
        }
    };

    return (
        <View style={styles.container}>
            <Camera
                style={styles.camera}
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            >
                {!scanned && (
                    <View style={styles.scanBox}>
                        <Text style={styles.scanText}>Align QR Code within the frame</Text>
                    </View>
                )}
            </Camera>
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
