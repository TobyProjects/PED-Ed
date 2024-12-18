import { View, ScrollView } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  router,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import { ArrowLeft } from "@/components/icons/ArrowLeft";
import { Repeat2 } from "@/components/icons/Repeat2";
import { Text } from "@/components/ui/text";
import { useQuery } from "@tanstack/react-query";
import { convexQuery, useConvexQuery } from "@convex-dev/react-query";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronsUp } from "@/components/icons/ChevronsUp";
import { ChevronsDown } from "@/components/icons/ChevronsDown";
import { Settings2 } from "@/components/icons/Settings2";
import { Pencil } from "@/components/icons/Pencil";

export default function () {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const navigation = useNavigation();

  const setQuery = useQuery(
    convexQuery(api.sets.getSetById, { setId: id as Id<"sets"> }),
  );
  const flashcardQuery = useQuery(
    convexQuery(api.flashcards.getFlashcards, {
      setId: id as Id<"sets">,
    }),
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-foreground text-xl font-semibold">
          {t("title.edit", { name: setQuery.data?.name })}
        </Text>
      ),
      headerLeft: () => (
        <ArrowLeft
          onPress={() => router.replace(`/(protected)/flashcard/${id}`)}
          className="text-foreground"
        />
      ),
    });
  }, [navigation, setQuery]);

  return (
    <View className="bg-background w-full h-full">
      <View className="w-11/12 mx-auto flex gap-6 mt-12">
        {flashcardQuery.data?.map(({ term, definition, _id }, i) => (
          <Flashcard id={_id} term={term} definition={definition} key={i} />
        ))}
      </View>
    </View>
  );
}

interface CardProps {
  id: Id<"flashcards">;
  term: string;
  definition: string;
}

function Flashcard({ term, definition, id }: CardProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{term}</CardTitle>
        <CardDescription>{definition}</CardDescription>
      </CardHeader>
      <CardFooter className="gap-3 p-3">
        <Button
          className="flex flex-row gap-1 bg-green-700"
          onPress={() =>
            router.push(`/(protected)/flashcard/edit/flashcard?id=${id}`)
          }
        >
          <Pencil className="text-foreground" />
          <Text className="text-foreground">{t("button.edit")}</Text>
        </Button>
      </CardFooter>
    </Card>
  );
}
