import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import { useRoute, useNavigation } from "@react-navigation/native";
import { reservationService } from "../services/reservationService";
import { eventService } from "../services/eventService";
import { ReservationModel } from "../models/ReservationModel";
import { EventModel } from "../models/EventModel";

const { width } = Dimensions.get("window");

export default function TicketDetailScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { reservationId } = route.params as { reservationId: string };

    const [reservation, setReservation] = useState<ReservationModel | null>(null);
    const [event, setEvent] = useState<EventModel | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0); // Suivre l'index actuel

    useEffect(() => {
        const fetchReservationDetails = async () => {
            try {
                const reservationData = await reservationService.getReservationById(reservationId);
                setReservation(reservationData);

                if (reservationData) {
                    const eventData = await eventService.getEventById(reservationData.eventid);
                    setEvent(eventData);
                }
            } catch (error) {
                console.error("Error fetching reservation details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReservationDetails();
    }, [reservationId]);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#6A5ACD" />
            </View>
        );
    }

    if (!reservation || !event) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Reservation or Event not found!</Text>
            </View>
        );
    }

    const tickets = Array(reservation.tickets).fill({
        eventName: event.title,
        location: event.location,
        date: new Date(event.date).toLocaleDateString(),
        time: new Date(event.date).toLocaleTimeString(),
        eventId: event.eventid,
    });

    const handleScroll = (event: any) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => navigation.goBack()}
                >
                    <FontAwesome5 name="arrow-left" size={20} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Ticket Details</Text>
            </View>


            {/* Tickets Carousel */}
            <FlatList
                data={tickets}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => `ticket-${index}`}
                onScroll={handleScroll}
                renderItem={({ item }) => (
                    <View style={styles.ticketCard}>
                        <View style={styles.ticketInfo}>
                            <Text style={styles.ticketTitle}>{item.eventName}</Text>
                            <Text style={styles.ticketDetail}>
                                <Text style={styles.label}>Location: </Text>
                                {item.location}
                            </Text>
                            <Text style={styles.ticketDetail}>
                                <Text style={styles.label}>Date: </Text>
                                {item.date}
                            </Text>
                            <Text style={styles.ticketDetail}>
                                <Text style={styles.label}>Time: </Text>
                                {item.time}
                            </Text>
                            <View style={styles.qrCodeContainer}>
                                <QRCode value={item.eventId} size={150} />
                            </View>
                        </View>
                    </View>
                )}
            />

            {/* Pagination Dots */}
            <View style={styles.pagination}>
                {tickets.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            index === currentIndex && styles.activeDot,
                        ]}
                    />
                ))}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F9F9F9" },
    header: {
        flexDirection: "row",
        alignItems: "center", // Aligne les éléments verticalement
        paddingHorizontal: 20,
        paddingVertical: 15, // Ajustez pour contrôler la hauteur
        backgroundColor: "#F9F9F9",
    },
    headerTitle: {
        flex: 1, // Permet au titre d'occuper l'espace disponible
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center", // Centre le titre horizontalement
    },
    iconButton: {
        padding: 10,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFF",
        elevation: 3,
        marginRight: 10, // Ajoute un espace pour ne pas coller au titre
    },
    ticketCard: {
        width: width * 0.9,
        marginHorizontal: width * 0.05,
        backgroundColor: "#fff",
        borderRadius: 10,
        overflow: "hidden",
        elevation: 4,
        marginVertical: 10,
    },
    ticketInfo: {
        padding: 20,
    },
    ticketTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    ticketDetail: {
        fontSize: 16,
        marginBottom: 5,
    },
    label: {
        fontWeight: "bold",
    },
    qrCodeContainer: {
        alignItems: "center",
        marginTop: 20,
    },
    pagination: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 20,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#DDD",
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: "#6A5ACD",
    },
    loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    errorText: { fontSize: 18, color: "red" },
});
