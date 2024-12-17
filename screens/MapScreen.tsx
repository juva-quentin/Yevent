import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions, Alert } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { eventService } from "../services/eventService";
import { EventModel } from "../models/EventModel";

const { width, height } = Dimensions.get("window");

export default function MapScreen() {
    const mapViewRef = useRef<MapView>(null); // Référence pour animer la carte
    const [region, setRegion] = useState<Region>({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    const [userLocation, setUserLocation] = useState<Region | null>(null); // Position utilisateur
    const [events, setEvents] = useState<EventModel[]>([]); // Stocker les événements
    const navigation = useNavigation();

    // Fonction pour récupérer la localisation de l'utilisateur
    const locateUser = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permission Denied", "Please allow location access in settings.");
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            const newRegion = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };

            setRegion(newRegion);
            setUserLocation(newRegion);

            // Animation pour recentrer la carte
            if (mapViewRef.current) {
                mapViewRef.current.animateToRegion(newRegion, 1000);
            }
        } catch (error) {
            console.error("Error fetching location:", error);
            Alert.alert("Error", "Unable to fetch your location.");
        }
    };

    // Fonction pour récupérer les événements depuis le backend
    const fetchEvents = async () => {
        try {
            const fetchedEvents = await eventService.getEvents();
            setEvents(fetchedEvents);
        } catch (error) {
            console.error("Error fetching events:", error);
            Alert.alert("Error", "Failed to load events.");
        }
    };

    // Appel des fonctions au montage du composant
    useEffect(() => {
        locateUser(); // Localise l'utilisateur au chargement
        fetchEvents(); // Récupère les événements
    }, []);

    return (
        <View style={styles.container}>
            {/* MapView */}
            <MapView
                ref={mapViewRef}
                style={styles.map}
                region={region}
                showsUserLocation={true}
                showsMyLocationButton={false}
            >
                {/* Marqueurs des événements */}
                {events.map((event) => (
                    <Marker
                        key={event.eventid}
                        coordinate={{
                            latitude: event.maplocation.latitude,
                            longitude: event.maplocation.longitude,
                        }}
                        title={event.title}
                        description={event.description}
                        onCalloutPress={() =>
                            navigation.navigate("Event Detail", { eventId: event.eventid })
                        }
                    >
                        <FontAwesome5 name="map-marker-alt" size={24} color="red" />
                    </Marker>
                ))}

                {/* Marqueur de la position de l'utilisateur */}
                {userLocation && (
                    <Marker
                        coordinate={{
                            latitude: userLocation.latitude,
                            longitude: userLocation.longitude,
                        }}
                        title="You are here"
                    >
                        <FontAwesome5 name="map-marker-alt" size={24} color="#6A5ACD" />
                    </Marker>
                )}
            </MapView>

            {/* Bouton flottant pour recentrer sur l'utilisateur */}
            <TouchableOpacity style={styles.locateButton} onPress={locateUser}>
                <FontAwesome5 name="location-arrow" size={20} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { width: width, height: height },
    locateButton: {
        position: "absolute",
        bottom: 110,
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
