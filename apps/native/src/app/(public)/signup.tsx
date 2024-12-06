import { ArrowLeft } from "@/components/icons/ArrowLeft";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { useNavigation } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { supabase } from "@/utils/supabase";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner-native";

type FormValues = {
  email: string;
  displayName: string;
  username: string;
  password: string;
};

const schema = Yup.object({
  email: Yup.string()
    .email("form.error.email.invalid")
    .required("form.error.email.required"),
  displayName: Yup.string()
    .required("form.error.displayName.required")
    .min(5, "form.error.displayName.tooShort")
    .max(20, "form.error.displayName.tooLong"),
  username: Yup.string()
    .required("form.error.username.required")
    .min(5, "form.error.username.tooShort")
    .max(20, "form.error.username.tooLong"),
  password: Yup.string()
    .required("form.error.password.required")
    .min(8, "form.error.password.tooShort")
    .max(100, "form.error.password.tooLong"),
  password2: Yup.string().oneOf(
    [Yup.ref("password")],
    "form.error.password.mismatch",
  ),
});

export default function SignUp() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
      headerLeft: () => (
        <ArrowLeft
          onPress={() => navigation.goBack()}
          className="text-foreground"
        />
      ),
    });
  }, [navigation]);

  function dismissKeyboard() {
    Keyboard.dismiss();
  }

  async function onSubmit({
    email,
    password,
    username,
    displayName,
  }: FormValues) {
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: username,
          displayName: displayName,
        },
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t("form.register.message.register.successfully"));
    }

    setLoading(false);
  }

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View className="bg-background h-screen">
        <SafeAreaView className="my-12">
          <View className="w-11/12 mx-auto">
            <Text className="text-foreground text-center font-bold text-5xl font-uniSansHeavy">
              {t("form.register.title")}
            </Text>
            <View className="mt-12">
              <View className="flex gap-3">
                <View>
                  <Label nativeID="email" className="font-bold">
                    {t("form.register.label.email")}
                  </Label>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        placeholder={t("form.register.label.email")}
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
                <View>
                  <Label nativeID="displayName" className="font-bold">
                    {t("form.register.label.displayName")}
                  </Label>
                  <Controller
                    control={control}
                    name="displayName"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        placeholder={t("form.register.label.displayName.tip")}
                        inputMode="text"
                        aria-labelledby="displayName"
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                      />
                    )}
                  />
                  {errors && errors["displayName"] && (
                    <Label className="text-destructive" nativeID="displayName">
                      {t(errors["displayName"].message!!)}
                    </Label>
                  )}
                </View>
                <View>
                  <Label nativeID="username">
                    {t("form.register.label.username")}
                  </Label>
                  <Controller
                    control={control}
                    name="username"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        placeholder={t("form.register.placeholder.username")}
                        inputMode="text"
                        aria-labelledby="username"
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                      />
                    )}
                  />
                  {errors && errors["username"] && (
                    <Label className="text-destructive" nativeID="username">
                      {t(errors["username"].message!!)}
                    </Label>
                  )}
                </View>
                <View>
                  <Label nativeID="password" className="font-bold">
                    {t("form.register.label.password")}
                  </Label>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        placeholder={t("form.register.placeholder.password")}
                        inputMode="text"
                        aria-labelledby="password"
                        onChangeText={onChange}
                        secureTextEntry={true}
                        onBlur={onBlur}
                        value={value}
                      />
                    )}
                  />
                  {errors && errors["password"] && (
                    <Label className="text-destructive" nativeID="password">
                      {t(errors["password"].message!!)}
                    </Label>
                  )}
                </View>
                <View>
                  <Label nativeID="password2" className="font-bold">
                    {t("form.register.label.password2")}
                  </Label>
                  <Controller
                    control={control}
                    name="password2"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        inputMode="text"
                        aria-labelledby="password2"
                        onChangeText={onChange}
                        secureTextEntry={true}
                        onBlur={onBlur}
                        value={value}
                      />
                    )}
                  />
                  {errors && errors["password2"] && (
                    <Label className="text-destructive" nativeID="password2">
                      {t(errors["password2"].message!!)}
                    </Label>
                  )}
                </View>

                <Button
                  className="text-foreground"
                  onPress={handleSubmit(onSubmit)}
                  disabled={isLoading}
                >
                  <Text>{t("form.register.button")}</Text>
                </Button>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}
