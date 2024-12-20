import { ArrowLeft } from "@/components/icons/ArrowLeft";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Label } from "@/components/ui/label";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { toast } from "sonner-native";
import { Home } from "@/components/icons/Home";
import { useSignIn } from "@clerk/clerk-expo";

const schema = Yup.object({
  email: Yup.string()
    .email("error.email.invalid")
    .required("error.email.required"),
});

export default function ForgotPassword() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const router = useRouter();

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
  const { isLoaded, signIn } = useSignIn();

  async function onSubmit({ email }: any) {
    try {
      await signIn?.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      toast.success(t("alert.email.resetPasswordCodeSent"));
      router.push("/(public)/set-password");
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  if (!isLoaded) return;

  return (
    <SafeAreaView className="bg-background h-full">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView>
          <ScrollView
            className="w-full h-full"
            keyboardShouldPersistTaps="handled"
          >
            <View className="my-12">
              <View className="w-11/12 mx-auto">
                <Text className="text-foreground text-center font-bold text-5xl font-uniSansHeavy">
                  {t("title.resetPassword")}
                </Text>
                <View className="mt-12">
                  <View className="flex gap-3">
                    <View>
                      <Label nativeID="email" className="font-bold">
                        {t("label.email")}
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
                    >
                      <Text>{t("button.resetPassword")}</Text>
                    </Button>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
