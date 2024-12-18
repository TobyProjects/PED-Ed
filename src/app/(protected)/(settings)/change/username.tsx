import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigation, useRouter } from "expo-router";
import { ArrowLeft } from "@/components/icons/ArrowLeft";
import { useColorScheme } from "@/hooks/useColorScheme";
import { NAV_THEME } from "@/constants/Themes";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUser } from "@clerk/clerk-expo";
import { toast } from "sonner-native";

type FormValues = {
  username: string;
};

const schema = Yup.object({
  username: Yup.string()
    .required("error.username.required")
    .min(5, "error.username.tooShort")
    .max(20, "error.username.tooLong"),
});

export default function () {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const navigation = useNavigation();
  const router = useRouter();
  const { userProfile } = useUserProfile();
  const { user } = useUser();

  const username = userProfile?.username as string;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-foreground text-xl font-semibold">
          {t("label.username")}
        </Text>
      ),
      headerLeft: () => (
        <ArrowLeft
          onPress={() => router.replace("/(protected)/(settings)")}
          className="text-foreground"
        />
      ),
      headerStyle: {
        backgroundColor:
          colorScheme == "dark"
            ? NAV_THEME.dark.background
            : NAV_THEME.light.background,
      },
    });
  }, [navigation]);

  async function onSubmit({ username }: FormValues) {
    try {
      await user?.update({
        username: username,
      });
      toast.success(t("alert.user.usernameUpdated"));
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <View className="bg-background">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
        >
          <ScrollView
            className="w-full h-full"
            keyboardShouldPersistTaps="handled"
          >
            <View className="w-11/12 border border-border mx-auto mt-12 rounded-xl flex items-center justify-center gap-3 py-6">
              <View className="w-11/12">
                <Label className="text-muted-foreground font-bold">
                  {t("label.username")}
                </Label>
                <View className="mx-auto w-full rounded-3xl">
                  <Controller
                    name="username"
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        inputMode="text"
                        aria-labelledby="username"
                        placeholder={username}
                      />
                    )}
                  />
                  {errors && errors["username"] && (
                    <Label className="text-destructive" nativeID="username">
                      {t(errors["username"].message!!)}
                    </Label>
                  )}
                </View>
              </View>

              <Button
                className="w-11/12 mx-auto mt-3 rounded-full"
                onPress={handleSubmit(onSubmit)}
              >
                <Text className="text-foreground">Change</Text>
              </Button>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
}
