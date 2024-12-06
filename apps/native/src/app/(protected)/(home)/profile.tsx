import * as React from "react";
import { Alert, Pressable, ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { Cog } from "@/components/icons/Cog";
import { Pencil } from "@/components/icons/Pencil";
import { router } from "expo-router";
import { LogOut } from "@/components/icons/LogOut";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@clerk/clerk-expo";

export default function TabsScreen() {
  const { signOut } = useAuth();

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
          <View>
            <Avatar alt="User Avatar" className="w-32 h-32">
              <AvatarImage
                source={{ uri: "https://github.com/definedentity.png" }}
              />
              <AvatarFallback>
                <Text>A</Text>
              </AvatarFallback>
            </Avatar>
          </View>
          <View>
            <Text className="text-3xl text-center font-semibold">Test</Text>
            <Text className="text-center text-muted-foreground text-lg">
              test
            </Text>
          </View>
          <View className="flex-row justify-center items-center">
            <Button className="w-11/12 flex-row gap-3 rounded-3xl">
              <Text>
                <Pencil className="text-foreground" />
              </Text>
              <Text className="">Edit profile</Text>
            </Button>
          </View>
          <View className="w-11/12">
            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  About Me
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Text>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Molestias asperiores a voluptatem maxime vel dolorem quos,
                  eligendi sit, veritatis neque quod laudantium ullam minus
                  inventore quo iste, accusamus eius aliquam.
                </Text>
              </CardContent>
              <CardFooter className="flex-col items-start">
                <Text className="text-sm font-semibold">Member Since</Text>
                <Text>June 25, 2023</Text>
              </CardFooter>
            </Card>
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
              <Text className="">Sign Out</Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
