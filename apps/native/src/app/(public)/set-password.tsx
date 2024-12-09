import {
  View,
  Text,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRouter } from "expo-router";
import { Label } from "@/components/ui/label";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { useSignIn, useSignUp } from "@clerk/clerk-expo";
import { toast } from "sonner-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const schema = Yup.object({
  code: Yup.string().required("error.verificationCode.required"),
  password: Yup.string().required("error.password.required"),
});

export default function () {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [isLoading, setLoading] = useState<boolean>(false);
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  async function onSubmit({
    code,
    password,
  }: {
    code: string;
    password: string;
  }) {
    setLoading(true);

    if (!isLoaded) return;

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });

      if (result.status === "complete") {
        setActive({ session: result.createdSessionId });
        router.replace("/(protected)/(home)");
      }
    } catch (error: any) {
      toast.error(error.message);
    }

    setLoading(false);
  }

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView className="bg-background h-full">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
        >
          <ScrollView className="w-11/12 mx-auto h-full mt-12">
            <Text className="text-foreground text-center font-uniSansHeavy text-5xl font-bold">
              {t("title.verifyEmail")}
            </Text>

            <View className="mt-6">
              <Label nativeID="code" className="font-semibold">
                {t("label.verifyCode")}
              </Label>
              <Controller
                control={control}
                name="code"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder={"Code"}
                    inputMode="text"
                    aria-labelledby="code"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    className="mt-1"
                  />
                )}
              />
              {errors && errors["code"] && (
                <Label className="text-destructive" nativeID="code">
                  {t(errors["code"].message!!)}
                </Label>
              )}
            </View>

            <View className="mt-6">
              <Label nativeID="password" className="font-semibold">
                {t("label.password")}
              </Label>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder={t("placeholder.newPassword")}
                    inputMode="text"
                    aria-labelledby="password"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    className="mt-1"
                  />
                )}
              />
              {errors && errors["password"] && (
                <Label className="text-destructive" nativeID="password">
                  {t(errors["password"].message!!)}
                </Label>
              )}
            </View>

            <Button
              className="text-foreground mt-2"
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              <Text className="text-foreground">
                {t("button.resetPassword")}
              </Text>
            </Button>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
