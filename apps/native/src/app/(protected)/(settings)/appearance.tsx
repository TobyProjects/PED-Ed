import { View, Text, ScrollView } from "react-native";
import React, { useEffect } from "react";
import { useNavigation, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "@/components/icons/ArrowLeft";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useColorScheme } from "@/hooks/useColorScheme";

type ColorScheme = "light" | "dark";

export default function Appearance() {
  const navigation = useNavigation();
  const router = useRouter();
  const { t } = useTranslation();
  const { setColorScheme, colorScheme } = useColorScheme();

  const [theme, setTheme] = React.useState<ColorScheme>(colorScheme);

  function onLabelPress(scheme: ColorScheme) {
    return () => {
      setTheme(scheme);
      setColorScheme(scheme);
      console.log(scheme);
    };
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
      <Text>Appearance</Text>
      <RadioGroup value={theme} onValueChange={setTheme} className="gap-3">
        <RadioGroupItemWithLabel
          value="Light"
          onLabelPress={onLabelPress("light")}
        />
        <RadioGroupItemWithLabel
          value="Dark"
          onLabelPress={onLabelPress("dark")}
        />
      </RadioGroup>
    </ScrollView>
  );
}

function RadioGroupItemWithLabel({
  value,
  onLabelPress,
}: {
  value: string;
  onLabelPress: () => void;
}) {
  return (
    <View className={"flex-row gap-2 items-center"}>
      <RadioGroupItem aria-labelledby={`label-for-${value}`} value={value} />
      <Label nativeID={`label-for-${value}`} onPress={onLabelPress}>
        {value}
      </Label>
    </View>
  );
}
