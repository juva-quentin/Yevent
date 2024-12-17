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
    PanResponder,
    Animated,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import { MainStackParamList } from "../types";
import { eventService } from "../services/eventService";
import { EventModel } from "../models/EventModel";

type EventDetailScreenRouteProp = RouteProp<MainStackParamList, "Event Detail">;

const EventDetailScreen = () => {
    const route = useRoute<EventDetailScreenRouteProp>();
    const { eventId } = route.params;
    const [event, setEvent] = useState<EventModel | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedTickets, setSelectedTickets] = useState(1);
    const [isModalVisible, setModalVisible] = useState(false);
    const [slidePosition] = useState(new Animated.Value(0));
    const navigation = useNavigation();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const eventDetails = await eventService.getEventById(eventId);
                setEvent(eventDetails);
            } catch (error) {
                console.error("Error fetching event:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [eventId]);

    const handleSelectTicket = (value: number) => {
        setSelectedTickets(value);
        setModalVisible(false);
    };

    const slideResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
            const position = Math.max(0, Math.min(gestureState.dx, 150)); // Slide limité à 150px
            slidePosition.setValue(position);
        },
        onPanResponderRelease: (_, gestureState) => {
            if (gestureState.dx > 100) {
                console.log("Ticket purchased!");
            }
            Animated.timing(slidePosition, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start();
        },
    });

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
            {/* Header avec image */}
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

            {/* Contenu */}
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
                        <Text style={styles.ticketLabel}>Remaining tickets</Text>
                        <Text style={styles.ticketCount}>
                            {event.ticketsremaining}/{event.capacity}
                        </Text>
                    </View>
                    <View style={styles.ticketIcon}>
                        <FontAwesome5 name="map-marker-alt" size={24} color="#6A5ACD" />
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.descriptionText}>{event.description}</Text>
            </View>

            {/* Sélecteur de tickets et slider */}
            <View style={styles.bottomContainer}>
                {/* Selecteur de tickets */}
                <TouchableOpacity
                    style={styles.ticketSelector}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.ticketSelectorText}>{selectedTickets}</Text>
                    <View style={styles.arrowContainer}>
                        <FontAwesome5 name="chevron-down" size={16} color="#6A5ACD" />
                    </View>
                </TouchableOpacity>

                <View style={styles.spaceBetween} />

                <View style={styles.sliderContainer}>
                    <Animated.View
                        {...slideResponder.panHandlers}
                        style={[
                            styles.sliderThumb,
                            { transform: [{ translateX: slidePosition }] },
                        ]}
                    >
                        <FontAwesome5 name="angle-double-right" size={20} color="#6A5ACD" />
                    </Animated.View>
                    <Text style={styles.sliderText}>
                        Slide to Buy - ${event.ticketprice * selectedTickets}
                    </Text>
                </View>
            </View>


            <Modal visible={isModalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Select number of tickets</Text>
                        <FlatList
                            data={Array.from(
                                { length: Math.min(event.ticketsremaining, 10) },
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
                            style={{ flexGrow: 0 }}
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
    headerImage: { height: 300, justifyContent: "space-between" },
    headerIcons: { flexDirection: "row", justifyContent: "space-between", padding: 20, marginTop: 30 },
    iconButton: { backgroundColor: "white", borderRadius: 20, padding: 10 },
    contentContainer: { padding: 20 },
    eventTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
    eventInfo: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
    eventSubText: { fontSize: 14, color: "gray" },
    ticketContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 15,
        backgroundColor: "#F9F9F9",
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 12,
        marginVertical: 10,
    },

    ticketDetails: {
        flexDirection: "column",
    },

    ticketLabel: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
    },

    ticketCount: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#6A5ACD",
    },

    ticketIcon: {
        backgroundColor: "#EEE",
        borderRadius: 10,
        padding: 10,
        elevation: 2,
    },

    ticketText: { fontSize: 16, fontWeight: "bold" },
    sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
    descriptionText: { fontSize: 14, color: "gray", marginBottom: 20 },
    bottomContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20 },
    ticketSelector: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 40,
        width: 70,
        justifyContent: "space-between",
    },
    ticketSelectorText: { fontSize: 16, color: "#333" },
    arrowContainer: { marginLeft: 5 },
    spaceBetween: {
        width: 20,
    },
    sliderContainer: {
        flex: 1,
        backgroundColor: "#6A5ACD",
        borderRadius: 30,
        height: 50,
        justifyContent: "center",
        position: "relative",
    },
    sliderThumb: {
        position: "absolute",
        backgroundColor: "#FFF",
        borderRadius: 30,
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        elevation: 3,
    },
    sliderText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
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
