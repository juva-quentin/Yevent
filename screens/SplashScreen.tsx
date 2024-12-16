import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { supabase } from "../utils/supabase";

export default function SplashScreen({ navigation }: any) {
    useEffect(() => {
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();

            navigation.replace(data.session ? "App" : "Auth");
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
