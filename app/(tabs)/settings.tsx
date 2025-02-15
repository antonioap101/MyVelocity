import React, {useEffect, useState} from "react";
import {Pressable, StyleSheet, Text, TextInput, useColorScheme, View,} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useTranslation} from "react-i18next";
import {Colors} from "@/assets/theme/Colors";
import {IndexPath} from "@ui-kitten/components";
import {CustomSelect, Option} from "@/components/CustomSelect";
import {SpeedStateUtils} from "@/domain/speedStateUtils";
import {SpeedState} from "@/domain/speedState";
import {useSpeedSensor} from "@/hooks/useSpeedSensor";
import RangeAdjuster from "@/components/RangeAdjuster";
import Separator from "@/components/Separator";
import {ThemedView} from "@/components/ThemedView";

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
    const options: Option[] = SpeedStateUtils
        .getValidStates()
        .map((state) => ({
            title: SpeedStateUtils.getName(state),
            accessoryLeft: () => SpeedStateUtils.getIcon(state),
        }));

    // Get the selected SpeedState dynamically
    const selectedState: SpeedState = Object.values(SpeedState)[(selectedIndex as IndexPath).row] as SpeedState;

    // State for the editable fields
    const [minDuration, setMinDuration] = useState(500);
    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(10);

    const [minLimit, setMinLimit] = useState(SpeedStateUtils.MIN_SPEED);
    const [maxLimit, setMaxLimit] = useState(SpeedStateUtils.MAX_SPEED);

    function getPreviousStateMaxValue() {
        const prevState = SpeedStateUtils.getPreviousState(selectedState);
        if (prevState === SpeedState.NONE) return SpeedStateUtils.MIN_SPEED;
        return speedSensor.getTransitionConfigField(prevState, "maxValue") || SpeedStateUtils.MIN_SPEED;
    }

    function getNextStateMinValue() {
        const nextState = SpeedStateUtils.getNextState(selectedState);
        if (nextState === SpeedState.NONE) return SpeedStateUtils.MAX_SPEED;
        return speedSensor.getTransitionConfigField(nextState, "minValue") || SpeedStateUtils.MAX_SPEED;
    }

    function loadSettings() {
        const minDur = speedSensor.getTransitionConfigField(selectedState, "minDurationMs");
        const minVal = speedSensor.getTransitionConfigField(selectedState, "minValue");
        const maxVal = speedSensor.getTransitionConfigField(selectedState, "maxValue");
        const maxLimit = getNextStateMinValue();
        const minLimit = getPreviousStateMaxValue();

        setMinDuration(minDur);
        setMinValue(minVal);
        setMaxValue(maxVal);
        setMinLimit(minLimit);
        setMaxLimit(maxLimit);
    }

    // Load configuration only when selected state changes
    useEffect(() => {
        loadSettings();
    }, [selectedState]);

    // Handlers for updating speedSensor config
    const handleMinDurationChange = (value: string) => {
        const newValue = parseInt(value, 10) || 0;
        if (newValue !== minDuration) {
            setMinDuration(newValue);
            speedSensor.setTransitionConfigField(selectedState, "minDurationMs", newValue);
        }
    };

    function handleValueChanges(newRange: { min: number; max: number }) {
        if (newRange.min !== minValue || newRange.max !== maxValue) {
            setMinValue(newRange.min);
            setMaxValue(newRange.max);
            speedSensor.setTransitionConfigField(selectedState, "minValue", newRange.min);
            speedSensor.setTransitionConfigField(selectedState, "maxValue", newRange.max);
        }
    }


    // Reset function to restore original values
    const handleReset = () => {
        speedSensor.reset()
            .then(r => loadSettings());
    };

    return (
        <SafeAreaView style={styles.container}>
            <ThemedView style={styles.content}>
                <Text style={styles.title}>{t("settings.title")}</Text>
                <CustomSelect
                    label="Select Speed State"
                    options={options}
                    selectedIndex={selectedIndex}
                    onSelect={setSelectedIndex}
                />

                <Separator orientation={"horizontal"}/>
                <View>
                    <Text style={styles.label}>Min Duration (ms)</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={minDuration.toString()}
                        onChangeText={handleMinDurationChange}
                    />
                </View>
                <RangeAdjuster
                    label={`${SpeedStateUtils.getName(selectedState)} Speed Range`}
                    minLimit={minLimit}
                    maxLimit={maxLimit}
                    value={{min: minValue, max: maxValue}}
                    onChange={handleValueChanges}
                />

            </ThemedView>
            {/* Reset Button */}
            <Pressable onPress={handleReset} style={styles.button}>
                <Text style={styles.buttonText}>Reset to Defaults</Text>
            </Pressable>
        </SafeAreaView>
    );
}

// Styles
export const createStyles = (colorScheme: "light" | "dark") =>
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "space-between",
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
        button: {
            backgroundColor: colorScheme === "dark" ? Colors.dark.primary : Colors.light.primary,
            borderRadius: 5,
            alignSelf: "center",
            padding: 10,
            margin: 20
        },
        buttonText: {
            color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
            textAlign: "center",
            fontSize: 16,
        }
    });
