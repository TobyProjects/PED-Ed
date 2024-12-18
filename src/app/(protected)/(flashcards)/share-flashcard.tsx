import { ScrollView, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import { Text } from "@/components/ui/text";
import { useNavigation, useRouter } from "expo-router";
import { ArrowLeft } from "@/components/icons/ArrowLeft";
import CreateFlashcardForm from "@/features/flashcard/component/CreateFlashcardForm";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "@tanstack/react-query";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { api } from "../../../../convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { Id } from "../../../../convex/_generated/dataModel";
import { FlashList } from "@shopify/flash-list";
import { Share } from "@/components/icons/Share";

const schema = Yup.object({
  term: Yup.string().required("error.flashcard.termRequired"),
  definition: Yup.string().required("error.flashcard.definitionRequired"),
  set: Yup.object({
    value: Yup.string().required("error.flashcard.setRequired"),
    label: Yup.string().required("error.flashcard.setRequired"),
  }),
});

export default function () {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-foreground text-xl font-semibold">
          {t("title.shareAFlashcard")}
        </Text>
      ),
      headerLeft: () => (
        <ArrowLeft
          onPress={() => router.replace("/(protected)/(home)/flashcards")}
          className="text-foreground"
        />
      ),
    });
  }, [navigation]);

  const { user } = useUser();

  const usersQuery = useQuery(
    convexQuery(api.users.getUserByClerkId, {
      clerk_id: user?.id!,
    }),
  );
  const userId = usersQuery.data?._id as Id<"users">;

  const setQuery = useQuery(convexQuery(api.sets.getSets, { userId: userId }));

  const generateShareCode = useMutation({
    mutationFn: useConvexMutation(api.sharecode.createShareCode),
    mutationKey: ["createShareCode"],
  });

  async function onShared(setId: string) {
    const code = await generateShareCode.mutateAsync({ setId });

    router.push({
      pathname: "/(protected)/(flashcards)/view-share-code",
      params: { code },
    });
  }

  return (
    <ScrollView className="w-full h-full bg-background">
      <Text className="text-center text-muted-foreground mt-6 text-xl">
        {t("title.shareAFlashcard.subTitle")}
      </Text>
      <View className="w-11/12 mt-12 mx-auto">
        <FlashList
          data={setQuery.data}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="bg-background border border-border rounded-lg p-4 mb-2"
              onPress={() => onShared(item._id)}
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-lg font-semibold text-foreground">
                    {item.name}
                  </Text>
                  <Text className="text-sm text-foreground">
                    {item.description}
                  </Text>
                </View>
                <Share size={24} className="text-foreground" />
              </View>
            </TouchableOpacity>
          )}
          estimatedItemSize={200}
        />
      </View>
    </ScrollView>
  );
}
