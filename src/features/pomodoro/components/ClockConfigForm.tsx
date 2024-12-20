import { View } from "react-native";
import React from "react";
import { Text } from "@/components/ui/text";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "@/components/ui/input";
import { PomodoroStore, usePomodoroStore } from "@/hooks/usePomodoroStore";
import { toast } from "sonner-native";

const schema = Yup.object({
  workDuration: Yup.number().required(),
  breakDuration: Yup.number().required(),
  cycles: Yup.number().required(),
});

export default function ClockConfigForm({ store }: { store: PomodoroStore }) {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      workDuration: store.getWorkDurationInMinutes(),
      breakDuration: store.getBreakDurationInMinutes(),
      cycles: store.cycles,
    },
  });

  async function onSubmit(data: Yup.InferType<typeof schema>) {
    store.setWorkDuration(data.workDuration);
    store.setBreakDuration(data.breakDuration);
    store.setCycles(data.cycles);
    toast.success(t("alert.pomodoro.configUpdated"));
  }

  return (
    <View className="w-full h-full border border-border rounded-xl flex gap-6 p-6">
      <View>
        <Label>{t("label.workDuration")}</Label>
        <Controller
          control={control}
          name="workDuration"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              inputMode="numeric"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value?.toString()}
            />
          )}
        />
      </View>
      <View>
        <Label>{t("label.breakDuration")}</Label>
        <Controller
          control={control}
          name="breakDuration"
          render={({ field: { onBlur, onChange, value } }) => (
            <Input
              inputMode="numeric"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value?.toString()}
            />
          )}
        />
      </View>
      <View>
        <Label>{t("label.cycles")}</Label>
        <Controller
          control={control}
          name="cycles"
          render={({ field: { onBlur, onChange, value } }) => (
            <Input
              inputMode="numeric"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value?.toString()}
            />
          )}
        />
      </View>
      <View>
        
        <Button onPress={handleSubmit(onSubmit)}>
          <Text>{t("button.saveChanges")}</Text>
        </Button>
      </View>
    </View>
  );
}
