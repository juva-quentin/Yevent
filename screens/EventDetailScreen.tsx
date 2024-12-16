import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function EventDetailScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Event Detail</Text>
            <Text>Display detailed information about the event.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
});
