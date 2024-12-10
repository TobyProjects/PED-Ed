import "@/styles/global.css";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Slot, SplashScreen, useRouter, useSegments } from "expo-router";
import * as React from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import "@/locales/i18n";
import { useTranslation } from "react-i18next";
import { useFonts } from "expo-font";
import { PortalHost } from "@rn-primitives/portal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster } from "sonner-native";
import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@/utils/cache";
import { ConvexReactClient, useConvexAuth } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useEffect } from "react";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!clerkPublishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env",
  );
}

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
  const { i18n } = useTranslation();
  const [loaded, error] = useFonts({
    UniSansHeavyRegular: require("@/assets/fonts/UniSansHeavyRegular.ttf"),
  });

  useEffect(() => {
    async function loadTheme() {
      const theme = await AsyncStorage.getItem("theme");

      if (!theme) {
        await AsyncStorage.setItem("theme", colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }

      const colorTheme = theme === "dark" ? "dark" : "light";

      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);

        setIsColorSchemeLoaded(true);
        return;
      }
      setIsColorSchemeLoaded(true);
    }

    async function loadFonts() {}

    async function loadLanguage() {
      const savedLanguage = await AsyncStorage.getItem("language");
      if (savedLanguage) {
        await i18n.changeLanguage(savedLanguage);
      }
    }

    (async () => {
      await loadTheme();
      await loadFonts();
      await loadLanguage();
    })().finally(() => {
      SplashScreen.hideAsync();
    });
  }, [i18n]);

  if (!isColorSchemeLoaded) {
    return null;
  }

  if (!loaded && !error) {
    return null;
  }

  function InitialLayout() {
    const { isLoading, isAuthenticated } = useConvexAuth();
    const segments = useSegments();
    const router = useRouter();

    React.useEffect(() => {
      const isInProtectedGroup = segments[0] === "(protected)";

      if (isAuthenticated && !isInProtectedGroup) {
        router.replace("/(protected)/(home)");
      } else if (!isAuthenticated) {
        router.replace("/(public)");
      }
    }, [isAuthenticated]);

    return (
      <GestureHandlerRootView>
        <Slot />
        <PortalHost />
        <Toaster position="top-center" />
      </GestureHandlerRootView>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <InitialLayout />
        </ConvexProviderWithClerk>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
