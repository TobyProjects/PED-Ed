import { View } from "react-native";
import React from "react";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Avatar as RNRAvatar } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";

export interface AvatarProps {
  firstName: string;
  lastName: string;
  username: string;
  avatar: string;
}

export default function Avatar({
  firstName,
  lastName,
  username,
  avatar,
}: AvatarProps) {
  return (
    <>
      <View>
        <RNRAvatar alt="User Avatar" className="w-32 h-32">
          <AvatarImage source={{ uri: avatar }} />
          <AvatarFallback>
            <Text>Avatar</Text>
          </AvatarFallback>
        </RNRAvatar>
      </View>
      <View>
        <Text className="text-3xl text-center font-semibold">
          {firstName} {lastName}
        </Text>
        <Text className="text-center text-muted-foreground text-lg">
          {username}
        </Text>
      </View>
    </>
  );
}
