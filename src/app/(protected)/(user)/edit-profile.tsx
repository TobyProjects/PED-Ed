import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRouter } from "expo-router";
import { Label } from "@/components/ui/label";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/clerk-expo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import * as ImagePicker from "expo-image-picker";
import { ArrowLeft } from "@/components/icons/ArrowLeft";
import { useColorScheme } from "@/hooks/useColorScheme";
import { NAV_THEME } from "@/constants/Themes";
import { useUserProfile } from "@/hooks/useUserProfile";
import { toast } from "sonner-native";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export default function () {
  const navigation = useNavigation();
  const router = useRouter();
  const { t } = useTranslation();
  const { userProfile } = useUserProfile();
  const { colorScheme } = useColorScheme();
  const { user } = useUser();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-foreground text-xl font-semibold">
          {t("tab.profile")}
        </Text>
      ),
      headerLeft: () => (
        <ArrowLeft
          onPress={() => router.replace("/(protected)/(home)/profile")}
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

  const username = userProfile?.username as string;
  const firstName = userProfile?.first_name as string;
  const lastName = userProfile?.last_name as string;
  const aboutMe = userProfile?.description
    ? (userProfile?.description as string)
    : "";
  const avatar = userProfile?.image_url;

  const { control, handleSubmit } = useForm({
    defaultValues: {
      firstName: firstName,
      lastName: lastName,
      username: username,
      aboutMe: aboutMe,
    },
  });

  const [userAvatar, setUserAvatar] = useState<Blob | null>(null);
  const [avatarUri, setAvatarUri] = useState<string>("");

  const setDescription = useMutation(api.users.setDescription);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const updateUserAvatar = useMutation(api.users.updateUserAvatar);
  const userGotByUsername = useQuery(api.users.getUserByUsername, { username });

  async function onSubmit({ firstName, lastName, username, aboutMe }: any) {
    await user?.update({
      firstName,
      lastName,
      username,
    });
    await setDescription({ content: aboutMe });

    if (userAvatar != null) {
      const url = await generateUploadUrl();

      const result = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": userAvatar.type,
        },
        body: userAvatar,
      });

      const { storageId } = await result.json();
      await updateUserAvatar({ storageId, _id: userGotByUsername?._id! });
    }

    toast.success(t("alert.user.profileUpdated"));
  }

  async function changeAvatar() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      allowsMultipleSelection: false,
      quality: 1,
    });

    if (result.canceled) return;

    const blob = await (await fetch(result.assets[0].uri)).blob();

    setUserAvatar(blob);
    setAvatarUri(result.assets[0].uri);
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
              <Avatar alt="User Avatar" className="w-32 h-32">
                <AvatarImage
                  source={{ uri: userAvatar == null ? avatar : avatarUri }}
                />
                <AvatarFallback>
                  <Text>Avatar</Text>
                </AvatarFallback>
              </Avatar>
              <Button onPress={() => changeAvatar()} className="rounded-full">
                <Text className="text-foreground">
                  {t("button.changeAvatar")}
                </Text>
              </Button>
              <View className="w-11/12">
                <Label className="text-muted-foreground font-bold">
                  {t("label.firstName")}
                </Label>
                <View className="mx-auto w-full rounded-3xl">
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        inputMode="text"
                        aria-labelledby="firstName"
                        placeholder={firstName}
                        defaultValue={firstName}
                      />
                    )}
                  />
                </View>
              </View>
              <View className="w-11/12">
                <Label className="text-muted-foreground font-bold">
                  {t("label.lastName")}
                </Label>
                <View className="mx-auto w-full rounded-3xl">
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        inputMode="text"
                        aria-labelledby="lastName"
                        placeholder={lastName}
                        defaultValue={lastName}
                      />
                    )}
                  />
                </View>
              </View>
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
                        defaultValue={username}
                      />
                    )}
                  />
                </View>
              </View>
              <View className="w-11/12">
                <Label className="text-muted-foreground font-bold">
                  {t("label.aboutMe")}
                </Label>
                <View className="mx-auto w-full rounded-3xl">
                  <Controller
                    name="aboutMe"
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Textarea
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        aria-labelledby="aboutMe"
                        placeholder={t("placeholder.aboutMe")}
                        defaultValue={aboutMe}
                      />
                    )}
                  />
                </View>
              </View>
              <Button
                className="w-11/12 mx-auto mt-3 rounded-full"
                onPress={handleSubmit(onSubmit)}
              >
                <Text className="text-foreground">Save</Text>
              </Button>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
}
