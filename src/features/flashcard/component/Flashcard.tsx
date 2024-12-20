import { Dimensions, View } from "react-native";
import {Image} from "expo-image";
import React from "react";
import { Text } from "@/components/ui/text";
import Animated, {
  interpolate,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

interface FlashcardProps {
  isFlipped: boolean;
  direction: string;
  duration: number;
  term: string;
  definition: string;
  image: string | null;
}

export default function ({
  term,
  definition,
  image,
  duration,
  isFlipped,
  direction,
}: FlashcardProps) {
  const isDirectionX = direction === "x";

  const regularCardAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(Number(isFlipped), [0, 1], [0, 180]);
    const rotateValue = withTiming(`${spinValue}deg`, { duration });

    return {
      transform: [
        isDirectionX ? { rotateX: rotateValue } : { rotateY: rotateValue },
      ],
      backfaceVisibility: "hidden",
    };
  });

  const flippedCardAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(Number(isFlipped), [0, 1], [180, 360]);
    const rotateValue = withTiming(`${spinValue}deg`, { duration });

    return {
      transform: [
        isDirectionX ? { rotateX: rotateValue } : { rotateY: rotateValue },
      ],
      backfaceVisibility: "hidden",
    };
  });

  return (
    <View className="w-full h-full">
      <Animated.View
        className="absolute border border-border rounded-lg h-full w-full flex items-center justify-center"
        style={[regularCardAnimatedStyle]}
      >
        {image != null && image != "" ? (
          <Image
            source={image}
            width={Dimensions.get("window").width * 0.45}
            height={Dimensions.get("window").height * 0.45}
            style={{ resizeMode: "contain" }}
          />
        ) : null}
        <Text className="text-foreground p-3">{term}</Text>
      </Animated.View>
      <Animated.View
        className="border border-border rounded-lg h-full w-full flex items-center justify-center"
        style={[flippedCardAnimatedStyle]}
      >
        <Text className="text-foreground p-3">{definition}</Text>
      </Animated.View>
    </View>
  );
}
