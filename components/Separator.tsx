import React, { useEffect, useState } from 'react';
import { View, StyleSheet, useColorScheme, Dimensions } from 'react-native';
import { Colors } from '@/assets/theme/Colors';

interface SeparatorProps {
    orientation: 'horizontal' | 'vertical';
}

const Separator: React.FC<SeparatorProps> = ({ orientation }) => {
    const colorScheme = useColorScheme();
    const [styles, setStyles] = useState(createStyles('light'));

    useEffect(() => {
        if (colorScheme) setStyles(createStyles(colorScheme));
    }, [colorScheme]);

    const isHorizontal = orientation === 'horizontal';
    const screenDimension = isHorizontal ? Dimensions.get('window').width : Dimensions.get('window').height;
    const length = screenDimension * 0.9;

    return (
        <View
            style={[
                styles.separator,
                isHorizontal ? { width: length, height: 2 } : { height: length, width: 2 },
            ]}
        />
    );
};

const createStyles = (colorScheme: 'light' | 'dark') =>
    StyleSheet.create({
        separator: {
            backgroundColor: colorScheme === 'dark' ? Colors.dark.border : Colors.light.border,
            alignSelf: 'center',
            marginVertical: 20,
        },
    });

export default Separator;
