import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { AppProvider } from "@/contexts/AppContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  return (
    <GestureHandlerRootView>
      <AppProvider>
        <StatusBar hidden />
          <Stack screenOptions={{ headerShown: false }} initialRouteName="(tabs)">
            <Stack.Screen name="sectionOrder" options={{animation: "slide_from_right"}} />
          </Stack>
      </AppProvider>
    </GestureHandlerRootView>
  );
}