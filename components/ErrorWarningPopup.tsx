// Popup component
import React from "react";
import {Modal, Pressable, StyleSheet, Text, useColorScheme, View} from "react-native";
import {Colors} from "@/assets/theme/Colors";
import {useErrorsAndWarnings} from "@/hooks/errors/useErrors";

export const ErrorWarningPopup: React.FC = () => {
    const {message, visible, hideError} = useErrorsAndWarnings();
    const colorScheme = useColorScheme();
    const styles = createStyles(colorScheme === 'dark' ? 'dark' : 'light');

    if (!visible) return null;

    return (
        <Modal transparent animationType="slide" visible={visible}>
            <View style={styles.overlay}>
                <View style={styles.popup}>
                    <Text style={styles.text}>{message}</Text>
                    <Pressable style={styles.button} onPress={hideError}>
                        <Text style={styles.buttonText}>OK</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};
// Styles for the popup
const createStyles = (mode: 'light' | 'dark') =>
    StyleSheet.create({
        overlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
        },
        popup: {
            width: '80%',
            padding: 20,
            borderRadius: 10,
            backgroundColor: mode === 'dark' ? Colors.dark.background : Colors.light.background,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
        },
        text: {
            fontSize: 18,
            color: mode === 'dark' ? Colors.dark.text : Colors.light.text,
            marginBottom: 20,
            textAlign: 'center',
        },
        button: {
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
            backgroundColor: mode === 'dark' ? Colors.dark.primary : Colors.light.primary,
        },
        buttonText: {
            color: mode === 'dark' ? Colors.dark.text : Colors.light.text,
            fontSize: 16,
            fontWeight: 'bold',
        },
    });