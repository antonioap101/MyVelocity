import React, {useEffect, useState} from "react";
import {Button, ScrollView, StyleSheet, Text, TextInput, useColorScheme, View,} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useTranslation} from "react-i18next";
import {Colors} from "@/assets/theme/Colors";
import {IndexPath} from "@ui-kitten/components";
import {CustomSelect, Option} from "@/components/CustomSelect";
import {SpeedStateUtils} from "@/domain/speedStateUtils";
import {SpeedState} from "@/domain/speedState";
import {useSpeedSensor} from "@/hooks/useSpeedSensor";

export default function Settings() {
    const {t} = useTranslation();
    const colorScheme = useColorScheme();
    const {speedSensor} = useSpeedSensor(); // Access the speedSensor instance
    const [styles, setStyles] = useState(createStyles("light"));

    useEffect(() => {
        if (colorScheme) setStyles(createStyles(colorScheme));
    }, [colorScheme]);

    // Selected state from dropdown
    const [selectedIndex, setSelectedIndex] = useState<IndexPath | IndexPath[]>(new IndexPath(0));

    // Extract available options for selection
    const options: Option[] = Object.values(SpeedState).map((state) => ({
        title: SpeedStateUtils.getName(state),
        accessoryLeft: () => SpeedStateUtils.getIcon(state),
    }));

    // Get the selected SpeedState
    const selectedState = Object.values(SpeedState)[(selectedIndex as IndexPath).row];

    // Fetch settings for the selected state
    const selectedConfig = speedSensor.getTransitionConfigField(selectedState, "minDurationMs");

    // State for the editable fields
    const [minDuration, setMinDuration] = useState(selectedConfig || 500);
    const [minValue, setMinValue] = useState(speedSensor.getTransitionConfigField(selectedState, "minValue") || 0);
    const [maxValue, setMaxValue] = useState(speedSensor.getTransitionConfigField(selectedState, "maxValue") || 10);

    // Update settings when selection changes
    useEffect(() => {
        setMinDuration(speedSensor.getTransitionConfigField(selectedState, "minDurationMs") || 500);
        setMinValue(speedSensor.getTransitionConfigField(selectedState, "minValue") || 0);
        setMaxValue(speedSensor.getTransitionConfigField(selectedState, "maxValue") || 10);
    }, [selectedState]);

    // Handlers for updating speedSensor config
    const handleMinDurationChange = (value: string) => {
        const newValue = parseInt(value, 10) || 0;
        setMinDuration(newValue);
        speedSensor.setTransitionConfigField(selectedState, "minDurationMs", newValue);
    };

    const handleMinValueChange = (value: string) => {
        const newValue = parseFloat(value) || 0;
        setMinValue(newValue);
        speedSensor.setTransitionConfigField(selectedState, "minValue", newValue);
    };

    const handleMaxValueChange = (value: string) => {
        const newValue = parseFloat(value) || 0;
        setMaxValue(newValue);
        speedSensor.setTransitionConfigField(selectedState, "maxValue", newValue);
    };

    // Reset function to restore original values
    const handleReset = () => {
        speedSensor.reset();
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>{t("settings.title")}</Text>
                <CustomSelect
                    label="Select Speed State"
                    options={options}
                    selectedIndex={selectedIndex}
                    onSelect={setSelectedIndex}
                />

                {/* Min Duration Configuration */}
                <View style={styles.section}>
                    <Text style={styles.label}>{t("settings.min_duration")}</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={String(minDuration)}
                        onChangeText={handleMinDurationChange}
                    />
                </View>

                {/* Speed Range Configuration */}
                <View style={styles.section}>
                    <Text style={styles.label}>{t("settings.min_speed")}</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={String(minValue)}
                        onChangeText={handleMinValueChange}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>{t("settings.max_speed")}</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={String(maxValue)}
                        onChangeText={handleMaxValueChange}
                    />
                </View>

                {/* Reset Button */}
                <Button title="Reset to Defaults" onPress={handleReset} color="red"/>
            </ScrollView>
        </SafeAreaView>
    );
}

// Styles
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
    });