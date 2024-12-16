import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { FontAwesome5 } from "@expo/vector-icons";
import { MainStackParamList, AuthStackParamList, BottomTabParamList } from "../types";

// Import des écrans
import HomeScreen from "../screens/HomeScreen";
import MapScreen from "../screens/MapScreen";
import ScanQRScreen from "../screens/ScanQRScreen";
import ProfileScreen from "../screens/ProfileScreen";
import EventListScreen from "../screens/EventListScreen";
import EventDetailScreen from "../screens/EventDetailScreen";
import AuthScreen from "../screens/AuthScreen";
import SplashScreen from "../screens/SplashScreen";

// Création des navigateurs
const Stack = createStackNavigator<MainStackParamList>();
const AuthStackNavigator = createStackNavigator<AuthStackParamList>();
const BottomTabNavigator = createBottomTabNavigator<BottomTabParamList>();

function AuthStack() {
    return (
        <AuthStackNavigator.Navigator>
            <AuthStackNavigator.Screen
                name="AuthScreen" // Nom unique pour éviter les conflits
                component={AuthScreen}
                options={{ headerShown: false }}
            />
        </AuthStackNavigator.Navigator>
    );
}


// Stack Navigator pour les écrans imbriqués dans Home
const HomeStack = createStackNavigator<MainStackParamList>();

function HomeStackNavigator() {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen name="Profile" component={ProfileScreen} />
            <HomeStack.Screen name="Event List" component={EventListScreen} />
            <HomeStack.Screen name="Event Detail" component={EventDetailScreen} />
        </HomeStack.Navigator>
    );
}

// Bottom Tabs Navigation
function BottomTabs() {
    return (
        <BottomTabNavigator.Navigator
            initialRouteName="Home" // Définit Home comme l'écran par défaut
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === "Map") iconName = "map";
                    else if (route.name === "Home") iconName = "home";
                    else if (route.name === "Scan QR") iconName = "qrcode";
                    return <FontAwesome5 name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "#6A5ACD",
                tabBarInactiveTintColor: "gray",
            })}
        >
            {/* Utilisation directe de HomeScreen */}

            <BottomTabNavigator.Screen name="Map" component={MapScreen} options={{ headerShown: false }} />
            <BottomTabNavigator.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
            <BottomTabNavigator.Screen name="Scan QR" component={ScanQRScreen} options={{ headerShown: false }}/>
        </BottomTabNavigator.Navigator>
    );
}



// Navigation principale
export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Auth" component={AuthStack} />
                <Stack.Screen name="App" component={BottomTabs} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
