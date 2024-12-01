import { ArrowLeft } from "@/components/icons/ArrowLeft";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { useNavigation } from "expo-router";
import { t } from "i18next";
import React, { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = Yup.object({
	email: Yup.string()
		.email(t("form.error.email.invalid"))
		.required(t("form.error.email.required")),
	displayName: Yup.string()
		.required(t("form.error.displayName.required"))
		.min(5, t("form.error.displayName.tooShort"))
		.max(20, t("form.error.displayName.tooLong")),
	username: Yup.string()
		.required(t("form.error.username.required"))
		.min(5, t("form.error.username.tooShort"))
		.max(20, t("form.error.username.tooLong")),
	password: Yup.string()
		.required(t("form.error.password.required"))
		.min(8, t("form.error.password.tooShort"))
		.max(100, t("form.error.password.tooLong")),
	password2: Yup.string().oneOf(
		[Yup.ref("password")],
		t("form.error.password.mismatch")
	),
});

export default function SignUp() {
	const navigation = useNavigation();
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
	});

	useEffect(() => {
		navigation.setOptions({
			headerTransparent: true,
			headerTitle: "",
			headerLeft: () => (
				<ArrowLeft
					onPress={() => navigation.goBack()}
					className="text-foreground"
				/>
			),
		});
	}, [navigation]);

	function dismissKeyboard() {
		Keyboard.dismiss();
	}

	function onSubmit(data) {
		console.log(data);
	}

	return (
		<TouchableWithoutFeedback onPress={dismissKeyboard}>
			<View className="bg-background h-screen">
				<SafeAreaView className="my-12">
					<View className="w-11/12 mx-auto">
						<Text className="text-foreground text-center font-bold text-5xl font-uniSansHeavy">
							{t("form.register.title")}
						</Text>
						<View className="mt-12">
							<View className="flex gap-3">
								<View>
									<Label
										nativeID="email"
										className="font-bold"
									>
										{t("form.register.label.email")}
									</Label>
									<Controller
										control={control}
										name="email"
										render={({
											field: { onChange, onBlur, value },
										}) => (
											<Input
												placeholder={t(
													"form.register.label.email"
												)}
												inputMode="email"
												aria-labelledby="email"
												onChangeText={onChange}
												onBlur={onBlur}
												value={value}
											/>
										)}
									/>
									{errors && errors["email"] && (
										<Label
											className="text-destructive"
											nativeID="email"
										>
											{errors["email"].message}
										</Label>
									)}
								</View>
								<View>
									<Label
										nativeID="displayName"
										className="font-bold"
									>
										{t("form.register.label.displayName")}
									</Label>
									<Controller
										control={control}
										name="displayName"
										render={({
											field: { onChange, onBlur, value },
										}) => (
											<Input
												placeholder={t(
													"form.register.label.displayName.tip"
												)}
												inputMode="text"
												aria-labelledby="displayName"
												onChangeText={onChange}
												onBlur={onBlur}
												value={value}
											/>
										)}
									/>
									{errors && errors["displayName"] && (
										<Label
											className="text-destructive"
											nativeID="displayName"
										>
											{errors["displayName"].message}
										</Label>
									)}
								</View>
								<View>
									<Label nativeID="username">
										{t("form.register.label.username")}
									</Label>
									<Controller
										control={control}
										name="username"
										render={({
											field: { onChange, onBlur, value },
										}) => (
											<Input
												placeholder={t(
													"form.register.placeholder.username"
												)}
												inputMode="text"
												aria-labelledby="username"
												onChangeText={onChange}
												onBlur={onBlur}
												value={value}
											/>
										)}
									/>
									{errors && errors["username"] && (
										<Label
											className="text-destructive"
											nativeID="username"
										>
											{errors["username"].message}
										</Label>
									)}
								</View>
								<View>
									<Label
										nativeID="password"
										className="font-bold"
									>
										{t("form.register.label.password")}
									</Label>
									<Controller
										control={control}
										name="password"
										render={({
											field: { onChange, onBlur, value },
										}) => (
											<Input
												placeholder={t(
													"form.register.placeholder.password"
												)}
												inputMode="text"
												aria-labelledby="password"
												onChangeText={onChange}
												secureTextEntry={true}
												onBlur={onBlur}
												value={value}
											/>
										)}
									/>
									{errors && errors["password"] && (
										<Label
											className="text-destructive"
											nativeID="password"
										>
											{errors["password"].message}
										</Label>
									)}
								</View>
								<View>
									<Label
										nativeID="password2"
										className="font-bold"
									>
										{t("form.register.label.password2")}
									</Label>
									<Controller
										control={control}
										name="password2"
										render={({
											field: { onChange, onBlur, value },
										}) => (
											<Input
												inputMode="text"
												aria-labelledby="password2"
												onChangeText={onChange}
												secureTextEntry={true}
												onBlur={onBlur}
												value={value}
											/>
										)}
									/>
									{errors && errors["password2"] && (
										<Label
											className="text-destructive"
											nativeID="password2"
										>
											{errors["password2"].message}
										</Label>
									)}
								</View>

								<Button
									className="text-foreground"
									onPress={handleSubmit(onSubmit)}
								>
									<Text>{t("form.register.button")}</Text>
								</Button>
							</View>
						</View>
					</View>
				</SafeAreaView>
			</View>
		</TouchableWithoutFeedback>
	);
}
