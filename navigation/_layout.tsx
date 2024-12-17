import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { Modal } from "react-native";
import CustomTabs from "../components/CustomTabs";

// Import des écrans
import HomeScreen from "../screens/HomeScreen";
import MapScreen from "../screens/MapScreen";
import ScanQRScreen from "../screens/ScanQRScreen";
import SplashScreen from "../screens/SplashScreen";
import AuthScreen from "../screens/AuthScreen";
import ProfileScreen from "../screens/ProfileScreen";
import EventListScreen from "../screens/EventListScreen";
import EventDetailScreen from "../screens/EventDetailScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Navigation principale des Tabs
function TabsNavigator() {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            tabBar={(props) => <CustomTabs {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Tab.Screen name="Map" component={MapScreen} />
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Scan QR" component={ScanQRScreen} />
        </Tab.Navigator>
    );
}

// Modal Global
function ModalScreen({ route, navigation }: any) {
    const { eventId } = route.params || {};
    return (
        <Modal animationType="slide" transparent={true} visible={true}>
            <EventDetailScreen route={{ params: { eventId } }} navigation={navigation} />
        </Modal>
    );
}

// Navigation principale
export default function RootLayout() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Auth" component={AuthScreen} />
                <Stack.Screen name="App" component={TabsNavigator} />
                <Stack.Screen name="Event List" component={EventListScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="Event Detail" component={EventDetailScreen} />
                <Stack.Screen name="Modal" component={ModalScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
