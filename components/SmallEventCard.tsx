import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Platform,
    Dimensions,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

type SmallEventCardProps = {
    image: any;
    title: string;
    date: string;
    time: string;
    tickets: string;
    onPress: () => void; // Fonction passée par le parent
};

export default function SmallEventCard({
                                           image,
                                           title,
                                           date,
                                           time,
                                           tickets,
                                           onPress, // Reçu du parent
                                       }: SmallEventCardProps) {
    return (
        <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
            <View style={styles.imageShadowContainer}>
                <Image source={image} style={styles.cardImage} />
            </View>
            <View style={styles.detailsContainer}>
                <Text style={styles.eventTitle}>{title}</Text>
                <View style={styles.eventRow}>
                    <View style={styles.iconTextContainer}>
                        <FontAwesome5 name="calendar" size={10} color="#777" />
                        <Text style={styles.eventText}> {date}</Text>
                    </View>
                    <View style={styles.iconTextContainer}>
                        <FontAwesome5 name="clock" size={10} color="#777" />
                        <Text style={styles.eventText}> {time}</Text>
                    </View>
                </View>
                <View style={styles.ticketRow}>
                    <Text style={styles.tickets}>{tickets}</Text>
                    <Text style={styles.buyTicket}>Buy Ticket</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: "#fff",
        borderRadius: 10,
        width: width * 0.45,
        height: width * 0.5,
        marginHorizontal: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.1)",
        ...Platform.select({
            ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 4 },
            android: { elevation: 4 },
        }),
    },
    imageShadowContainer: { margin: 6, borderRadius: 10, backgroundColor: "#fff" },
    cardImage: { width: "100%", height: 120, borderRadius: 10 },
    detailsContainer: { paddingHorizontal: 10 },
    eventTitle: { fontSize: 12, fontWeight: "600", color: "black", marginTop: 5, marginBottom: 5 },
    eventRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
    iconTextContainer: { flexDirection: "row", alignItems: "center" },
    eventText: { fontSize: 10, fontWeight: "300", color: "rgba(0, 0, 0, 0.4)" },
    ticketRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    tickets: { fontSize: 10, fontWeight: "600", color: "#6A7BFF" },
    buyTicket: { fontSize: 10, fontWeight: "600", color: "#6A7BFF" },
});
