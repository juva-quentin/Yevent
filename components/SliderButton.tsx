import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { FontAwesome5 } from "@expo/vector-icons";

const SliderButton = ({ onSlideComplete, selectedTickets, ticketPrice }: { onSlideComplete: () => void; selectedTickets: number; ticketPrice: number }) => {
    const SCREEN_WIDTH = Dimensions.get("window").width; // Largeur de l'écran
    const CONTAINER_PADDING = 20; // Marges du conteneur global
    const BUTTON_WIDTH = 50; // Largeur du bouton slider
    const SLIDER_WIDTH = SCREEN_WIDTH - 2 * CONTAINER_PADDING; // Largeur du conteneur du slider
    const END_POSITION = SLIDER_WIDTH - BUTTON_WIDTH; // Position maximale du bouton

    const position = useSharedValue(0);

    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            position.value = Math.max(0, Math.min(e.translationX, END_POSITION));
        })
        .onEnd(() => {
            if (position.value > END_POSITION * 0.8) {
                position.value = withTiming(END_POSITION, { duration: 200 });
                onSlideComplete();
            } else {
                position.value = withTiming(0, { duration: 200 });
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: position.value }],
    }));

    return (
        <View style={[styles.sliderContainer, { width: SLIDER_WIDTH }]}>
            <Text style={styles.sliderText}>
                Swipe to Buy - ${ticketPrice * selectedTickets}
            </Text>
            <GestureDetector gesture={panGesture}>
                <Animated.View style={[styles.swipeBtn, animatedStyle]}>
                    <FontAwesome5 name="arrow-right" size={20} color="#6A5ACD" />
                </Animated.View>
            </GestureDetector>
        </View>
    );
};

const styles = StyleSheet.create({
    sliderContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#6A5ACD",
        height: 50,
        borderRadius: 25,
        overflow: "hidden",
    },
    sliderText: {
        color: "#FFF",
        fontSize: 16,
        textAlign: "center",
        flex: 1,
    },
    swipeBtn: {
        width: 50,
        height: 50,
        backgroundColor: "#FFF",
        position: "absolute",
        left: 0,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 25,
    },
});

export default SliderButton;
