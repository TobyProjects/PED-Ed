import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView className="bg-background h-screen">
      <View>
        <Text>Profile</Text>
      </View>
    </SafeAreaView>
  );
}
