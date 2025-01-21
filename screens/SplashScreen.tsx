import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { supabase } from "../utils/supabase";

export default function SplashScreen({ navigation }: any) {
    useEffect(() => {
        const checkSession = async () => {
            try {
                const { data, error } = await supabase.auth.getSession();

                if (error) {
                    console.error("Session fetch error:", error.message);
                    Alert.alert("Error", "Failed to verify session. Redirecting to login.");
                    navigation.replace("Auth");
                    return;
                }

                console.log("Session data:", data);
                navigation.replace(data.session ? "App" : "Auth");
            } catch (error) {
                // @ts-ignore
                console.error("Error fetching session:", error.message);
                Alert.alert("Error", "An unexpected error occurred. Redirecting to login.");
                navigation.replace("Auth");
            }
        };

        checkSession();
    }, [navigation]);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#6A5ACD" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
