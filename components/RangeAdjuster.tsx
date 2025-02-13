import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import RangeSlider from 'rn-range-slider';

// Custom components for slider visuals
const Thumb = () => <View style={styles.thumb} />;
const Rail = () => <View style={styles.rail} />;
const RailSelected = () => <View style={styles.railSelected} />;
const Label = ({ text }: any) => <View style={styles.label}><Text>{text}</Text></View>;
const Notch = () => <View style={styles.notch} />;

interface RangeAdjusterProps {
    label: string;
    minLimit: number;
    maxLimit: number;
    value: { min: number; max: number };
    onChange: (newRange: { min: number; max: number }) => void;
}

const RangeAdjuster: React.FC<RangeAdjusterProps> = ({ label, minLimit, maxLimit, value, onChange }) => {
    const [range, setRange] = useState(value);

    const handleValueChange = useCallback((low: number, high: number) => {
        const newRange = { min: low, max: high };
        setRange(newRange);
        onChange(newRange);
    }, [onChange]);

    const handleInputChange = (field: 'min' | 'max', text: string) => {
        const numericValue = parseFloat(text) || 0;
        const newRange = { ...range, [field]: numericValue };

        if (newRange.min >= newRange.max) {
            if (field === 'min') newRange.min = newRange.max - 1;
            if (field === 'max') newRange.max = newRange.min + 1;
        }

        setRange(newRange);
        onChange(newRange);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.labelText}>{label}</Text>

            <RangeSlider
                min={minLimit}
                max={maxLimit}
                low={range.min}
                high={range.max}
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
                    <Text style={styles.inputLabel}>Min</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={range.min.toString()}
                        onChangeText={(text) => handleInputChange('min', text)}
                    />
                </View>

                <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Max</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={range.max.toString()}
                        onChangeText={(text) => handleInputChange('max', text)}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        width: '100%',
    },
    labelText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
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
    },
    input: {
        width: '80%',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 5,
        textAlign: 'center',
        fontSize: 16,
    },
    thumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'blue',
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
        backgroundColor: 'blue',
    },
    label: {
        padding: 5,
        borderRadius: 5,
        backgroundColor: '#eee',
    },
    notch: {
        width: 10,
        height: 10,
        backgroundColor: 'blue',
        transform: [{ rotate: '45deg' }],
    },
});

export default RangeAdjuster;