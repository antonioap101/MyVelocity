import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSpeedSensor } from "@/hooks/useSpeedSensor";

export default function Index() {
    const { speed, speedState } = useSpeedSensor();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Sensor MIVELOCIDAD</Text>
                <Text style={styles.speedLabel}>Velocidad actual:</Text>
                <Text style={styles.speedValue}>{speed.toFixed(2)} m/s</Text>

                <Text style={styles.stateLabel}>Estado de velocidad:</Text>
                <Text style={styles.stateValue}>{speedState}</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0f8ff", // Fondo ligeramente azul
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
        color: "#333",
    },
    speedLabel: {
        fontSize: 18,
        marginBottom: 5,
        color: "#555",
    },
    speedValue: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#007aff", // Azul claro para la velocidad
        marginBottom: 15,
    },
    stateLabel: {
        fontSize: 18,
        marginBottom: 5,
        color: "#555",
    },
    stateValue: {
        fontSize: 28,
        fontWeight: "600",
        color: "#ff4500", // Naranja para el estado
    },
});
