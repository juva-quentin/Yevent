import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

interface CustomButtonProps {
    title: string; // Texte affiché sur le bouton
    onPress: () => void; // Fonction appelée lors du clic sur le bouton
    backgroundColor?: string; // Couleur de fond du bouton
    textColor?: string; // Couleur du texte
    style?: ViewStyle; // Style supplémentaire pour le bouton
    textStyle?: TextStyle; // Style supplémentaire pour le texte
    disabled?: boolean; // Si le bouton est désactivé
}

export default function CustomButton({
                                         title,
                                         onPress,
                                         backgroundColor = "#6A5ACD",
                                         textColor = "#fff",
                                         style,
                                         textStyle,
                                         disabled = false,
                                     }: CustomButtonProps) {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: disabled ? "#ccc" : backgroundColor },
                style,
            ]}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={[styles.buttonText, { color: textColor }, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        width: "100%",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
    },
});
