import React from "react";
import { Stack } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { NAV_THEME } from "@/constants/Themes";

export default function () {
  const { colorScheme } = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor:
            colorScheme == "dark"
              ? NAV_THEME.dark.background
              : NAV_THEME.light.background,
        },
      }}
    >
      <Stack.Screen name="download-set" />
    </Stack>
  );
}
