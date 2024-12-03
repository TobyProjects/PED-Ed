import { Image, ImageBackground, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";

import bg1 from "@/assets/images/backgrounds/bg1.png";
import logo from "@/assets/images/llvm.png";
import { Redirect, router, useNavigation } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/components/AuthProvider";

export default function HomePage() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  if (isAuthenticated) {
    return <Redirect href="/(protected)" />;
  }

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
              {t("welcome-text")}
            </Text>
            <Text className="text-white text-center text-7xl font-bold font-uniSansHeavy">
              {t("app-name")}
            </Text>
            <Text className="text-white text-center text-2xl">
              {t("slogan")}
            </Text>
          </View>
          <View className="w-full mb-8 flex gap-3">
            <Button
              className="w-full bg-white rounded-full"
              onPress={() => router.push("/signup")}
            >
              <Text className="text-gray-900">{t("form.register.button")}</Text>
            </Button>
            <Button
              className="w-full bg-primary rounded-full"
              onPress={() => router.push("/signin")}
            >
              <Text className="text-white">{t("form.login.button")}</Text>
            </Button>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
