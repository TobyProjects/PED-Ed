import { SquarePlus } from "@/components/icons/SquarePlus";
import { Text } from "@/components/ui/text";
import CircularClock from "@/features/pomodoro/components/CircularClock";
import { useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, View } from "react-native";

export default function () {
  const { t } = useTranslation();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-foreground text-xl font-semibold">
          {t("tab.pomodoro")}
        </Text>
      ),
    });
  }, [navigation]);
  return (
    <View className="bg-background w-full h-full">
      <View className="flex justify-center items-center w-full h-full">
        <CircularClock />
      </View>
    </View>
  );
}
