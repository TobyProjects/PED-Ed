import { View, ImageBackground, Image } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";

import bg1 from "@/assets/images/backgrounds/bg1.png";
import logo from "@/assets/images/llvm.png";
import { useTranslation } from "react-i18next";
import { useNavigation, useRouter } from "expo-router";

export default function WelcomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View className="flex-1">
      <ImageBackground
        source={bg1}
        className="flex-1"
        resizeMode="cover"
        blurRadius={20}
      >
        <SafeAreaView className="flex-1 w-10/12 mx-auto items-center justify-between">
          <View></View>
          <View>
            <Image source={logo} className="w-96 h-64 mx-auto my-3" />
            <Text className="text-white text-center text-7xl font-bold font-uniSansHeavy">
              {t("app.welcome")}
            </Text>
            <Text className="text-white text-center text-7xl font-bold font-uniSansHeavy">
              {t("app.name")}
            </Text>
            <Text className="text-white text-center text-2xl">
              {t("app.slogan")}
            </Text>
          </View>
          <View className="w-full mb-8 flex gap-3">
            <Button
              className="w-full bg-white rounded-full"
              onPress={() => router.push("/(public)/sign-up")}
            >
              <Text className="text-gray-900">{t("button.signUp")}</Text>
            </Button>
            <Button
              className="w-full bg-primary rounded-full"
              onPress={() => router.push("/(public)/sign-in")}
            >
              <Text className="text-white">{t("button.signIn")}</Text>
            </Button>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
