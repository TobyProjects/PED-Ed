import { View } from "react-native";
import React from "react";
import { Text } from "@/components/ui/text";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "@/components/icons/ImagePlus";
import {
  UpdateFlashcardFormStore,
  useUpdateFlashcardFormStore,
} from "@/hooks/useUpdateFlashcardFormStore";
import * as ImagePicker from "expo-image-picker";
import { Trash2 } from "@/components/icons/Trash2";
import { FileUp } from "@/components/icons/FileUp";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "../../../../convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner-native";

const schema = Yup.object({
  term: Yup.string().required("error.flashcard.termRequired"),
  definition: Yup.string().required("error.flashcard.definitionRequired"),
});

export interface EditFlashcardFormProps {
  id: Id<"flashcards">;
  defaultTerm: string;
  defaultDefinition: string;
}

export default function ({
  defaultTerm,
  defaultDefinition,
  id,
}: EditFlashcardFormProps) {
  const { t } = useTranslation();
  const store = useUpdateFlashcardFormStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const updateFlashcard = useMutation(api.flashcards.updateFlashcard);

  async function onSubmit(data: Yup.InferType<typeof schema>) {
    if (store.image != null) {
      const url = await generateUploadUrl();

      const result = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": store.image.type,
        },
        body: store.image,
      });

      const { storageId } = await result.json();

      await updateFlashcard({
        id: id as Id<"flashcards">,
        image_url: storageId,
        term: data.term,
        definition: data.definition,
      });
    } else {
      await updateFlashcard({
        id: id as Id<"flashcards">,
        term: data.term,
        definition: data.definition,
      });
    }

    store.setImage(null);
    toast.success(t("alert.flashcard.updated"));
  }

  return (
    <View className="flex gap-6">
      <View>
        <Label className="text-muted-foreground font-bold">
          {t("label.term")}
        </Label>
        <Controller
          render={({ field: { onChange, onBlur, value } }) => (
            <Textarea
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={defaultTerm}
            />
          )}
          control={control}
          name="term"
        />
        {errors && errors["term"] && (
          <Label className="text-destructive" nativeID="term">
            {t(errors["term"].message!!)}
          </Label>
        )}
      </View>
      <View>
        <Label className="text-muted-foreground font-bold">
          {t("label.definition")}
        </Label>
        <Controller
          render={({ field: { onChange, onBlur, value } }) => (
            <Textarea
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={defaultDefinition}
            />
          )}
          control={control}
          name="definition"
        />
        {errors && errors["definition"] && (
          <Label className="text-destructive" nativeID="definition">
            {t(errors["definition"].message!!)}
          </Label>
        )}
      </View>
      <View className="flex gap-3">
        <UpdateImageButton store={store} />
        <Button
          className="flex flex-row gap-1"
          onPress={handleSubmit(onSubmit)}
        >
          <FileUp className="text-foreground" />
          <Text>{t("button.updateFlashcard")}</Text>
        </Button>
      </View>
    </View>
  );
}

function UpdateImageButton({ store }: { store: UpdateFlashcardFormStore }) {
  const { t } = useTranslation();

  async function uploadImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      allowsMultipleSelection: false,
      quality: 1,
    });

    if (result.canceled) return;

    const blob = await (await fetch(result.assets[0].uri)).blob();

    store.setImage(blob);
  }

  async function deleteImage() {
    store.setImage(null);
  }

  if (store.image != null)
    return (
      <Button
        className="flex flex-row gap-1"
        onPress={deleteImage}
        variant="destructive"
      >
        <Trash2 className="text-foreground" />
        <Text>{t("button.removeImage")}</Text>
      </Button>
    );

  return (
    <Button className="flex flex-row gap-1" onPress={uploadImage}>
      <ImagePlus className="text-foreground" />
      <Text>{t("button.updateImage")}</Text>
    </Button>
  );
}
