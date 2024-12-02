import "@/styles/global.css";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme } from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import * as React from "react";
import { NAV_THEME } from "@/constants/Themes";
import { useColorScheme } from "@/hooks/useColorScheme";
import "@/locales/i18n";
import { useTranslation } from "react-i18next";
import { useFonts } from "expo-font";
import { PortalHost } from "@rn-primitives/portal";
import AuthProvider from "@/components/AuthProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster } from "sonner-native";

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  dark: true,
  colors: NAV_THEME.dark,
};

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
  const { i18n } = useTranslation();
  const [loaded, error] = useFonts({
    UniSansHeavyRegular: require("@/assets/fonts/UniSansHeavyRegular.ttf"),
  });

  React.useEffect(() => {
    async function loadTheme() {
      const theme = await AsyncStorage.getItem("theme");

      if (!theme) {
        AsyncStorage.setItem("theme", colorScheme);
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

    (async () => {
      await loadTheme();
      await loadFonts();
    })().finally(() => {
      SplashScreen.hideAsync();
    });
  }, []);

  React.useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem("language");
      if (savedLanguage) {
        i18n.changeLanguage(savedLanguage);
      }
    };
    loadLanguage();
  }, [i18n]);

  if (!isColorSchemeLoaded) {
    return null;
  }

  if (!loaded && !error) {
    return null;
  }

  return (
    <AuthProvider>
      <GestureHandlerRootView>
        <Stack />
        <PortalHost />
        <Toaster position="top-center" />
      </GestureHandlerRootView>
    </AuthProvider>
  );
}
