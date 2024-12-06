import { useAuth } from "@/components/AuthProvider";
import { ArrowLeft } from "@/components/icons/ArrowLeft";
import { GalleryHorizontalEnd } from "@/components/icons/GalleryHorizontalEnd";
import { Home } from "@/components/icons/Home";
import { Timer } from "@/components/icons/Timer";
import { User } from "@/components/icons/User";
import { WalletCards } from "@/components/icons/WalletCards";
import TabBar from "@/components/TabBar";
import { Redirect, Slot, Tabs, useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function ProtectedLayout() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
      headerLeft: () => null,
    });
  }, [navigation]);

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="gallery"
        options={{
          title: t("tab.gallery"),
          tabBarIcon: () => (
            <GalleryHorizontalEnd className="text-foreground" />
          ),
          tabBarLabelPosition: "below-icon",
        }}
        redirect={!isAuthenticated}
      />
      <Tabs.Screen
        name="flashcards"
        options={{
          title: t("tab.flashcards"),
          tabBarIcon: () => <WalletCards className="text-foreground" />,
          tabBarLabelPosition: "below-icon",
        }}
        redirect={!isAuthenticated}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: t("tab.home"),
          tabBarIcon: () => <Home className="text-foreground" />,
          tabBarLabelPosition: "below-icon",
        }}
        redirect={!isAuthenticated}
      />
      <Tabs.Screen
        name="pomodoro"
        options={{
          title: t("tab.pomodoro"),
          tabBarIcon: () => <Timer className="text-foreground" />,
          tabBarLabelPosition: "below-icon",
        }}
        redirect={!isAuthenticated}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("tab.profile"),
          tabBarIcon: () => <User className="text-foreground" />,
          tabBarLabelPosition: "below-icon",
        }}
        redirect={!isAuthenticated}
      />
    </Tabs>
  );
}