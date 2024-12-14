import { Folder } from "@/components/icons/Folder";
import { SquarePlus } from "@/components/icons/SquarePlus";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, View } from "react-native";

export default function () {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-foreground text-xl font-semibold">
          {t("tab.flashcards")}
        </Text>
      ),
      headerRight: () => (
        <Pressable
          className="p-3"
          onPress={() =>
            router.push("/(protected)/(flashcards)/create-flashcard")
          }
        >
          <SquarePlus className="text-primary" />
        </Pressable>
      ),
    });
  }, [navigation]);

  return (
    <ScrollView className="bg-background w-full h-full">
      <View className="w-11/12 mt-12 mx-auto">
        <View className="">
          <Input />

          <View className="flex flex-wrap -mx-2">
           
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
