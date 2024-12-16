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
    onPress: () => void;
};

export default function SmallEventCard({
                                           image,
                                           title,
                                           date,
                                           time,
                                           tickets,
                                           onPress,
                                       }: SmallEventCardProps) {
    return (
        <View style={styles.cardShadow}>
            <View style={styles.cardContainer}>
                {/* Image avec Shadow */}
                <View style={styles.imageContainer}>
                    <Image source={image} style={styles.cardImage} />
                </View>

                {/* Contenu de la carte */}
                <View style={styles.detailsContainer}>
                    <Text style={styles.eventTitle}>{title}</Text>
                    <View style={styles.eventRow}>
                        <FontAwesome5 name="calendar" size={12} color="#777" />
                        <Text style={styles.eventText}> {date}</Text>
                        <View style={{ marginHorizontal: 8 }} />
                        <FontAwesome5 name="clock" size={12} color="#777" />
                        <Text style={styles.eventText}> {time}</Text>
                    </View>

                    {/* Tickets */}
                    <View style={styles.ticketRow}>
                        <Text style={styles.tickets}>{tickets}</Text>
                        <TouchableOpacity onPress={onPress}>
                            <Text style={styles.buyTicket}>Buy Ticket &gt;</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cardShadow: {
        margin: 10,
        borderRadius: 12,
        backgroundColor: "#fff",
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 6,
            },
            android: {
                elevation: 6,
            },
        }),
    },
    cardContainer: {
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#fff",
        width: width * 0.45, // Largeur fixe pour la carte
    },
    imageContainer: {
        borderRadius: 12,
        margin: 8,
        overflow: "hidden",
        backgroundColor: "#fff",
    },
    cardImage: {
        width: "100%",
        height: 120,
        borderRadius: 10,
    },
    detailsContainer: {
        paddingHorizontal: 10,
        paddingBottom: 10,
        paddingTop: 5,
    },
    eventTitle: {
        fontWeight: "bold",
        fontSize: 14,
        color: "#000",
        marginBottom: 5,
    },
    eventRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },
    eventText: {
        fontSize: 12,
        color: "#777",
    },
    ticketRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 5,
    },
    tickets: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#6A5ACD",
    },
    buyTicket: {
        fontSize: 12,
        color: "#6A5ACD",
        fontWeight: "bold",
    },
});
