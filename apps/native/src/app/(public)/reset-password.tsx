import { ArrowLeft } from "@/components/icons/ArrowLeft";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Label } from "@/components/ui/label";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { toast } from "sonner-native";
import { Home } from "@/components/icons/Home";

const schema = Yup.object({
  email: Yup.string()
    .email("form.error.email.invalid")
    .required("form.error.email.required"),
});

export default function ForgotPassword() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
      headerLeft: () => (
        <Home onPress={() => navigation.goBack()} className="text-foreground" />
      ),
    });
  }, [navigation]);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [isDisabled, setDisabled] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  function dismissKeyboard() {
    Keyboard.dismiss();
  }

  async function onSubmit({ email }: any) {
    setDisabled(true);
    setSecondsLeft(30);

   

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View className="bg-background h-screen">
        <SafeAreaView className="my-12">
          <View className="w-11/12 mx-auto">
            <Text className="text-foreground text-center font-bold text-5xl font-uniSansHeavy">
              {t("form.resetpassword.title")}
            </Text>
            <View className="mt-12">
              <View className="flex gap-3">
                <View>
                  <Label nativeID="email" className="font-bold">
                    {t("form.resetpassword.label.email")}
                  </Label>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        inputMode="email"
                        aria-labelledby="email"
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                      />
                    )}
                  />
                  {errors && errors["email"] && (
                    <Label className="text-destructive" nativeID="email">
                      {t(errors["email"].message!!)}
                    </Label>
                  )}
                </View>

                <Button
                  className="text-foreground"
                  onPress={handleSubmit(onSubmit)}
                  disabled={isDisabled}
                >
                  <Text>
                    {isDisabled
                      ? t("form.resetpassword.countdown", {
                          seconds: secondsLeft,
                        })
                      : t("form.resetpassword.button")}
                  </Text>
                </Button>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}
