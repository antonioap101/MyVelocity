import {Tabs} from 'expo-router';
import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCog, faHome} from '@fortawesome/free-solid-svg-icons';
import {StyleSheet} from 'react-native';
import {Colors} from "@/assets/theme/Colors";
import {useColorScheme} from "@/hooks/theme/useColorScheme";
import GradientFallback from "@/components/GradientFallback";


export default function TabLayout() {
    const colorScheme = useColorScheme();
    const styles = StyleSheet.create({
        tabBarStyle: {
            paddingBottom: 50, // Space for icons
            paddingTop: 10,
            backgroundColor: colorScheme === 'dark' ? Colors.dark.background : Colors.light.background,
            borderColor: 'transparent', // Remove border on iOS
            elevation: 0, // Remove shadow on Android
            borderWidth: 0, // Remove border on Android
            shadowOpacity: 0.1, // Remove any iOS shadow
            shadowOffset: { width: 0, height: -4 },
            shadowRadius: 6,
        },
        gradientBackground: {
            ...StyleSheet.absoluteFillObject,
        },
    });

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].text,
                headerShown: false,
                tabBarStyle: styles.tabBarStyle,
                tabBarShowLabel: false,
                tabBarBackground: () => <GradientFallback/>,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({color}) => <FontAwesomeIcon icon={faHome} size={24} color={color}/>,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({color}) => <FontAwesomeIcon icon={faCog} size={24} color={color}/>,
                }}
            />
        </Tabs>
    );
}

