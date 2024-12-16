import React from "react";
import {
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import { FontAwesome5, Feather } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import { MainStackParamList } from "../types";
import SmallEventCard from "../components/SmallEventCard";
import HorizontalEventCard from "../components/HorizontalEventCard"; // Composant ajouté

const { width } = Dimensions.get("window");

// Type Props
type Props = StackScreenProps<MainStackParamList, "Home">;

// Données fictives
const nearbyEvents = [
    {
        id: "1",
        title: "Tomorrowland 2024",
        date: "Nov 10 2024",
        time: "08:00 PM",
        image: require("../assets/images/event1.jpeg"),
        availableTickets: "40/100",
    },
    {
        id: "2",
        title: "Tomorrowland 2024",
        date: "Nov 10 2024",
        time: "08:00 PM",
        image: require("../assets/images/event1.jpeg"),
        availableTickets: "40/100",
    },
];

const popularEvents = [
    {
        id: "3",
        title: "Tribute to Didi Kempot",
        date: "November 7 2024",
        time: "07:00 PM",
        price: "$20",
        image: require("../assets/images/event1.jpeg"),
    },
    {
        id: "4",
        title: "Coldplay Live Concert",
        date: "December 15 2024",
        time: "09:00 PM",
        price: "$50",
        image: require("../assets/images/event1.jpeg"),
    },
];

export default function HomeScreen({ navigation }: Props) {
    return (
        <View style={styles.container}>
            {/* Header */}
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
                    placeholder="Search event, stand up ..."
                    style={styles.searchInput}
                />
            </View>

            {/* Nearby Events */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Nearby Event</Text>
                <TouchableOpacity>
                    <Text style={styles.seeMore}>See More</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={nearbyEvents}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <SmallEventCard
                        image={item.image}
                        title={item.title}
                        date={item.date}
                        time={item.time}
                        tickets={item.availableTickets}
                        onPress={() => console.log("Ticket pressed")}
                    />
                )}
                contentContainerStyle={styles.flatListContainer}
            />

            {/* Espacement */}
            <View style={{ height: 20 }} />

            {/* Popular Events */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Popular Event</Text>
                <TouchableOpacity>
                    <Text style={styles.seeMore}>See More</Text>
                </TouchableOpacity>
            </View>

            {/* Cartes HorizontalEventCard */}
            <FlatList
                data={popularEvents}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <HorizontalEventCard
                        image={item.image}
                        title={item.title}
                        date={item.date}
                        time={item.time}
                        price={item.price}
                        onPress={() => console.log("Popular Ticket pressed")}
                    />
                )}
                contentContainerStyle={styles.popularListContainer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        paddingTop: 50,
    },
    title: { fontSize: 28, fontWeight: "bold", color: "#333" },
    searchBar: {
        flexDirection: "row",
        backgroundColor: "#F0F0F0",
        borderRadius: 12,
        marginHorizontal: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: "center",
    },
    searchInput: { flex: 1, marginLeft: 10, color: "#333" },
    icon: { marginRight: 10 },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
        paddingHorizontal: 20,
    },
    sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
    seeMore: { color: "#6A5ACD", fontWeight: "bold" },
    flatListContainer: {
        paddingHorizontal: 10,
    },
    popularListContainer: {
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
});
