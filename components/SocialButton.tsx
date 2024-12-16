import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface SocialButtonProps {
    title: string;
    onPress: () => void;
    icon: IconProp; // Utilisation correcte du type d'icône
    backgroundColor?: string;
    textColor?: string;
}

export default function SocialButton({
                                         title,
                                         onPress,
                                         icon,
                                         backgroundColor = "#fff",
                                         textColor = "#000",
                                     }: SocialButtonProps) {
    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor }]}
            onPress={onPress}
        >
            <FontAwesomeIcon icon={icon} size={20} color={textColor} style={styles.icon} />
            <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginBottom: 10,
        width: "48%",
        justifyContent: "center",
    },
    buttonText: {
        fontWeight: "bold",
        marginLeft: 10,
        fontSize: 14,
    },
    icon: {
        marginRight: 5,
    },
});
