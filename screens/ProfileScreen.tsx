import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    SafeAreaView,
    Image,
} from "react-native";
import { FontAwesome5, Feather } from "@expo/vector-icons";
import { authService } from "../services/authService";
import { reservationService } from "../services/reservationService";
import { eventService } from "../services/eventService";
import { User } from "../models/AuthModels";
import { ReservationModel } from "../models/ReservationModel";
import { EventModel } from "../models/EventModel";

export default function ProfileScreen({ navigation }: any) {
    const [user, setUser] = useState<User | null>(null);
    const [reservations, setReservations] = useState<ReservationModel[]>([]);
    const [events, setEvents] = useState<Record<string, EventModel>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const currentUser = await authService.getCurrentUser();
                if (currentUser) {
                    setUser(currentUser);

                    // Fetch reservations for the user
                    const reservationsData = await reservationService.getReservationsByUser(
                        currentUser.id
                    );
                    setReservations(reservationsData);

                    // Fetch event details for all reservations
                    const eventPromises = reservationsData.map((reservation) =>
                        eventService.getEventById(reservation.eventid)
                    );
                    const eventDetails = await Promise.all(eventPromises);
                    const eventsMap = eventDetails.reduce((acc, event) => {
                        if (event) acc[event.eventid] = event;
                        return acc;
                    }, {} as Record<string, EventModel>);
                    setEvents(eventsMap);
                }
            } catch (error: any) {
                console.error("Error fetching user data:", error.message);
                Alert.alert("Error", "Failed to load profile information.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = async () => {
        try {
            await authService.logout();
            navigation.replace("Auth");
        } catch (error: any) {
            console.error("Error during logout:", error.message);
            Alert.alert("Error", "Failed to log out. Please try again.");
        }
    };

    const handleReservationPress = (reservation: ReservationModel) => {
        navigation.navigate("Ticket Detail", { reservationId: reservation.reservationid });
    };

    const renderReservationCard = ({ item }: { item: ReservationModel }) => {
        const event = events[item.eventid];
        if (!event) return null;

        const eventDate = new Date(event.date).toLocaleDateString();
        const eventTime = new Date(event.date).toLocaleTimeString();

        return (
            <TouchableOpacity onPress={() => handleReservationPress(item)}>
                <View style={styles.card}>
                    <Image
                        source={require("../assets/images/event1.jpeg")}
                        style={styles.cardImage}
                    />
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>{event.title}</Text>
                        <Text style={styles.cardText}>Location: {event.location}</Text>
                        <Text style={styles.cardText}>Date: {eventDate}</Text>
                        <Text style={styles.cardText}>Time: {eventTime}</Text>
                        <Text style={styles.cardText}>Tickets Reserved: {item.tickets}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
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
                <Text style={styles.headerTitle}>My Profile</Text>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>


            {/* Profile Information */}
            <View style={styles.profileBox}>
                <FontAwesome5 name="user-circle" size={80} color="#6A5ACD" style={styles.profileIcon} />
                <View style={styles.profileInfo}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Full Name</Text>
                        <Text style={styles.infoValue}>{user?.fullName || "N/A"}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Email</Text>
                        <Text style={styles.infoValue}>{user?.email || "N/A"}</Text>
                    </View>
                </View>
            </View>

            {/* Reservations */}
            <View style={styles.reservationsSection}>
                <Text style={styles.sectionTitle}>Your Tickets</Text>
                {loading ? (
                    <Text style={styles.loadingText}>Loading...</Text>
                ) : reservations.length > 0 ? (
                    <FlatList
                        data={reservations}
                        keyExtractor={(item) => item.reservationid}
                        renderItem={renderReservationCard}
                        contentContainerStyle={styles.reservationsList}
                    />
                ) : (
                    <Text style={styles.noReservations}>No tickets purchased yet.</Text>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F9F9F9" },
    header: {
        flexDirection: "row",
        alignItems: "center", // Aligne verticalement
        justifyContent: "space-between", // Espacement entre les éléments
        paddingHorizontal: 20,
        paddingVertical: 10, // Ajustez la hauteur
        backgroundColor: "#F9F9F9",
    },
    iconButton: {
        padding: 10,
        borderRadius: 50,
        backgroundColor: "#FFF",
        elevation: 3,
    },
    headerTitle: {
        flex: 1, // Permet au titre de prendre tout l'espace disponible
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center", // Centre le texte horizontalement
    },
    logoutButton: {
        backgroundColor: "#6A5ACD",
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    logoutButtonText: {
        color: "#FFF",
        fontSize: 14,
        fontWeight: "600",
    },
    profileBox: {
        backgroundColor: "#fff",
        borderRadius: 10,
        marginHorizontal: 20,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginTop: 20,
    },
    profileIcon: {
        marginBottom: 20,
    },
    profileInfo: {
        width: "100%",
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    infoLabel: {
        fontSize: 14,
        color: "#666",
        fontWeight: "600",
    },
    infoValue: {
        fontSize: 14,
        color: "#333",
        fontWeight: "600",
    },
    reservationsSection: {
        marginTop: 20,
        flex: 1,
        paddingHorizontal: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    reservationsList: {
        justifyContent: "space-between",
    },
    noReservations: {
        fontSize: 14,
        color: "#999",
        textAlign: "center",
        marginTop: 20,
    },
    loadingText: {
        fontSize: 14,
        color: "#999",
        textAlign: "center",
        marginTop: 20,
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 10,
        marginVertical: 10,
        marginHorizontal: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardImage: {
        width: 100,
        height: 100,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    cardContent: {
        flex: 1,
        padding: 10,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    cardText: {
        fontSize: 14,
        color: "#666",
        marginBottom: 5,
    },
});
