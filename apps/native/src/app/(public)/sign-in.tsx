import { ArrowLeft } from "@/components/icons/ArrowLeft";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Keyboard,
  Pressable,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { supabase } from "@/utils/supabase";
import { toast } from "sonner-native";
import { useAuth, useSignIn } from "@clerk/clerk-expo";

const initialValues = {
  email: "",
  password: "",
};

const schema = Yup.object({
  email: Yup.string()
    .email("form.error.email.invalid")
    .required("form.error.email.required"),
  password: Yup.string().required("form.error.password.required"),
});

export default function SignIn() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  });
  const [isLoading, setLoading] = useState<boolean>(false);
  const { isLoaded, signIn, setActive } = useSignIn();

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

  async function onSubmit({ email, password }: typeof initialValues) {
    setLoading(true);

    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(protected)/(home)");
      } else {
        toast.error("Something went wrong");
      }
    } catch (err: any) {
      toast.error(err.message);
    }

    setLoading(false);
  }

  return (
    <>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View className="bg-background h-screen">
          <SafeAreaView className="my-12">
            <View className="w-11/12 mx-auto">
              <Text className="text-foreground text-center font-bold text-5xl font-uniSansHeavy">
                {t("form.login.title")}
              </Text>
              <Text className="text-muted-foreground text-center font-bold">
                {t("form.login.subtitle")}
              </Text>
              <View className="mt-12">
                <View className="flex gap-3">
                  <Label className="text-muted-foreground">
                    {t("form.login.label")}
                  </Label>
                  <View>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          inputMode="email"
                          aria-labelledby="email"
                          placeholder={t("form.login.placeholder.email")}
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
                    <Controller
                      name="password"
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          onChangeText={onChange}
                          onBlur={onBlur}
                          value={value}
                          secureTextEntry={true}
                          aria-labelledby="password"
                          placeholder={t("form.login.placeholder.password")}
                        />
                      )}
                    />
                    {errors && errors["password"] && (
                      <Label className="text-destructive" nativeID="password">
                        {t(errors["password"].message!!)}
                      </Label>
                    )}
                  </View>
                  <Pressable
                    className="self-start"
                    onPress={() => router.replace("/reset-password")}
                  >
                    <Text className="text-blue-500">
                      {t("form.login.label.forgot-password")}
                    </Text>
                  </Pressable>
                  <Button
                    className="text-foreground"
                    onPress={handleSubmit(onSubmit)}
                    disabled={isLoading}
                  >
                    <Text>{t("form.login.button")}</Text>
                  </Button>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}
