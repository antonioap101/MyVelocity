import {SplashScreen, Stack} from "expo-router";
import React, {useEffect} from "react";
import {useFonts} from "expo-font";
import {useColorScheme} from "react-native";
import '@/i18n'; // This line imports the i18n configuration
import {DarkTheme, DefaultTheme, ThemeProvider} from "@react-navigation/native";
import {ApplicationProvider} from "@ui-kitten/components";
import * as eva from '@eva-design/eva';
import {ErrorWarningProvider} from "@/hooks/errors/useErrors";
import {ErrorWarningPopup} from "@/components/ErrorWarningPopup";
import {StatusBar} from "expo-status-bar";

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    // console.warn("Eva Light Theme: ", eva.light);
    // console.warn("Eva Dark Theme: ", eva.dark);

    return (
        <ApplicationProvider {...eva} theme={colorScheme === 'dark' ? eva.dark : eva.light}>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <ErrorWarningProvider>
                    <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'}/>
                    <ErrorWarningPopup />
                    <Stack screenOptions={{headerShown: false}}>
                        <Stack.Screen name="(tabs)" options={{
                            title: 'MyVelocity',
                            headerShown: false
                        }}/>
                        <Stack.Screen name="+not-found"/>
                    </Stack>
                </ErrorWarningProvider>
            </ThemeProvider>
        </ApplicationProvider>
    );


}
