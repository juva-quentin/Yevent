import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    FlatList,
    Alert,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { MainStackParamList } from "../types";
import { eventService } from "../services/eventService";
import { reservationService } from "../services/reservationService";
import { authService } from "../services/authService";
import { EventModel } from "../models/EventModel";

type EventDetailScreenRouteProp = RouteProp<MainStackParamList, "Event Detail">;

const EventDetailScreen = () => {
    const route = useRoute<EventDetailScreenRouteProp>();
    const { eventId } = route.params;

    const [event, setEvent] = useState<EventModel | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedTickets, setSelectedTickets] = useState(1);
    const [isModalVisible, setModalVisible] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    const navigation = useNavigation();

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const user = await authService.getCurrentUser();
                if (user) {
                    setCurrentUserId(user.id);
                } else {
                    throw new Error("User not logged in");
                }
            } catch (error) {
                console.error("Error fetching current user:", error);
                Alert.alert(
                    "Authentication Error",
                    "You need to be logged in to access this page."
                );
                navigation.goBack();
            }
        };

        fetchCurrentUser();
    }, [navigation]);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const eventDetails = await eventService.getEventById(eventId);
                setEvent(eventDetails);
            } catch (error) {
                console.error("Error fetching event:", error);
                Alert.alert("Error", "Failed to load event details. Please try again.");
                navigation.goBack();
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [eventId, navigation]);

    const handleSelectTicket = (value: number) => {
        setSelectedTickets(value);
        setModalVisible(false);
    };

    const handlePurchase = async () => {
        if (!event) return;

        if (!currentUserId) {
            Alert.alert("Error", "Unable to identify the current user.");
            return;
        }

        if (selectedTickets > event.ticketsremaining) {
            Alert.alert("Error", "Not enough tickets available.");
            return;
        }

        try {
            const updatedTicketsRemaining = event.ticketsremaining - selectedTickets;

            await eventService.updateEvent(event.eventid, {
                ticketsremaining: updatedTicketsRemaining,
            });

            const reservation = {
                userid: currentUserId,
                eventid: event.eventid,
                tickets: selectedTickets,
                totalprice: selectedTickets * event.ticketprice,
                timestamp: new Date(),
            };

            await reservationService.createReservation(reservation);

            Alert.alert(
                "Success",
                `You purchased ${selectedTickets} ticket(s) for $${event.ticketprice * selectedTickets}`
            );

            setEvent({
                ...event,
                ticketsremaining: updatedTicketsRemaining,
            });
        } catch (error) {
            console.error("Error during purchase:", error);
            Alert.alert(
                "Purchase Error",
                "Failed to complete the purchase. Please try again later."
            );
        }
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#6A5ACD" />
            </View>
        );
    }

    if (!event) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Event not found!</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require("../assets/images/event1.jpeg")}
                style={styles.headerImage}
            >
                <View style={styles.headerIcons}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => navigation.goBack()}
                    >
                        <FontAwesome5 name="arrow-left" size={20} color="#000" />
                    </TouchableOpacity>
                </View>
            </ImageBackground>

            <View style={styles.contentContainer}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <View style={styles.eventInfo}>
                    <Text style={styles.eventSubText}>📍 {event.location}</Text>
                    <Text style={styles.eventSubText}>
                        📅 {new Date(event.date).toLocaleDateString()}
                    </Text>
                </View>

                <View style={styles.ticketContainer}>
                    <View style={styles.ticketDetails}>
                        <Text style={styles.ticketLabel}>Remaining Tickets</Text>
                        <Text style={styles.ticketCount}>
                            {event.ticketsremaining}/{event.capacity}
                        </Text>
                    </View>
                    <View style={styles.ticketIcon}>
                        <FontAwesome5 name="map-marker-alt" size={24} color="#6A5ACD" />
                    </View>
                </View>

                <View style={styles.purchaseSection}>
                    <TouchableOpacity
                        style={styles.ticketsView}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={styles.ticketsText}>{selectedTickets}</Text>
                        <FontAwesome5 name="chevron-down" size={16} color="#6A5ACD" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buyButton} onPress={handlePurchase}>
                        <Text style={styles.buyButtonText}>
                            Buy Now - ${event.ticketprice * selectedTickets}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Modal visible={isModalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Select number of tickets</Text>
                        <FlatList
                            data={Array.from(
                                { length: event.ticketsremaining },
                                (_, i) => i + 1
                            )}
                            keyExtractor={(item) => item.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.modalItem}
                                    onPress={() => handleSelectTicket(item)}
                                >
                                    <Text style={styles.modalItemText}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={styles.modalClose}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    headerImage: { height: 300, justifyContent: "center" },
    headerIcons: {
        position: "absolute",
        top: 40,
        left: 20,
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 25,
        elevation: 5,
    },
    iconButton: {
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        elevation: 3,
    },
    contentContainer: { padding: 20 },
    eventTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
    eventInfo: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
    eventSubText: { fontSize: 14, color: "gray" },
    ticketContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        backgroundColor: "#F9F9F9",
        borderRadius: 12,
        marginVertical: 10,
    },
    ticketDetails: { flexDirection: "column" },
    ticketLabel: { fontSize: 16, fontWeight: "bold", color: "#000" },
    ticketCount: { fontSize: 18, fontWeight: "bold", color: "#6A5ACD" },
    ticketIcon: {
        padding: 10,
        backgroundColor: "#EEE",
        borderRadius: 10,
        elevation: 2,
    },
    purchaseSection: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    ticketsView: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: "#FFF",
    },
    ticketsText: { fontSize: 16, marginRight: 10, color: "#333" },
    buyButton: {
        marginTop: 20,
        padding: 15,
        backgroundColor: "#6A5ACD",
        borderRadius: 10,
        alignItems: "center",
    },
    buyButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
    modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center" },
    modalContainer: {
        backgroundColor: "#FFF",
        borderRadius: 10,
        width: "80%",
        padding: 20,
        maxHeight: 300,
    },
    modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
    modalItem: { padding: 10, alignItems: "center" },
    modalItemText: { fontSize: 16 },
    modalClose: { textAlign: "center", color: "#6A5ACD", marginTop: 10, fontSize: 16 },
    loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    errorText: { fontSize: 18, color: "red" },
});

export default EventDetailScreen;
