import React from "react";
import { TextInput, StyleSheet, View, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

interface CustomInputProps {
    placeholder: string;
    secureTextEntry?: boolean;
    onChangeText?: (text: string) => void;
    value?: string;
    keyboardType?: "default" | "email-address";
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    rightIcon?: { name: string; onPress: () => void };
}

export default function CustomInput({
                                        placeholder,
                                        secureTextEntry = false,
                                        onChangeText,
                                        value,
                                        keyboardType = "default",
                                        autoCapitalize = "none",
                                        rightIcon,
                                    }: CustomInputProps) {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#aaa"
                secureTextEntry={secureTextEntry}
                onChangeText={onChangeText}
                value={value}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
            />
            {rightIcon && (
                <TouchableOpacity onPress={rightIcon.onPress} style={styles.iconContainer}>
                    <FontAwesome5 name={rightIcon.name} size={20} color="#aaa" />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        borderRadius: 10,
        paddingHorizontal: 12,
        marginBottom: 10,
    },
    input: {
        flex: 1,
        color: "#000",
        paddingVertical: 12,
    },
    iconContainer: {
        marginLeft: 10,
    },
});
