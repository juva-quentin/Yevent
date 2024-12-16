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
    Auth: NavigatorScreenParams<AuthStackParamList>;
    App: NavigatorScreenParams<BottomTabParamList>;
    Home: undefined;
    Profile: undefined;
    "Event List": undefined;
    "Event Detail": { eventId: string };
};
