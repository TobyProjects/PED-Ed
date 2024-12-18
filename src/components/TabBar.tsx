import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "./ui/text";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { cn } from "@/utils/cn";
import { useLinkBuilder } from "@react-navigation/native";
import { PlatformPressable } from "@react-navigation/elements";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { buildHref } = useLinkBuilder();

  return (
    <View className="absolute bottom-6 flex-row justify-between items-center bg-background mx-5 py-4 rounded-full border border-border">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <PlatformPressable
            key={route.name}
            className="flex-1 justify-center items-center"
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            {React.cloneElement(options.tabBarIcon(), {
              className: cn("text-foreground text-center", {
                "text-primary": isFocused,
              }),
            })}
            <Text
              className={cn("text-foreground text-center", {
                "text-primary": isFocused,
              })}
            >
              {label}
            </Text>
          </PlatformPressable>
        );
      })}
    </View>
  );
}
