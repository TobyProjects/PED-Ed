import React from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function () {
  return (
    <GestureHandlerRootView>
      <Stack />
    </GestureHandlerRootView>
  );
}
