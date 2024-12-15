import { Dimensions, ScrollView, View } from "react-native";
import React, { useEffect } from "react";
import { Text } from "@/components/ui/text";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "@/hooks/useColorScheme";
import { NAV_THEME } from "@/constants/Themes";
import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import FlashcardCarousel from "@/features/flashcard/component/FlashcardCarousel";

export default function () {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const navigation = useNavigation();
  const router = useRouter();

  const set = useQuery(api.sets.getSetById, { setId: id as Id<"sets"> });
  const flashcards = useQuery(api.flashcards.getFlashcards, {
    setId: id as Id<"sets">,
  });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-foreground text-xl font-semibold">
          {set?.name}
        </Text>
      ),
      headerLeft: () => (
        <ArrowLeft
          onPress={() => router.replace("/(protected)/(home)/flashcards")}
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
  }, [navigation, set]);

  const flashCardHeight = Dimensions.get("window").height * 0.8;

  return (
    <ScrollView className="bg-background w-full h-full">
      <View
        style={{
          width: "83.33%",
          height: flashCardHeight,
          marginHorizontal: "auto",
          marginTop: 48,
        }}
      >
        <FlashcardCarousel flashcards={flashcards} />
      </View>
    </ScrollView>
  );
}
