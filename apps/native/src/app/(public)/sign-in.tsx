import { ArrowLeft } from "@/components/icons/ArrowLeft";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Keyboard,
  Pressable,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner-native";
import { useSignIn } from "@clerk/clerk-expo";

type FormValues = {
  email: string;
  password: string;
};

const schema = Yup.object({
  email: Yup.string()
    .email("error.email.invalid")
    .required("error.email.required"),
  password: Yup.string().required("error.password.required"),
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

  async function onSubmit({ email, password }: FormValues) {
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
        toast.error(t("alert.somethingWentWrong"));
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
                {t("title.signIn")}
              </Text>
              <Text className="text-muted-foreground text-center font-bold">
                {t("title.signIn.subTitle")}
              </Text>
              <View className="mt-12">
                <View className="flex gap-3">
                  <Label className="text-muted-foreground font-bold">
                    {t("label.accountInformation")}
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
                          placeholder={t("placeholder.email")}
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
                          placeholder={t("placeholder.password")}
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
                      {t("label.forgotPassword")}
                    </Text>
                  </Pressable>
                  <Button
                    className="text-foreground"
                    onPress={handleSubmit(onSubmit)}
                    disabled={isLoading}
                  >
                    <Text>{t("button.signIn")}</Text>
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
