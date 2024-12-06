import { View, Text, ScrollView } from "react-native";
import React, { useEffect } from "react";
import { useNavigation, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "@/components/icons/ArrowLeft";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Button } from "@/components/ui/button";

type ColorScheme = "light" | "dark";

export default function Appearance() {
  const navigation = useNavigation();
  const router = useRouter();
  const { t } = useTranslation();
  const { toggleColorScheme } = useColorScheme();

  function toggleDarkMode() {
    toggleColorScheme();
    console.log("Done");
  }

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-foreground text-xl font-semibold">
          {t("page.settings.appearance.title")}
        </Text>
      ),
      headerLeft: () => (
        <ArrowLeft
          onPress={() => router.replace("/(protected)/(home)/profile")}
          className="text-foreground"
        />
      ),
      headerStyle: {
        backgroundColor: "transparent",
      },
    });
  }, [navigation]);

  return (
    <ScrollView className="bg-background">
      <Text className="text-foreground">Dark mode</Text>
      <Button onPress={() => toggleDarkMode()}>
        <Text>On/Off</Text>
      </Button>
    </ScrollView>
  );
}
