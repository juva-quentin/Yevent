import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    Platform,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// Props pour le composant
type HorizontalEventCardProps = {
    image: any;
    title: string;
    date: string;
    time: string;
    price?: string;
    onPress: () => void;
};

export default function HorizontalEventCard({
                                                image,
                                                title,
                                                date,
                                                time,
                                                price,
                                                onPress,
                                            }: HorizontalEventCardProps) {
    return (
        <View style={styles.cardContainer}>
            {/* Image */}
            <View style={styles.imageContainer}>
                <Image source={image} style={styles.cardImage} />
            </View>

            {/* Détails */}
            <View style={styles.detailsContainer}>
                <Text style={styles.eventTitle}>{title}</Text>
                <View style={styles.eventInfo}>
                    <FontAwesome5 name="calendar" size={12} color="#777" />
                    <Text style={styles.eventText}> {date}</Text>
                    <View style={{ marginHorizontal: 8 }} />
                    <FontAwesome5 name="clock" size={12} color="#777" />
                    <Text style={styles.eventText}> {time}</Text>
                </View>

                {/* Prix et bouton */}
                <View style={styles.bottomRow}>
                    {price && <Text style={styles.eventPrice}>{price}</Text>}
                    <TouchableOpacity onPress={onPress}>
                        <Text style={styles.buyTicket}>Buy Ticket &gt;</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 12,
        elevation: 4,
        margin: 10,
        overflow: "hidden",
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
        }),
        width: width * 0.9,
        height: 120,
    },
    imageContainer: {
        width: "35%",
        height: "100%",
        backgroundColor: "#f0f0f0",
    },
    cardImage: {
        width: "100%",
        height: "100%",
    },
    detailsContainer: {
        flex: 1,
        padding: 10,
        justifyContent: "space-between",
    },
    eventTitle: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#000",
    },
    eventInfo: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
    },
    eventText: {
        fontSize: 12,
        color: "#777",
    },
    bottomRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    eventPrice: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#6A5ACD",
    },
    buyTicket: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#6A5ACD",
    },
});
