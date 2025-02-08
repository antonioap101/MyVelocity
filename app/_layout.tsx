import {SplashScreen, Stack} from "expo-router";
import {useEffect} from "react";
import {useFonts} from "expo-font";
import {useColorScheme} from "react-native";
import '@/i18n'; // This line imports the i18n configuration
import {DarkTheme, DefaultTheme, ThemeProvider} from "@react-navigation/native";

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

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{headerShown: false}}>
                <Stack.Screen name="(tabs)" options={{
                    title: 'MyVelocity',
                    headerShown: false
                }}/>
                <Stack.Screen name="+not-found"/>
            </Stack>
        </ThemeProvider>
    );


}
