import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface CustomButtonProps {
    title: string;
    onPress: () => void;
    backgroundColor?: string;
}

export default function CustomButton({
                                         title,
                                         onPress,
                                         backgroundColor = "#6A5ACD",
                                     }: CustomButtonProps) {
    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor }]}
            onPress={onPress}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        width: "100%",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 20,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});
