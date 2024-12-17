import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { Text } from "@/components/ui/text";
import { useTranslation } from "react-i18next";
import DownloadSetForm from "@/features/set/components/DownloadSetForm";
import { useNavigation, useRouter } from "expo-router";
import { ArrowLeft } from "@/components/icons/ArrowLeft";

export default function () {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-foreground text-xl font-semibold">
          {t("title.downloadASet")}
        </Text>
      ),
      headerLeft: () => (
        <ArrowLeft
          onPress={() => router.replace("/(protected)/(home)/gallery")}
          className="text-foreground"
        />
      ),
    });
  }, [navigation]);

  return (
    <View className="bg-background w-full h-full">
      <TouchableWithoutFeedback
        className="bg-background w-full h-full"
        onPress={Keyboard.dismiss}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
        >
          <View className="w-full h-full flex items-center justify-center">
            <View className="w-11/12">
              <DownloadSetForm />
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
}
