import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TextInput, useColorScheme, View} from 'react-native';
import RangeSlider from 'rn-range-slider';
import {Colors} from "@/assets/theme/Colors";

interface RangeAdjusterProps {
    label: string;
    minLimit: number;
    maxLimit: number;
    value: { min: number; max: number };
    onChange: (newRange: { min: number; max: number }) => void;
}

const RangeAdjuster: React.FC<RangeAdjusterProps> = ({ label, minLimit, maxLimit, value, onChange }) => {
    const colorScheme = useColorScheme();
    const [styles, setStyles] = useState(createStyles("light"));

    useEffect(() => {
        if (colorScheme) setStyles(createStyles(colorScheme));
    }, [colorScheme]);


    // Custom slider components
    const Thumb = () => <View style={styles.thumb} />;
    const Rail = () => <View style={styles.rail} />;
    const RailSelected = () => <View style={styles.railSelected} />;
    const Label = ({ text }: any) => <View style={styles.label}><Text>{text}</Text></View>;
    const Notch = () => <View style={styles.notch} />;

    const handleValueChange = (low: number, high: number) => {
        const newRange = { min: low, max: high };
        onChange(newRange);
    }

    const handleInputChange = (field: 'min' | 'max', text: string) => {
        const numericValue = parseFloat(text) || 0;
        const newRange = { ...value, [field]: numericValue };

        // Ensure min < max
        if (newRange.min >= newRange.max) {
            if (field === 'min') newRange.min = newRange.max - 1;
            if (field === 'max') newRange.max = newRange.min + 1;
        }

        onChange(newRange);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.labelText}>{label}</Text>

            <RangeSlider
                min={minLimit}
                max={maxLimit}
                low={value.min}
                high={value.max}
                step={1}
                floatingLabel
                renderThumb={Thumb}
                renderRail={Rail}
                renderRailSelected={RailSelected}
                renderLabel={(value) => <Label text={value} />}
                renderNotch={Notch}
                onValueChanged={handleValueChange}
            />

            <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Min (km/h)</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={value.min.toString()}
                        onChangeText={(text) => handleInputChange('min', text)}
                    />
                </View>

                <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Max (km/h)</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={value.max.toString()}
                        onChangeText={(text) => handleInputChange('max', text)}
                    />
                </View>
            </View>
        </View>
    );
};

const createStyles = (colorScheme: "light" | "dark") =>
    StyleSheet.create({
        container: {
            width: '100%',
        },
        labelText: {
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 10,
            textAlign: 'center',
            color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text,
        },
        inputContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
        },
        inputWrapper: {
            flex: 1,
            alignItems: 'center',
        },
        inputLabel: {
            fontSize: 14,
            marginBottom: 5,
            color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text,
        },
        input: {
            width: '80%',
            borderBottomWidth: 1,
            borderColor: colorScheme === 'dark' ? Colors.dark.border : Colors.light.border,
            color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text,
            paddingVertical: 5,
            textAlign: 'center',
            fontSize: 16,
        },
        thumb: {
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: colorScheme === 'dark' ? Colors.dark.primary : Colors.light.primary,
        },
        rail: {
            flex: 1,
            height: 4,
            borderRadius: 2,
            backgroundColor: '#ccc',
        },
        railSelected: {
            height: 4,
            borderRadius: 2,
            backgroundColor: colorScheme === 'dark' ? Colors.dark.primary : Colors.light.primary,
        },
        label: {
            padding: 5,
            borderRadius: 5,
            backgroundColor: '#eee',
        },
        notch: {
            width: 10,
            height: 10,
            backgroundColor: colorScheme === 'dark' ? Colors.dark.background : Colors.light.background,
            transform: [{ rotate: '45deg' }],
        },
    });

export default RangeAdjuster;
