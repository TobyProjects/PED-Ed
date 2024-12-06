import { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
	name: "ped-ed-app",
	slug: "ped-ed-app",
	version: "1.0.0",
	orientation: "portrait",
	icon: "./src/assets/images/icon.png",
	scheme: "peded",
	userInterfaceStyle: "automatic",
	newArchEnabled: true,
	ios: {
		supportsTablet: true,
	},
	android: {
		adaptiveIcon: {
			foregroundImage: "./src/assets/images/adaptive-icon.png",
			backgroundColor: "#ffffff",
		},
	},
	web: {
		bundler: "metro",
		output: "static",
		favicon: "./src/assets/images/favicon.png",
	},
	plugins: [
    "expo-secure-store",
		"expo-router",
		"expo-localization",
		[
			"expo-splash-screen",
			{
				image: "./src/assets/images/splash-icon.png",
				imageWidth: 200,
				resizeMode: "contain",
				backgroundColor: "#ffffff",
			},
		],
	],
	experiments: {
		typedRoutes: true,
	},
	extra: {
		router: {
			origin: false,
		},
		eas: {
			projectId: "722c7430-f3ad-45d3-b7b6-d69bb82a18d2",
		},
	},
	owner: "drdefined",
};

export default config;
