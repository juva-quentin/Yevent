import React, { useState } from "react";
import {
    View,
    Text,
    ImageBackground,
    StyleSheet,
    Dimensions,
    Alert,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { AuthStackParamList } from "../types";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { authService } from "../services/authService";

type Props = StackScreenProps<AuthStackParamList, "AuthScreen">;

const { height } = Dimensions.get("window");

export default function AuthScreen({ navigation }: Props) {
    const [isRegister, setIsRegister] = useState(false);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Email and password are required.");
            return;
        }

        try {
            if (isRegister) {
                if (password !== confirmPassword) {
                    Alert.alert("Error", "Passwords do not match!");
                    return;
                }

                await authService.register({ fullName, email, password });
                navigation.replace("App");
            } else {
                const userData = await authService.login({ email, password });

                if (!userData.emailConfirmed) {
                    console.log("Email not verified yet.");
                }

                navigation.replace("App");
            }
        } catch (error: any) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <ImageBackground
                    source={require("../assets/images/background.jpg")}
                    style={styles.backgroundImage}
                    resizeMode="cover"
                />
            </View>
            <View style={styles.card}>
                <Text style={styles.title}>{isRegister ? "REGISTER" : "LOGIN"}</Text>
                <Text style={styles.subtitle}>
                    {isRegister
                        ? "Please fill the details to create an account"
                        : "Please fill the details to continue"}
                </Text>
                {isRegister && (
                    <CustomInput
                        placeholder="Full Name"
                        value={fullName}
                        onChangeText={setFullName}
                    />
                )}
                <CustomInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                />
                <CustomInput
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                {isRegister && (
                    <CustomInput
                        placeholder="Confirm Password"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                )}
                <CustomButton
                    title={isRegister ? "Register" : "Login"}
                    onPress={handleSubmit}
                />
                <Text style={styles.accountText}>
                    {isRegister
                        ? "Already have an account? "
                        : "Don't have an account? "}
                    <Text
                        style={styles.loginLink}
                        onPress={() => setIsRegister(!isRegister)}
                    >
                        {isRegister ? "Login" : "Register"}
                    </Text>
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    imageContainer: { height: height * 0.5, overflow: "hidden" },
    backgroundImage: { flex: 1, width: "110%", alignSelf: "center" },
    card: {
        flex: 1,
        backgroundColor: "white",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
        alignItems: "center",
        marginTop: -30,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: "#777",
        marginBottom: 20,
    },
    accountText: { color: "#777", marginTop: 20 },
    loginLink: { color: "#6A5ACD", fontWeight: "bold" },
});
