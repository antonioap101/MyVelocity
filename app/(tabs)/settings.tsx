import React, {useEffect, useState} from "react";
import {View, Text, TextInput, Button, StyleSheet, ScrollView, useColorScheme} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import {Colors} from "@/assets/theme/Colors";

type Styles = ReturnType<typeof createStyles>; // Correctly infer the type of styles

export default function Settings(){
    const { t } = useTranslation();
    const colorScheme = useColorScheme();
    const [styles, setStyles] = useState<Styles>(createStyles('light'));

    useEffect(() => {
        if (colorScheme === undefined || colorScheme === null) {
            return;
        }
        setStyles(createStyles(colorScheme));
    }, [colorScheme]);


    // Estados para configurar las bandas muertas
    const [initialInterval, setInitialInterval] = useState("500"); // Ejemplo de valor por defecto
    const [deadZoneConfigs, setDeadZoneConfigs] = useState({
        runningToSprinting: { duration: "1500", stableMessages: "10" },
        sprintingToRunning: { duration: "500", stableMessages: "5" },
    });

    // Controladores de cambio
    const handleInitialIntervalChange = (value: string) => setInitialInterval(value);

    const handleDeadZoneChange = (transitionKey: string, field: string, value: string) => {

    };

    const handleSaveSettings = () => {
        // Lógica para guardar las configuraciones (persistencia si es necesario)
        console.log("Settings saved:", { initialInterval, deadZoneConfigs });
        alert(t("settings.saved"));
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>{t("settings.title")}</Text>

                {/* Configuración del intervalo inicial */}
                <View style={styles.section}>
                    <Text style={styles.label}>{t("settings.initial_interval")}</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={initialInterval}
                        onChangeText={handleInitialIntervalChange}
                    />
                </View>

                {/* Configuración de bandas muertas */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t("settings.dead_zones")}</Text>
                    <View style={styles.transitionSection}>
                        <Text style={styles.label}>{t("settings.running_to_sprinting")}</Text>
                        <Text>{t("settings.min_duration")}</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={deadZoneConfigs.runningToSprinting.duration}
                            onChangeText={(value) => handleDeadZoneChange("runningToSprinting", "duration", value)}
                        />
                        <Text>{t("settings.stable_messages")}</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={deadZoneConfigs.runningToSprinting.stableMessages}
                            onChangeText={(value) => handleDeadZoneChange("runningToSprinting", "stableMessages", value)}
                        />
                    </View>

                    <View style={styles.transitionSection}>
                        <Text style={styles.label}>{t("settings.sprinting_to_running")}</Text>
                        <Text>{t("settings.min_duration")}</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={deadZoneConfigs.sprintingToRunning.duration}
                            onChangeText={(value) => handleDeadZoneChange("sprintingToRunning", "duration", value)}
                        />
                        <Text>{t("settings.stable_messages")}</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={deadZoneConfigs.sprintingToRunning.stableMessages}
                            onChangeText={(value) => handleDeadZoneChange("sprintingToRunning", "stableMessages", value)}
                        />
                    </View>
                </View>

                {/* Botón para guardar configuraciones */}
                <Button title={t("settings.save")} onPress={handleSaveSettings} />
            </ScrollView>
        </SafeAreaView>
    );
};


export const createStyles = (colorScheme: "light" | "dark") =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colorScheme === "dark" ? Colors.dark.background : Colors.light.background,
        },
        content: {
            padding: 20,
        },
        title: {
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 20,
            textAlign: "center",
            color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
        },
        section: {
            marginBottom: 20,
        },
        sectionTitle: {
            fontSize: 20,
            fontWeight: "600",
            marginBottom: 10,
            color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
        },
        label: {
            fontSize: 16,
            marginBottom: 5,
            color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
        },
        input: {
            borderWidth: 1,
            borderColor: colorScheme === "dark" ? Colors.dark.border : "#ccc",
            padding: 10,
            borderRadius: 5,
            marginBottom: 10,
            backgroundColor: colorScheme === "dark" ? Colors.dark.background : "#fff",
            color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
        },
        transitionSection: {
            marginBottom: 20,
        },
    });
