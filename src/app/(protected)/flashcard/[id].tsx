import { Dimensions, ScrollView, View } from "react-native";
import React, { useEffect } from "react";
import { Text } from "@/components/ui/text";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import FlashcardCarousel from "@/features/flashcard/component/FlashcardCarousel";
import { Pencil } from "@/components/icons/Pencil";

export default function () {
  const { id } = useLocalSearchParams<{ id: string }>();
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
      headerRight: () => (
        <Pencil
          onPress={() => router.replace(`/(protected)/flashcard/edit/${id}`)}
          className="text-foreground"
        />
      ),
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
