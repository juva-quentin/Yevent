import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    ActivityIndicator,
    Alert,
} from "react-native";
import { FontAwesome5, Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import { StackScreenProps } from "@react-navigation/stack";
import { MainStackParamList } from "../types";
import SmallEventCard from "../components/SmallEventCard";
import HorizontalEventCard from "../components/HorizontalEventCard";
import { eventService } from "../services/eventService";
import { EventModel } from "../models/EventModel";

type Props = StackScreenProps<MainStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
    const [nearbyEvents, setNearbyEvents] = useState<EventModel[]>([]);
    const [popularEvents, setPopularEvents] = useState<EventModel[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEvents = async () => {
        setLoading(true);
        setError(null);

        try {
            const allEvents = await eventService.getEvents();
            const userLocation = await getUserLocation();

            // Trier les événements par distance
            const sortedEvents = allEvents.map((event) => ({
                ...event,
                distance: calculateDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    event.maplocation?.latitude || 0,
                    event.maplocation?.longitude || 0
                ),
            }));

            const validEvents = sortedEvents.filter(
                (event) => event.maplocation && !isNaN(event.distance)
            );

            validEvents.sort((a, b) => a.distance - b.distance);

            setNearbyEvents(validEvents.slice(0, 3));
            setPopularEvents(validEvents.slice(3));
        } catch (err: any) {
            setError("Failed to fetch events. Please try again.");
            console.error("Error fetching events:", err.message);
        } finally {
            setLoading(false);
        }
    };

    const getUserLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Location Permission", "Permission to access location was denied.");
            throw new Error("Location permission not granted");
        }

        const location = await Location.getCurrentPositionAsync({});
        return {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        };
    };

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const renderEmptyList = (message: string) => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{message}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header fixe */}
            <View style={styles.fixedHeader}>
                <View style={styles.header}>
                    <Text style={styles.title}>Yevent</Text>
                    <TouchableOpacity>
                        <FontAwesome5 name="user-circle" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* Barre de recherche */}
                <View style={styles.searchBar}>
                    <Feather name="search" size={20} color="#aaa" style={styles.icon} />
                    <TextInput
                        placeholder="Search events..."
                        style={styles.searchInput}
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                    />
                </View>
            </View>

            {/* Contenu principal */}
            {loading ? (
                <ActivityIndicator size="large" color="#6A5ACD" style={styles.loader} />
            ) : error ? (
                renderEmptyList(error)
            ) : (
                <View style={{ paddingTop: 100 }}>
                    {/* Nearby Events */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Nearby Events</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Event List")}>
                            <Text style={styles.seeMore}>See More</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={nearbyEvents}
                        keyExtractor={(event) => event.eventid}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <SmallEventCard
                                image={require("../assets/images/event1.jpeg")}
                                title={item.title}
                                date={new Date(item.date).toLocaleDateString()}
                                time={new Date(item.date).toLocaleTimeString()}
                                tickets={`${item.ticketsremaining ?? 0} / ${item.capacity ?? 0}`}
                                onPress={() => navigation.navigate("Event Detail", { eventId: item.eventid })}
                            />
                        )}
                        contentContainerStyle={styles.flatListContainer}
                    />


                    {/* Popular Events */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Popular Events</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Event List")}>
                            <Text style={styles.seeMore}>See More</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={popularEvents}
                        keyExtractor={(event) => event.eventid}
                        renderItem={({ item }) => (
                            <HorizontalEventCard
                                image={require("../assets/images/event1.jpeg")}
                                title={item.title}
                                date={new Date(item.date).toLocaleDateString()}
                                time={new Date(item.date).toLocaleTimeString()}
                                price={`$${item.capacity * 10}`}
                                onPress={() => navigation.navigate("Event Detail", { eventId: item.eventid })}
                            />
                        )}
                        contentContainerStyle={{ paddingHorizontal: 10 }}
                    />
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    fixedHeader: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        zIndex: 10,
        paddingBottom: 10, // Ajout d'une légère marge sous le header
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 50, // Ajustement pour réduire l'espace en haut
        marginBottom: 10,
    },
    title: { fontSize: 28, fontWeight: "bold", color: "#333" },
    searchBar: {
        flexDirection: "row",
        backgroundColor: "#F0F0F0",
        borderRadius: 15,
        marginHorizontal: 20,
        paddingVertical: 15, // Taille de la search bar augmentée
        paddingHorizontal: 20,
        alignItems: "center",
    },
    searchInput: { flex: 1, marginLeft: 10, color: "#333", fontSize: 16 },
    icon: { marginRight: 10 },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginTop: 10, // Espacement au-dessus du titre
        marginBottom: 5, // Réduction de l'espace sous le titre
        paddingHorizontal: 20,
    },
    flatListContainer: { paddingHorizontal: 10, paddingVertical: 10 },
    emptyContainer: { alignItems: "center", justifyContent: "center", marginTop: 20 },
    emptyText: { fontSize: 16, color: "#999" },
    loader: { marginTop: 50 },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between", // Titre à gauche, "See More" à droite
        alignItems: "center",
        paddingRight: 20,
        marginTop: 10,
    },
    seeMore: {
        fontSize: 16,
        color: "#6A5ACD", // Couleur pour le lien
        fontWeight: "bold",
    },
});
