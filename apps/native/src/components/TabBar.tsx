import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "./ui/text";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { cn } from "@/utils/cn";
import { useLinkBuilder } from "@react-navigation/native";
import { PlatformPressable } from "@react-navigation/elements";

export default function TabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { buildHref } = useLinkBuilder();

  return (
    <View className="flex-row justify-around items-center bg-background/95 border-t border-border/40">
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
            className="flex items-center justify-center py-2"
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
