import {
  View,
  Text,
  SafeAreaView,
  TouchableNativeFeedback,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import { useNavigation, useRouter } from "expo-router";
import { ChevronRight } from "@/components/icons/ChevronRight";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "@/components/icons/ArrowLeft";
import { NAV_THEME } from "@/constants/Themes";
import { toast } from "sonner-native";
import { useUser } from "@clerk/clerk-expo";

const accountInformation = [{ id: "username", name: "label.username" }];

const security = [{ id: "password", name: "Password" }];

export default function () {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const {user} = useUser();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-foreground text-xl font-semibold">
          {t("title.account")}
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

  async function deleteAccount() {
    try {
      await user?.delete()
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <ScrollView className="w-full h-full bg-background">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="w-11/12 h-full mx-auto mt-12 flex gap-8">
          <View>
            <Text className="font-semibold mb-2 text-foreground">
              {t("label.accountInformation")}
            </Text>
            <View className="bg-background border border-border shadow-md rounded-lg overflow-hidden">
              {accountInformation.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() =>
                    router.push(`/(protected)/(settings)/change/${item.id}`)
                  }
                  className={`flex-row items-center p-4 ${
                    index !== accountInformation.length - 1
                      ? "border-b border-border"
                      : ""
                  }`}
                >
                  <View className="flex-row items-center flex-1">
                    <Text className="ml-4 font-medium text-foreground">
                      {t(item.name)}
                    </Text>
                  </View>
                  <ChevronRight className="text-foreground" size={24} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View>
            <Text className="font-semibold mb-2 text-foreground">{t("label.security")}</Text>
            <View className="bg-background border border-border shadow-md rounded-lg overflow-hidden">
              {security.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() =>
                    router.push(`/(protected)/(settings)/change/${item.id}`)
                  }
                  className={`flex-row items-center p-4 ${
                    index !== security.length - 1
                      ? "border-b border-border"
                      : ""
                  }`}
                >
                  <View className="flex-row items-center flex-1">
                    <Text className="ml-4 font-medium text-foreground">
                      {t(item.name)}
                    </Text>
                  </View>
                  <ChevronRight className="text-foreground" size={24} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View>
            <Text className="font-semibold mb-2 text-foreground">
              {t("label.accountManagement")}
            </Text>
            <View className="bg-background border border-destructive/80 shadow-md rounded-lg overflow-hidden">
              <TouchableOpacity
                onPress={() => deleteAccount()}
                className={`flex-row items-center p-4`}
              >
                <View className="flex-row items-center flex-1">
                  <Text className="ml-4 font-medium text-destructive">
                    {t("button.deleteMyAccount")}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}
