import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

type CustomTabsProps = {
    state: any;
    descriptors: any;
    navigation: any;
};

const CustomTabs = ({ state, descriptors, navigation }: CustomTabsProps) => {
    const tabs = [
        { name: "Map", icon: "map" },
        { name: "Home", icon: "home" },
        { name: "Scan QR", icon: "qrcode" },
    ];

    return (
        <View style={styles.tabBar}>
            {tabs.map((tab, index) => {
                const isFocused = state.index === index;
                const isHome = tab.name === "Home";

                return (
                    <TouchableOpacity
                        key={tab.name}
                        onPress={() => navigation.navigate(tab.name)}
                        style={[
                            styles.tabItem,
                            isHome && styles.centralTab, // Style spécifique pour Home
                            isFocused && styles.activeTab, // Style actif pour tous les onglets
                            isHome && isFocused && styles.centralTabActive, // Style actif spécifique pour Home
                        ]}
                    >
                        <FontAwesome5
                            name={tab.icon}
                            size={20}
                            color={isFocused ? (isHome ? "#FFF" : "#6A5ACD") : "#333"} // Couleurs distinctes
                        />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default CustomTabs;

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 30,
        paddingVertical: 10,
        position: "absolute",
        bottom: 20,
        alignSelf: "center",
        width: "85%",
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    tabItem: {
        justifyContent: "center",
        alignItems: "center",
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    centralTab: {
        marginTop: -20, // Décale l'icône Home vers le haut
        backgroundColor: "#E0E5FF",
        borderRadius: 30,
        width: 60,
        height: 60,
        justifyContent: "center",
        alignItems: "center",
        elevation: 8,
    },
    centralTabActive: {
        backgroundColor: "#6A5ACD", // Fond actif pour Home
    },
    activeTab: {
        backgroundColor: "#E0E5FF", // Fond actif pour les autres onglets
    },
});
