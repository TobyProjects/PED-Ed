import { View, Text, ScrollView } from "react-native";
import React, { useEffect } from "react";
import ClockConfigForm from "@/features/pomodoro/components/ClockConfigForm";
import { useNavigation, useRouter } from "expo-router";
import { ArrowLeft } from "@/components/icons/ArrowLeft";
import { useTranslation } from "react-i18next";
import { usePomodoroStore } from "@/hooks/usePomodoroStore";

export default function () {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const router = useRouter();
  const store = usePomodoroStore();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-foreground text-xl font-semibold">
          {t("title.pomodoroClockSettings")}
        </Text>
      ),
      headerLeft: () => (
        <ArrowLeft
          onPress={() => router.replace("/(protected)/(home)/pomodoro")}
          className="text-foreground"
        />
      ),
    });
  }, [navigation]);

  return (
    <ScrollView className="bg-background w-full h-full">
      <View className="w-11/12 mx-auto mt-12">
        <ClockConfigForm store={store} />
      </View>
    </ScrollView>
  );
}
