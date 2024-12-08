import { ArrowLeft } from "@/components/icons/ArrowLeft";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { useAuth, useSignUp } from "@clerk/clerk-expo";
import { toast } from "sonner-native";

type FormValues = {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
};

const schema = Yup.object({
  email: Yup.string()
    .email("error.email.invalid")
    .required("error.email.required"),
  username: Yup.string()
    .required("error.username.required")
    .min(5, "error.username.tooShort")
    .max(20, "error.username.tooLong"),
  firstName: Yup.string().required("error.firstName.required"),
  lastName: Yup.string().required("error.lastName.required"),
  password: Yup.string()
    .required("error.password.required")
    .min(8, "error.password.tooShort")
    .max(100, "error.password.tooLong"),
  password2: Yup.string().oneOf(
    [Yup.ref("password")],
    "error.password.misMatch",
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
  const { isLoaded, signUp } = useSignUp();
  const router = useRouter();

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

  async function onSubmit({
    email,
    password,
    username,
    firstName,
    lastName,
  }: FormValues) {
    setLoading(true);

    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress: email,
        password: password,
        username: username,
        firstName: firstName,
        lastName: lastName,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      toast.success(t("alert.email.verificationSent"));

      router.replace("/(public)/verify-email");
    } catch (e: any) {
      toast.error(e.message);
    }

    setLoading(false);
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View className="bg-background h-screen">
        <SafeAreaView className="my-12">
          <View className="w-11/12 mx-auto">
            <Text className="text-foreground text-center font-bold text-5xl font-uniSansHeavy">
              {t("title.signUp")}
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
                        placeholder={t("placeholder.email")}
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
                  <Label nativeID="firstName" className="font-bold">
                    {t("label.firstName")}
                  </Label>
                  <Controller
                    control={control}
                    name="firstName"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        placeholder={t("placeholder.firstName")}
                        inputMode="text"
                        aria-labelledby="firstName"
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                      />
                    )}
                  />
                  {errors && errors["firstName"] && (
                    <Label className="text-destructive" nativeID="firstName">
                      {t(errors["firstName"].message!!)}
                    </Label>
                  )}
                </View>
                <View>
                  <Label nativeID="lastName" className="font-bold">
                    {t("label.lastName")}
                  </Label>
                  <Controller
                    control={control}
                    name="lastName"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        placeholder={t("placeholder.lastName")}
                        inputMode="text"
                        aria-labelledby="lastName"
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                      />
                    )}
                  />
                  {errors && errors["lastName"] && (
                    <Label className="text-destructive" nativeID="lastName">
                      {t(errors["lastName"].message!!)}
                    </Label>
                  )}
                </View>
                <View>
                  <Label nativeID="username" className="font-bold">
                    {t("label.username")}
                  </Label>
                  <Controller
                    control={control}
                    name="username"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        placeholder={t("placeholder.username")}
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
                    {t("label.password")}
                  </Label>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        placeholder={t("placeholder.password")}
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
                    {t("label.password2")}
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
                  <Text>{t("button.signUp")}</Text>
                </Button>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}
