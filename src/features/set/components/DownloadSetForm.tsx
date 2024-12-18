import { View, Text } from "react-native";
import React from "react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  convexQuery,
  useConvexMutation,
  useConvexQuery,
} from "@convex-dev/react-query";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner-native";
import { useUser } from "@clerk/clerk-expo";

const schema = Yup.object({
  setCode: Yup.string().required("error.set.setIdRequired"),
});

export default function () {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const { user } = useUser();

  const isCodeExist = useMutation({
    mutationFn: useConvexMutation(api.sharecode.isCodeExist),
    mutationKey: ["isCodeExist"],
  });

  const updateSharedWith = useMutation({
    mutationFn: useConvexMutation(api.sets.updateSharedWith),
    mutationKey: ["updateSharedWith"],
  });

  const getSetIdFromCode = useMutation({
    mutationFn: useConvexMutation(api.sharecode.getSetIdFromCode),
    mutationKey: ["getSetIdFromCode"],
  });

  const userQuery = useQuery(
    convexQuery(api.users.getUserByClerkId, { clerk_id: user?.id! }),
  );

  async function onSubmit({ setCode }: Yup.InferType<typeof schema>) {
    const isExist = await isCodeExist.mutateAsync({ code: setCode });

    if (!isExist) {
      toast.error(t("error.shareCode.codeNotExist"));
    }

    const setId = await getSetIdFromCode.mutateAsync({ code: setCode });

    await updateSharedWith.mutateAsync({
      setId: setId,
      userId: userQuery.data?._id!,
      action: "add",
    });

    toast.success(t("alert.set.imported"));
  }

  return (
    <View className="w-full flex gap-6 rounded-xl border border-border mx-auto p-6">
      <Controller
        control={control}
        render={({ field: { onChange, value, onBlur } }) => (
          <Input
            inputMode="text"
            placeholder={t("placeholder.setCode")}
            onChangeText={onChange}
            value={value}
            onBlur={onBlur}
          />
        )}
        name="setCode"
      />
      {errors && errors["setCode"] && (
        <Label className="text-destructive" nativeID="setCode">
          {t(errors["setCode"].message!!)}
        </Label>
      )}
      <Button onPress={handleSubmit(onSubmit)}>
        <Text className="text-foreground">Download</Text>
      </Button>
    </View>
  );
}
