import {NavigatorScreenParams} from "@react-navigation/native";

export type AuthStackParamList = {
    AuthScreen: undefined; // Nom unique pour l'écran d'authentification
};

export type BottomTabParamList = {
    Home: undefined;
    Map: undefined;
    "Scan QR": undefined;
};

export type MainStackParamList = {
    Splash: undefined;
    Auth: undefined;
    App: undefined;
    "Event List": undefined;
    Profile: undefined;
    "Event Detail": { eventId: any };
    Modal: { eventId: any };
};

