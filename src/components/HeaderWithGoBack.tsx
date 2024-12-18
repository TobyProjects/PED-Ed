import * as React from "react";
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

type HeaderWithGoBackProps = {
  icon: React.ReactNode;
  title: string;
};

export default function HeaderWithGoBack({
  icon,
  title,
}: HeaderWithGoBackProps) {
  const router = useRouter();

  function goBack() {
    router.back();
  }

  return (
    <SafeAreaView className="bg-background h-16 border-b border-border">
      <View className="flex flex-row items-center justify-between">
        <Pressable className="p-1" onPress={() => goBack()}>
          {icon}
        </Pressable>
        <Text className="text-center font-semibold text-xl">{title}</Text>
        <View></View>
      </View>
    </SafeAreaView>
  );
}
