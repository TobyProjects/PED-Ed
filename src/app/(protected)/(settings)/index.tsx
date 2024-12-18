import { ScrollView, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import { Link, useNavigation, useRouter } from "expo-router";
import { Text } from "@/components/ui/text";
import { ArrowLeft } from "@/components/icons/ArrowLeft";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "@/components/icons/ChevronRight";
import { LucideIcon } from "lucide-react-native";
import { User } from "@/components/icons/User";
import { Shield } from "@/components/icons/Shield";
import { Palette } from "@/components/icons/Palette";
import { Globe } from "@/components/icons/Globe";
import { Bell } from "@/components/icons/Bell";
import { useColorScheme } from "@/hooks/useColorScheme";
import { NAV_THEME } from "@/constants/Themes";

interface SettingItem {
  id: string;
  name: string;
  icon: LucideIcon;
}

const accountSettings: SettingItem[] = [
  { id: "account", name: "Account", icon: User },
];

const appSettings: SettingItem[] = [
  { id: "appearance", name: "Appearance", icon: Palette },
  { id: "language", name: "Language", icon: Globe },
  { id: "notification", name: "Notification", icon: Bell },
];

export default function Settings() {
  const navigation = useNavigation();
  const router = useRouter();
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-foreground text-xl font-semibold">
          {t("title.settings")}
        </Text>
      ),
      headerLeft: () => (
        <ArrowLeft
          onPress={() => router.replace("/(protected)/(home)/profile")}
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
      <View className="w-11/12 max-w-3xl mx-auto py-8 flex gap-8">
        <View>
          <Text className="font-semibold mb-2">Account Settings</Text>
          <View className="bg-background border border-border shadow-md rounded-lg overflow-hidden">
            {accountSettings.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                onPress={() =>
                  router.push(`/(protected)/(settings)/${item.id}`)
                }
                className={`flex-row items-center p-4 ${
                  index !== accountSettings.length - 1
                    ? "border-b border-border"
                    : ""
                }`}
              >
                <View className="flex-row items-center flex-1">
                  <item.icon className="text-foreground" size={24} />
                  <Text className="ml-4 font-medium text-foreground">
                    {item.name}
                  </Text>
                </View>
                <ChevronRight className="text-foreground" size={24} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View>
          <Text className="font-semibold mb-2">App Settings</Text>
          <View className="bg-background border border-border shadow-md rounded-lg overflow-hidden">
            {appSettings.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                onPress={() =>
                  router.push(`/(protected)/(settings)/${item.id}`)
                }
                className={`flex-row items-center p-4 ${
                  index !== appSettings.length - 1
                    ? "border-b border-border"
                    : ""
                }`}
              >
                <View className="flex-row items-center flex-1">
                  <item.icon className="text-foreground" size={24} />
                  <Text className="ml-4 font-medium text-foreground">
                    {item.name}
                  </Text>
                </View>
                <ChevronRight className="text-foreground" size={24} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
