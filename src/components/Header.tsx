import * as React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";

type HeaderWithGoBackProps = {
  left: React.ReactNode;
  title: string;
  right: React.ReactNode;
};

export default function Header({
  left,
  right,
  title,
}: HeaderWithGoBackProps) {
  return (
    <SafeAreaView className="bg-background h-16 border-b border-border">
      <View className="flex flex-row items-center justify-between">
        {left}
        <Text className="text-center font-semibold text-xl">{title}</Text>
        {right}
      </View>
    </SafeAreaView>
  );
}
