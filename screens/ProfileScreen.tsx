import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { authService } from "../services/authService";
import { eventService } from "../services/eventService";
import { User } from "../models/AuthModels";
import { ReservationModel } from "../models/ReservationModel";

export default function ProfileScreen({ navigation }: any) {
    const [user, setUser] = useState<User | null>(null);
    const [reservations, setReservations] = useState<ReservationModel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const currentUser = await authService.getCurrentUser();
                if (currentUser) {
                    setUser(currentUser);

                    // Fetch reservations for the user
                    const reservationsData = await eventService.getUserReservations(currentUser.id);
                    setReservations(reservationsData);
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
            console.error("Error logging out:", error.message);
            Alert.alert("Error", "Failed to log out.");
        }
    };

    const renderReservation = ({ item }: { item: ReservationModel }) => (
        <View style={styles.reservationCard}>
            <Text style={styles.eventTitle}>Event ID: {item.eventId}</Text>
            <Text>Tickets: {item.tickets}</Text>
            <Text>Total Price: ${item.totalPrice.toFixed(2)}</Text>
            <Text>Date: {new Date(item.timestamp).toLocaleDateString()}</Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#6A5ACD" />
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Failed to load user information.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* User Information */}
            <View style={styles.profileHeader}>
                <FontAwesome5 name="user-circle" size={80} color="#6A5ACD" />
                <Text style={styles.userName}>{user.fullName}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
            </View>

            {/* Reservations */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Your Tickets</Text>
                {reservations.length > 0 ? (
                    <FlatList
                        data={reservations}
                        keyExtractor={(item) => item.reservationId}
                        renderItem={renderReservation}
                        contentContainerStyle={styles.reservationsList}
                    />
                ) : (
                    <Text style={styles.noReservations}>No tickets purchased yet.</Text>
                )}
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 20 },
    profileHeader: {
        alignItems: "center",
        marginBottom: 20,
    },
    userName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginTop: 10,
    },
    userEmail: {
        fontSize: 16,
        color: "#666",
    },
    section: { marginTop: 20 },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
    },
    reservationsList: {
        paddingBottom: 20,
    },
    reservationCard: {
        backgroundColor: "#F9F9F9",
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#DDD",
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#6A5ACD",
        marginBottom: 5,
    },
    noReservations: {
        fontSize: 16,
        color: "#999",
        textAlign: "center",
        marginTop: 20,
    },
    logoutButton: {
        marginTop: 20,
        backgroundColor: "#6A5ACD",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    logoutText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        fontSize: 18,
        color: "red",
        textAlign: "center",
    },
});
