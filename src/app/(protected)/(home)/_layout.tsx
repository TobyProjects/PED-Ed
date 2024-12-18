import { GalleryHorizontalEnd } from "@/components/icons/GalleryHorizontalEnd";
import { Home } from "@/components/icons/Home";
import { Timer } from "@/components/icons/Timer";
import { User } from "@/components/icons/User";
import { WalletCards } from "@/components/icons/WalletCards";
import TabBar from "@/components/TabBar";
import { NAV_THEME } from "@/constants/Themes";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuth } from "@clerk/clerk-expo";
import { Tabs, useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function ProtectedLayout() {
  const { t } = useTranslation();
  const { isSignedIn } = useAuth();
  const { colorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor:
            colorScheme == "dark"
              ? NAV_THEME.dark.background
              : NAV_THEME.light.background,
        },
      }}
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
        redirect={!isSignedIn}
      />
      <Tabs.Screen
        name="flashcards"
        options={{
          title: t("tab.flashcards"),
          tabBarIcon: () => <WalletCards className="text-foreground" />,
          tabBarLabelPosition: "below-icon",
        }}
        redirect={!isSignedIn}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: t("tab.home"),
          tabBarIcon: () => <Home className="text-foreground" />,
          tabBarLabelPosition: "below-icon",
        }}
        redirect={!isSignedIn}
      />
      <Tabs.Screen
        name="pomodoro"
        options={{
          title: t("tab.pomodoro"),
          tabBarIcon: () => <Timer className="text-foreground" />,
          tabBarLabelPosition: "below-icon",
        }}
        redirect={!isSignedIn}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("tab.profile"),
          tabBarIcon: () => <User className="text-foreground" />,
          tabBarLabelPosition: "below-icon",
        }}
        redirect={!isSignedIn}
      />
    </Tabs>
  );
}
