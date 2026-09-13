import { ReadingsProvider } from "@/context/ReadingsContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { initialiseDatabase } from "@/db/database";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const [dbInitialised, setDbInitialised] = useState(false);

  useEffect(() => {
    async function setupDatabase() {
      await initialiseDatabase();
      setDbInitialised(true);
    }
    setupDatabase();
  }, []);

  if (!dbInitialised) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#17191F" }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <ReadingsProvider>
          <SettingsProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: {
                  backgroundColor: "#17191F",
                },
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="add_modal"
                options={{ presentation: "modal" }}
              />
              <Stack.Screen
                name="chart_detail"
                options={{ presentation: "fullScreenModal" }}
              />
            </Stack>
          </SettingsProvider>
        </ReadingsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
