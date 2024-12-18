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
      <Stack.Screen name="create-flashcard" />
      <Stack.Screen name="create-set" options={{ presentation: "modal" }} />
      <Stack.Screen name="share-flashcard" />
      <Stack.Screen
        name="view-share-code"
        options={{ presentation: "modal" }}
      />
    </Stack>
  );
}
