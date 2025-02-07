import {Stack} from "expo-router";

export default function RootLayout() {
    return <Stack
        screenOptions={{
            title: 'MyVelocity',
            headerShown: false
        }}

    />;
}
