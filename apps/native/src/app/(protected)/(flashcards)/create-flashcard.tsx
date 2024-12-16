import { ScrollView, View } from "react-native";
import React, { useEffect } from "react";
import { Text } from "@/components/ui/text";
import { useNavigation, useRouter } from "expo-router";
import { ArrowLeft } from "@/components/icons/ArrowLeft";
import CreateFlashcardForm from "@/features/flashcard/component/CreateFlashcardForm";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner-native";
import { useFlashcardImageFormStore } from "@/hooks/store";

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
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const createFlashcard = useMutation(api.flashcards.createFlashcard);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const flashcardImageStore = useFlashcardImageFormStore();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-foreground text-xl font-semibold">
          {t("title.createAFlashcard")}
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

  async function onSubmit(data: Yup.InferType<typeof schema>) {
    try {
      if (flashcardImageStore.image != null) {
        const url = await generateUploadUrl();

        const result = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": flashcardImageStore.image.type,
          },
          body: flashcardImageStore.image,
        });

        const { storageId } = await result.json();
        await createFlashcard({
          set_id: data.set.value as Id<"sets">,
          name: data.term,
          term: data.term,
          definition: data.definition,
          image_url: storageId,
        });
      } else {
        await createFlashcard({
          set_id: data.set.value as Id<"sets">,
          name: data.term,
          term: data.term,
          definition: data.definition,
        });
      }

      flashcardImageStore.setImage(null);
      toast.success(t("alert.flashcard.created"));
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <ScrollView className="w-full h-full bg-background">
      <View className="mt-12">
        <CreateFlashcardForm
          control={control as any}
          errors={errors as any[]}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
        />
      </View>
    </ScrollView>
  );
}
