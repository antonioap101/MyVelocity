import React, {useEffect, useState} from "react";
import {StyleSheet, Text, useColorScheme, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useTranslation} from "react-i18next";
import {useSpeedSensor} from "@/hooks/useSpeedSensor";
import {useNavigation} from "expo-router";
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";
import {Colors} from "@/assets/theme/Colors";

export default function Index() {
    const {t} = useTranslation();
    const {speed, speedState} = useSpeedSensor();
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    const [styles, setStyles] = useState(createStyles("light"));

    useEffect(() => {
        if (colorScheme) setStyles(createStyles(colorScheme));
    }, [colorScheme]);

    // Función para capitalizar el texto
    const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

    return (
        <SafeAreaView style={styles.container}>
            <ThemedView style={styles.content}>
                <ThemedText style={styles.title}>{capitalize(t('title.sensor_speed'))}</ThemedText>
                <ThemedText style={styles.speedLabel}>{capitalize(t('label.current_speed'))}:</ThemedText>
                <ThemedText style={styles.speedValue}>{t('value.speed', {speed: speed.toFixed(2)})}</ThemedText>

                <ThemedText style={styles.stateLabel}>{capitalize(t('label.speed_state'))}:</ThemedText>
                <ThemedText style={styles.stateValue}>{capitalize(t(`state.${speedState.toLowerCase()}`))}</ThemedText>
            </ThemedView>
        </SafeAreaView>
    );
}

const createStyles = (colorScheme: "light" | "dark") => StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    speedLabel: {
        fontSize: 18,
        marginBottom: 5,
    },
    speedValue: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#007aff",
        marginBottom: 15,
    },
    stateLabel: {
        fontSize: 18,
        marginBottom: 5,
    },
    stateValue: {
        fontSize: 28,
        fontWeight: "600",
        color: colorScheme === "dark" ? Colors.dark.primary : Colors.light.primary,
    },
});
