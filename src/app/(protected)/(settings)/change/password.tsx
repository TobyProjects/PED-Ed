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
import { useUser } from "@clerk/clerk-expo";
import { toast } from "sonner-native";

type FormValues = {
  oldPassword: string;
  newPassword: string;
  newPassword2: string;
};

const schema = Yup.object({
  oldPassword: Yup.string()
    .required("error.password.required")
    .min(8, "error.password.tooShort")
    .max(100, "error.password.tooLong"),
  newPassword: Yup.string()
    .required("error.password.required")
    .min(8, "error.password.tooShort")
    .max(100, "error.password.tooLong"),
  newPassword2: Yup.string().oneOf(
    [Yup.ref("newPassword")],
    "error.password.misMatch",
  ),
});

export default function () {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const navigation = useNavigation();
  const router = useRouter();
  const { user } = useUser();

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
          {t("label.changePassword")}
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

  async function onSubmit({ oldPassword, newPassword }: FormValues) {
    try {
      await user?.updatePassword({
        currentPassword: oldPassword,
        newPassword: newPassword,
      });
      toast.success(t("alert.password.updated"));
      router.replace("/(protected)/(home)");
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
              <View className="w-11/12 flex gap-6">
                <View>
                  <Label className="text-muted-foreground font-bold">
                    {t("label.oldPassword")}
                  </Label>
                  <View className="mx-auto w-full rounded-3xl">
                    <Controller
                      name="oldPassword"
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          inputMode="text"
                          secureTextEntry
                          aria-labelledby="oldPassword"
                        />
                      )}
                    />
                    {errors && errors["oldPassword"] && (
                      <Label
                        className="text-destructive"
                        nativeID="oldPassword"
                      >
                        {t(errors["oldPassword"].message!!)}
                      </Label>
                    )}
                  </View>
                </View>
                <View>
                  <Label className="text-muted-foreground font-bold">
                    {t("label.newPassword")}
                  </Label>
                  <View className="mx-auto w-full rounded-3xl">
                    <Controller
                      name="newPassword"
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          inputMode="text"
                          secureTextEntry
                          aria-labelledby="newPassword"
                        />
                      )}
                    />
                    {errors && errors["newPassword"] && (
                      <Label
                        className="text-destructive"
                        nativeID="newPassword"
                      >
                        {t(errors["newPassword"].message!!)}
                      </Label>
                    )}
                  </View>
                </View>

                <View>
                  <Label className="text-muted-foreground font-bold">
                    {t("label.password2")}
                  </Label>
                  <View className="mx-auto w-full rounded-3xl">
                    <Controller
                      name="newPassword2"
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          inputMode="text"
                          secureTextEntry
                          aria-labelledby="newPassword2"
                        />
                      )}
                    />
                    {errors && errors["newPassword2"] && (
                      <Label
                        className="text-destructive"
                        nativeID="newPassword2"
                      >
                        {t(errors["newPassword2"].message!!)}
                      </Label>
                    )}
                  </View>
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
