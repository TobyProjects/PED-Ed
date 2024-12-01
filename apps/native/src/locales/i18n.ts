import i18n, { t } from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import en from "../assets/locales/en.json";
import vi from "../assets/locales/vi.json";

const resources = {
	en: { translation: en },
	vi: { translation: vi },
};

const initI18n = async () => {
	let savedLanguage = await AsyncStorage.getItem("language");

	if (!savedLanguage) {
		savedLanguage = Localization.getLocales()[0].languageCode!!; // FIXME
	}

	i18n.use(initReactI18next).init({
		resources,
		lng: savedLanguage,
		fallbackLng: "en",
		interpolation: {
			escapeValue: false, // react already safes from xss
		},
	});
};

initI18n();

export default i18n;
