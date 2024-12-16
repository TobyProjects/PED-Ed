import { View, Text } from "react-native";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Control,
  Controller,
  FieldErrors,
  set,
  UseFormHandleSubmit,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";
import { Link } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { ImageUp } from "@/components/icons/ImageUp";
import * as ImagePicker from "expo-image-picker";
import { useFlashcardImageFormStore } from "@/hooks/store";

export interface CreateFlashcardFormProps {
  control: Control;
  errors: any[];
  handleSubmit: UseFormHandleSubmit<
    {
      set: string;
      term: string;
      definition: string;
    },
    undefined
  >;
  onSubmit: any;
}

export default function ({
  control,
  errors,
  handleSubmit,
  onSubmit,
}: CreateFlashcardFormProps) {
  const { t } = useTranslation();
  const { user } = useUser();
  const userId = useQuery(api.users.getUserByClerkId, {
    clerk_id: user?.id!,
  })?._id as Id<"users">;
  const availableSets =
    useQuery(api.sets.getSets, { userId })?.map(({ _id, name }) => ({
      value: _id,
      label: name,
    })) ?? [];
  const flashcardImageStore = useFlashcardImageFormStore();

  async function uploadImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      allowsMultipleSelection: false,
      quality: 1,
    });

    if (result.canceled) return;

    const blob = await (await fetch(result.assets[0].uri)).blob();

    flashcardImageStore.setImage(blob);
  }

  return (
    <Card className="w-11/12 mx-auto">
      <CardHeader>
        <CardTitle>Create a Flashcard</CardTitle>
      </CardHeader>
      <CardContent className="gap-6">
        <View>
          <Label className="text-muted-foreground font-bold">
            {t("label.set")}
          </Label>
          <View className="">
            <SetSelect
              items={availableSets.sort((a, b) =>
                a.label.localeCompare(b.label),
              )}
              control={control}
            />

            <Link
              className="text-primary text-lg"
              href="/(protected)/(flashcards)/create-set"
            >
              {t("button.createSet")}
            </Link>
          </View>
        </View>

        <View>
          <Label className="text-muted-foreground font-bold">
            {t("label.term")}
          </Label>
          <View>
            <Controller
              name="term"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Textarea
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  inputMode="text"
                  aria-labelledby="term"
                />
              )}
            />
            {errors && errors["term"] && (
              <Label className="text-destructive" nativeID="term">
                {t(errors["term"].message!!)}
              </Label>
            )}
          </View>
        </View>

        <View>
          <Label className="text-muted-foreground font-bold">
            {t("label.definition")}
          </Label>
          <View>
            <Controller
              name="definition"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Textarea
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  inputMode="text"
                  aria-labelledby="definition"
                />
              )}
            />
            {errors && errors["definition"] && (
              <Label className="text-destructive" nativeID="definition">
                {t(errors["definition"].message!!)}
              </Label>
            )}
          </View>
        </View>

        <View>
          <Button
            className="flex-row gap-3"
            onPress={uploadImage}
            disabled={flashcardImageStore.image != null}
          >
            <ImageUp className="text-foreground" />
            <Text className="text-foreground">{t("button.uploadImage")}</Text>
          </Button>
        </View>
      </CardContent>
      <CardFooter className="flex-col gap-3 w-full">
        <Button className="w-full" onPress={handleSubmit(onSubmit)}>
          <Text className="text-foreground">{t("button.addFlashcard")}</Text>
        </Button>
      </CardFooter>
    </Card>
  );
}

interface SetSelectItem {
  label: string;
  value: string;
}

function SetSelect({
  items,
  control,
}: {
  items: SetSelectItem[];
  control: Control;
}) {
  const { t } = useTranslation();

  return (
    <Controller
      name="set"
      control={control}
      render={({ field: { onChange, value } }) => (
        <Select className="" onValueChange={onChange} value={value}>
          <SelectTrigger className="w-[250px]">
            <SelectValue
              className="text-foreground text-sm native:text-lg"
              placeholder={t("input.selectSet")}
            />
          </SelectTrigger>
          <SelectContent className="w-[250px]">
            <SelectGroup>
              <SelectLabel>{t("input.canCreateANewSet")}</SelectLabel>

              {items.map((value) => (
                <SelectItem
                  label={value.label}
                  value={value.value}
                  key={value.value}
                ></SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    />
  );
}
