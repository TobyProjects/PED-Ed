import * as React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { Cog } from "@/components/icons/Cog";
import { Pencil } from "@/components/icons/Pencil";
import { router } from "expo-router";
import { LogOut } from "@/components/icons/LogOut";
import { useAuth, useUser } from "@clerk/clerk-expo";
import AboutMe from "@/features/user/components/AboutMe";
import Avatar from "@/features/user/components/Avatar";
import { useTranslation } from "react-i18next";

export default function TabsScreen() {
  const { t } = useTranslation();
  const { signOut } = useAuth();
  const { user } = useUser();

  if (!user) return null;

  const description = user.publicMetadata.description as string | undefined;
  const username = user.username as string;
  const firstName = user.firstName as string;
  const lastName = user.lastName as string;
  const userId = user.id;
  const avatar = user.imageUrl;

  async function onSignOut() {
    await signOut();
  }

  return (
    <ScrollView className="bg-background">
      <SafeAreaView className="">
        <View className="flex items-end">
          <Pressable
            className="p-3"
            onPress={() => router.push("/(protected)/(settings)")}
          >
            <Cog className="text-primary" />
          </Pressable>
        </View>
        <View className="flex gap-8 justify-center items-center mt-24">
          <Avatar
            firstName={firstName}
            lastName={lastName}
            username={username}
            avatar={avatar}
          />
          <View className="flex-row justify-center items-center">
            <Button className="w-11/12 flex-row gap-3 rounded-3xl">
              <Text>
                <Pencil className="text-foreground" />
              </Text>
              <Text className="">{t("button.editProfile")}</Text>
            </Button>
          </View>
          <View className="w-11/12">
            <AboutMe
              memberSince={user?.createdAt ? user.createdAt : new Date()}
              description={description}
            />
          </View>
          <View className="flex-row justify-center items-center">
            <Button
              className="flex-row gap-3 rounded-3xl w-11/12"
              variant="destructive"
              onPress={() => onSignOut()}
            >
              <Text>
                <LogOut className="text-foreground" />
              </Text>
              <Text className="">{t("button.signOut")}</Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
