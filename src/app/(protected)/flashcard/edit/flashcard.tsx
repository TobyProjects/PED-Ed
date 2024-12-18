import { ActivityIndicator, ScrollView, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { ArrowLeft } from "@/components/icons/ArrowLeft";
import { Text } from "@/components/ui/text";
import EditFlashcardForm from "@/features/flashcard/component/EditFlashcardForm";

export default function () {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const navigation = useNavigation();

  const flashcardQuery = useQuery(
    convexQuery(api.flashcards.getFlashcardById, {
      id: id as Id<"flashcards">,
    }),
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-foreground text-xl font-semibold">
          {t("title.edit", { name: flashcardQuery.data?.name })}
        </Text>
      ),
      headerLeft: () => (
        <ArrowLeft onPress={() => router.back()} className="text-foreground" />
      ),
    });
  }, [navigation, flashcardQuery]);

  return (
    <ScrollView className="bg-background">
      <View className="w-11/12 mx-auto mt-12">
        {flashcardQuery.isPending ? (
          <ActivityIndicator />
        ) : (
          <EditFlashcardForm
            defaultTerm={flashcardQuery.data?.term!}
            defaultDefinition={flashcardQuery.data?.definition!}
            id={id as Id<"flashcards">}
          />
        )}
      </View>
    </ScrollView>
  );
}
