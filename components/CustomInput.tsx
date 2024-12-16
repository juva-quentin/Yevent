import React from "react";
import { TextInput, StyleSheet } from "react-native";

interface CustomInputProps {
    placeholder: string;
    secureTextEntry?: boolean;
    onChangeText?: (text: string) => void;
    value?: string;
}

export default function CustomInput({
                                        placeholder,
                                        secureTextEntry = false,
                                        onChangeText,
                                        value,
                                    }: CustomInputProps) {
    return (
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#aaa"
            secureTextEntry={secureTextEntry}
            onChangeText={onChangeText}
            value={value}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        width: "100%",
        backgroundColor: "#f5f5f5",
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
        color: "#000",
    },
});
