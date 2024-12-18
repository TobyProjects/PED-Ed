import { FolderDown } from "@/components/icons/FolderDown";
import { SquarePlus } from "@/components/icons/SquarePlus";
import { Text } from "@/components/ui/text";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView } from "react-native";

export default function () {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-foreground text-xl font-semibold">
          {t("tab.gallery")}
        </Text>
      ),
      headerRight: () => (
        <Pressable
          className="p-3"
          onPress={() => router.replace("/(protected)/gallery/download-set")}
        >
          <FolderDown className="text-primary" />
        </Pressable>
      ),
    });
  }, [navigation]);
  return (
    <ScrollView className="bg-background w-full h-full">
      <Text>Profile</Text>
    </ScrollView>
  );
}
