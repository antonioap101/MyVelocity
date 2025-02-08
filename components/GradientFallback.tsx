import React from 'react';
import {StyleSheet, useColorScheme} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Colors} from "@/assets/theme/Colors";

const GradientFallback = () => {
    const colorScheme = useColorScheme();
    return (

        <LinearGradient
            colors={
                colorScheme === 'dark'
                    ? [Colors.dark.background, '#838383'] // Darker gradient
                    : [Colors.light.background, '#2d2d2d'] // Lighter gradient
            }
            start={{x: 0.5, y: 0}}
            end={{x: 0.5, y: 1}}
            style={styles.background}
        />

    );
}

const styles = StyleSheet.create({

    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 150,
    },
});

export default GradientFallback;
