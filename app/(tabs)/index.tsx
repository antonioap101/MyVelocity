import React, {useEffect, useState} from "react";
import {StyleSheet, useColorScheme, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useTranslation} from "react-i18next";
import {useSpeedSensor} from "@/hooks/useSpeedSensor";
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";
import {Colors} from "@/assets/theme/Colors";
import {SpeedStateUtils} from "@/domain/speedStateUtils";
import {capitalize} from "@/utils/capitalize";

export default function Index() {
    const {t} = useTranslation();
    const {speed, speedState} = useSpeedSensor();
    const colorScheme = useColorScheme();
    const [styles, setStyles] = useState(createStyles("light"));

    useEffect(() => {
        if (colorScheme) setStyles(createStyles(colorScheme));
    }, [colorScheme]);

    // Get icon and name for the current speed state
    const currentIcon = SpeedStateUtils.getIcon(speedState, colorScheme === "dark" ? Colors.dark.primary : Colors.light.primary);
    const currentName = t(`state.${speedState.toLowerCase()}`);

    return (
        <SafeAreaView style={styles.container}>
            <ThemedView style={styles.content}>
                <ThemedText style={styles.title}>{capitalize(t('title.sensor_speed'))}</ThemedText>

                <ThemedText style={styles.speedLabel}>{capitalize(t('label.current_speed'))}:</ThemedText>
                <ThemedText style={styles.speedValue}>{speed.toFixed(2)} km/h</ThemedText>

                <ThemedText style={styles.stateLabel}>{capitalize(t('label.speed_state'))}:</ThemedText>
                <View style={styles.stateContainer}>
                    {currentIcon && <View style={styles.icon}>{currentIcon}</View>}
                    <ThemedText style={styles.stateValue}>{capitalize(currentName)}</ThemedText>
                </View>
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
    stateContainer: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
    },
    icon: {
        marginRight: 10,
    },
    stateValue: {
        fontSize: 28,
        fontWeight: "600",
        color: colorScheme === "dark" ? Colors.dark.primary : Colors.light.primary,
    },
});
