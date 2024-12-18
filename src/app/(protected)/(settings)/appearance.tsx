import { View, Text, ScrollView } from "react-native";
import React, { useEffect } from "react";
import { useNavigation, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "@/components/icons/ArrowLeft";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Button } from "@/components/ui/button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SunMoon } from "@/components/icons/SunMoon";
import HeaderWithGoBack from "@/components/HeaderWithGoBack";
import { NAV_THEME } from "@/constants/Themes";

export default function Appearance() {
  const navigation = useNavigation();
  const router = useRouter();
  const { t } = useTranslation();
  const { toggleColorScheme, colorScheme } = useColorScheme();

  function toggleDarkMode() {
    AsyncStorage.setItem("theme", colorScheme === "dark" ? "light" : "dark");
    toggleColorScheme();
  }

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-foreground text-xl font-semibold">
          {t("title.appearance")}
        </Text>
      ),
      headerLeft: () => (
        <ArrowLeft
          onPress={() => router.replace("/(protected)/(settings)")}
          className="text-foreground"
        />
      ),
      headerStyle: {
        backgroundColor:
          colorScheme == "dark"
            ? NAV_THEME.dark.background
            : NAV_THEME.light.background,
      },
    });
  }, [navigation]);

  return (
    <ScrollView className="bg-background">
      <View className="w-11/12 mx-auto mt-6">
        <Text className="text-foreground text-lg font-semibold">Dark mode</Text>
        <Button
          onPress={() => toggleDarkMode()}
          className="flex flex-row gap-1"
        >
          <Text>
            <SunMoon className="text-foreground" />
          </Text>
          <Text className="text-foreground">
            Change to {colorScheme == "dark" ? "light mode" : "dark mode"}
          </Text>
        </Button>
      </View>
    </ScrollView>
  );
}
