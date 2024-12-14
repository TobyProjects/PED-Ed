import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { Text } from "@/components/ui/text";
import { useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Controller, set, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Label } from "@/components/ui/label";
import { useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner-native";

const schema = Yup.object({
  name: Yup.string().required("error.set.nameRequired"),
  description: Yup.string().optional(),
});

export default function () {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const { user } = useUser();
  const userId = useQuery(api.users.getUserByClerkId, {
    clerk_id: user?.id!,
  })?._id as Id<"users">;
  const createSet = useMutation(api.sets.createSet);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  async function onSubmit(data: Yup.InferType<typeof schema>) {
    setIsLoading(true);

    try {
      await createSet({
        name: data.name,
        description: data.description,
        userId,
      });
      toast.success(t("alert.set.created"));
    } catch (error: any) {
      toast.error(error.message);
    }

    setIsLoading(false);
  }

  return (
    <View className="bg-background w-full h-full border-2 rounded-xl border-border flex flex-col">
      <Text className="text-center text-3xl mt-3">{t("title.createASet")}</Text>

      <View className="flex-grow flex items-center justify-center gap-3">
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value, onBlur } }) => (
            <Input
              onChangeText={onChange}
              value={value}
              onBlur={onBlur}
              className="w-11/12"
              placeholder={t("placeholder.setName")}
              inputMode="text"
            />
          )}
        />

        {errors && errors["name"] && (
          <Label className="text-destructive" nativeID="name">
            {t(errors["name"].message!!)}
          </Label>
        )}

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value, onBlur } }) => (
            <Input
              onChangeText={onChange}
              value={value}
              onBlur={onBlur}
              className="w-11/12"
              inputMode="text"
              placeholder={t("placeholder.setDescription")}
            />
          )}
        />

        {errors && errors["description"] && (
          <Label className="text-destructive" nativeID="description">
            {t(errors["description"].message!!)}
          </Label>
        )}
      </View>

      <View className="mb-6 w-11/12 mx-auto">
        <Button disabled={isLoading} onPress={handleSubmit(onSubmit)}>
          <Text>{t("button.createSet")}</Text>
        </Button>
      </View>
    </View>
  );
}
