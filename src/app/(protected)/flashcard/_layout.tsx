import React from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme } from "@/hooks/useColorScheme";
import { NAV_THEME } from "@/constants/Themes";

export default function () {
  const { colorScheme } = useColorScheme();

  return (
    <GestureHandlerRootView>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor:
              colorScheme == "dark"
                ? NAV_THEME.dark.background
                : NAV_THEME.light.background,
          },
        }}
      />
    </GestureHandlerRootView>
  );
}
