import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ProfileScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>User Profile</Text>
            <Text>Display user information here.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
});
