import React from 'react';
import {StyleSheet} from 'react-native';
import {IconElement, IndexPath, Layout, Select, SelectItem} from '@ui-kitten/components';


export interface Option {
    title: string;
    accessoryLeft?: (props: any) => IconElement;
    accessoryRight?: (props: any) => IconElement;
}

interface CustomSelectProps {
    label?: string;
    caption?: string;
    options: Option[];
    selectedIndex: IndexPath | IndexPath[];
    onSelect: (index: IndexPath | IndexPath[]) => void;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
                                                              label,
                                                              caption,
                                                              options,
                                                              selectedIndex,
                                                              onSelect,
                                                          }) => {
    // Ensure selectedIndex is valid
    const selectedRow = (selectedIndex as IndexPath)?.row ?? 0;
    const selectedValue = options[selectedRow]?.title || "Select an option";

    return (
        <Layout style={styles.container} level="1">
            <Select
                label={label}
                caption={caption}
                selectedIndex={selectedIndex}
                onSelect={onSelect}
                value={selectedValue} // Safe assignment
            >
                {options.map((option, index) => (
                    <SelectItem
                        key={index}
                        title={option.title}
                        accessoryLeft={option.accessoryLeft}
                        accessoryRight={option.accessoryRight}
                    />
                ))}
            </Select>
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
    },
});
