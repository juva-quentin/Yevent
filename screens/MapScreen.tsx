import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import { FontAwesome5 } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function MapScreen() {
    const [region, setRegion] = useState<Region>({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    // Fonction pour localiser l'utilisateur
    const locateUser = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            alert("Permission to access location was denied");
            return;
        }

        const userLocation = await Location.getCurrentPositionAsync({});
        setRegion({
            latitude: userLocation.coords.latitude,
            longitude: userLocation.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        });
    };

    return (
        <View style={styles.container}>
            {/* MapView */}
            <MapView style={styles.map} region={region} showsUserLocation={true}>
                {/* Marqueur de l'utilisateur */}
                <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }}>
                    <FontAwesome5 name="map-marker-alt" size={24} color="#6A5ACD" />
                </Marker>
            </MapView>

            {/* Bouton flottant pour localiser l'utilisateur */}
            <TouchableOpacity style={styles.locateButton} onPress={locateUser}>
                <FontAwesome5 name="location-arrow" size={20} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: width,
        height: height,
    },
    locateButton: {
        position: "absolute",
        bottom: 50,
        right: 20,
        backgroundColor: "#6A5ACD",
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
});
