import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Text } from "@/components/ui/text";
import { useTranslation } from "react-i18next";

export default function () {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { code } = useLocalSearchParams<{ code: string }>();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View className="bg-background w-full h-full border border-border rounded-lg">
      <View className="flex justify-center items-center h-full">
        <Text className="my-8 text-xl font-bold text-muted-foreground">
          {t("text.shareCodeAttention")}
        </Text>
        <Text className="text-foreground text-5xl font-light">{code}</Text>
      </View>
    </View>
  );
}
