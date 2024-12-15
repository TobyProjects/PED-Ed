import { SquarePlus } from "@/components/icons/SquarePlus";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, TouchableOpacity, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { Id } from "../../../../convex/_generated/dataModel";
import { ChevronRight } from "@/components/icons/ChevronRight";
import filter from "lodash/filter";
import {
  useQuery as useTanstackQuery,
  useMutation as useTanstackMutation,
} from "@tanstack/react-query";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";

export default function () {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const router = useRouter();
  const { user } = useUser();
  const [searchedSets, setSearchedSets] = useState<any[]>([]);

  const countCards = useTanstackMutation({
    mutationKey: ["countCards"],
    mutationFn: useConvexMutation(api.flashcards.getCardCount),
  });

  const usersQuery = useTanstackQuery(
    convexQuery(api.users.getUserByClerkId, {
      clerk_id: user?.id!,
    }),
  );
  const userId = usersQuery.data?._id as Id<"users">;

  const setsQuery = useTanstackQuery(convexQuery(api.sets.getSets, { userId }));
  const sets = setsQuery.data;

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

  useEffect(() => {
    setSearchedSets(sets);
  }, [sets]);

  useEffect(() => {
    const fetchCardCounts = async () => {
      if (sets) {
        const updatedSets = await Promise.all(
          sets.map(async (set) => {
            const cardCount = await countCards.mutateAsync({ setId: set._id });

            return { ...set, cardCount };
          }),
        );
        setSearchedSets(updatedSets);
      }
    };
    fetchCardCounts();
  }, [sets]);

  function onSearch(text: string) {
    if (!text) {
      setSearchedSets(sets);
    } else {
      const filteredSets = filter(sets, (set) =>
        set.name.toLowerCase().includes(text.toLowerCase()),
      );
      setSearchedSets(filteredSets);
    }
  }

  return (
    <ScrollView className="bg-background w-full h-full">
      <View className="w-11/12 mt-12 mx-auto">
        <View className="">
          <Input
            placeholder={t("placeholder.searchFlashcards")}
            onChangeText={onSearch}
          />

          <View className="mt-12">
            {usersQuery.isPending || setsQuery.isPending ? (
              <Text className="text-foreground text-center">Loading...</Text>
            ) : (
              <FlashList
                data={searchedSets}
                renderItem={({ item }) => (
                  <FlashCardSetItem
                    name={item.name}
                    description={item.description}
                    cardCount={item.cardCount}
                    onPress={() => {
                      router.replace(`/(protected)/flashcard/${item._id}`);
                    }}
                  />
                )}
                estimatedItemSize={200}
              />
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

interface FlashCardSet {
  name: string;
  description: string;
  cardCount: number;
  onPress: () => void;
}

const FlashCardSetItem = ({
  name,
  description,
  cardCount,
  onPress,
}: FlashCardSet) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      className="bg-background border border-border rounded-lg p-4 mb-2"
      onPress={onPress}
    >
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-lg font-semibold text-foreground">{name}</Text>
          <Text className="text-sm text-foreground">{description}</Text>
          <Text className="text-sm text-foreground">
            {t("text.cardCount", { number: cardCount })}
          </Text>
        </View>
        <ChevronRight size={24} className="text-foreground" />
      </View>
    </TouchableOpacity>
  );
};
