import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
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
import { useSignUp } from "@clerk/clerk-expo";
import { toast } from "sonner-native";

const schema = Yup.object({
  code: Yup.string().required("form.error.verificationCode.required"),
});

export default function VerifyEmail() {
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
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  async function onSubmit({ code }: { code: string }) {
    setLoading(true);

    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/(protected)/(home)");
      } else {
        toast.error("Verifying email failed");
      }
    } catch (err: any) {
      toast.error(err.message);
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
          <ScrollView
            className="w-full h-full"
            keyboardShouldPersistTaps="handled"
          >
            <View className="my-12">
              <View className="w-11/12 mx-auto">
                <Text className="text-foreground text-center font-bold text-5xl font-uniSansHeavy">
                  {t("title.verifyEmail")}
                </Text>
                <View className="mt-12">
                  <View className="flex gap-3">
                    <View>
                      <Label nativeID="code" className="font-bold">
                        {t("label.verifyCode")}
                      </Label>
                      <Controller
                        control={control}
                        name="code"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <Input
                            inputMode="numeric"
                            aria-labelledby="code"
                            onChangeText={onChange}
                            onBlur={onBlur}
                            value={value}
                          />
                        )}
                      />
                      {errors && errors["code"] && (
                        <Label className="text-destructive" nativeID="code">
                          {t(errors["code"].message!!)}
                        </Label>
                      )}
                    </View>

                    <Button
                      className="text-foreground"
                      onPress={handleSubmit(onSubmit)}
                    >
                      <Text className="text-foreground">
                        {t("button.verifyEmail")}
                      </Text>
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
