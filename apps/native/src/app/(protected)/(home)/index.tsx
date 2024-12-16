import { Text } from "@/components/ui/text";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { api } from "../../../../convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import ContentLoader from "react-content-loader/native";
import { GreetingCard } from "@/features/home/components/GreetingCard";

export default function () {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const user = useAuth();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-foreground text-xl font-semibold">
          {t("tab.home")}
        </Text>
      ),
    });
  }, [navigation]);

  const userQuery = useQuery(
    convexQuery(api.users.getUserByClerkId, { clerk_id: user?.userId! }),
  );

  return (
    <ScrollView className="bg-background w-full h-full">
      <View className="w-11/12 mx-auto mt-12">
        {userQuery.isPending ? (
          <ContentLoader width={"100%"} />
        ) : (
          <GreetingCard
            name={`${userQuery.data?.first_name} ${userQuery.data?.last_name}`}
          />
        )}
      </View>
    </ScrollView>
  );
}
