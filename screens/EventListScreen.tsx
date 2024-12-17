import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    ActivityIndicator,
    Alert,
} from "react-native";
import { FontAwesome5, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import SmallEventCard from "../components/SmallEventCard";
import { eventService } from "../services/eventService";
import { EventModel } from "../models/EventModel";

export default function EventListScreen() {
    const navigation = useNavigation();
    const [events, setEvents] = useState<EventModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const fetchedEvents = await eventService.getEvents();
            setEvents(fetchedEvents);
        } catch (error: any) {
            console.error("Error fetching events:", error.message);
            Alert.alert("Error", "Failed to load events. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // Filtrer les événements en fonction de la recherche
    const filteredEvents = events.filter((event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header fixe */}
            <View style={styles.fixedHeader}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <FontAwesome5 name="arrow-left" size={20} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Yevent</Text>
                    <TouchableOpacity>
                        <FontAwesome5 name="user-circle" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* Barre de recherche */}
                <View style={styles.searchBar}>
                    <Feather
                        name="search"
                        size={20}
                        color="#aaa"
                        style={styles.icon}
                    />
                    <TextInput
                        placeholder="Search events..."
                        style={styles.searchInput}
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                    />
                </View>
            </View>

            {/* Liste des événements */}
            {loading ? (
                <ActivityIndicator size="large" color="#6A5ACD" style={styles.loader} />
            ) : (
                <FlatList
                    data={filteredEvents}
                    keyExtractor={(item) => item.eventid}
                    numColumns={2}
                    renderItem={({ item }) => (
                        <View style={styles.cardWrapper}>
                            <SmallEventCard
                                image={require("../assets/images/event1.jpeg")}
                                title={item.title}
                                date={new Date(item.date).toLocaleDateString()}
                                time={new Date(item.date).toLocaleTimeString()}
                                tickets={`${item.ticketsremaining ?? 0}/${item.capacity}`}
                                onPress={() =>
                                    console.log(`Event ${item.title} pressed`)
                                }
                            />
                        </View>
                    )}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                No events match your search.
                            </Text>
                        </View>
                    )}
                    ListFooterComponent={<View style={{ height: 20 }} />}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    fixedHeader: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        zIndex: 10,
        paddingBottom: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 50,
        marginBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
    },
    searchBar: {
        flexDirection: "row",
        backgroundColor: "#F0F0F0",
        borderRadius: 15,
        marginHorizontal: 20,
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: "center",
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        color: "#333",
        fontSize: 16,
    },
    icon: { marginRight: 10 },
    listContainer: {
        paddingTop: 100,
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    cardWrapper: {
        flex: 1,
        margin: 5,
    },
    loader: {
        marginTop: 50,
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    },
    emptyText: {
        fontSize: 16,
        color: "#999",
    },
});
