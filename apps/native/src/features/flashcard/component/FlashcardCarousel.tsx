import { View, Pressable, Dimensions } from "react-native";
import React, { useRef, useState } from "react";
import Flashcard from "./Flashcard";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import { NAV_THEME } from "@/constants/Themes";

export default function ({ flashcards }: { flashcards: any }) {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const scrollOffsetValue = useSharedValue<number>(0);
  const progress = useSharedValue<number>(0);
  const ref = useRef<ICarouselInstance>(null);

  const baseOptions = {
    width: Dimensions.get("window").width * 0.8,
    height: Dimensions.get("window").height * 0.8,
    loop: true,
    pagingEnabled: true,
    snapEnabled: true,
    ref: ref,
  };

  return (
    <View className="mx-auto">
      <Carousel
        {...baseOptions}
        data={flashcards}
        defaultScrollOffsetValue={scrollOffsetValue}
        onProgressChange={progress}
        renderItem={(card) => (
          <Pressable onPress={() => setIsFlipped(!isFlipped)}>
            <Flashcard
              term={card.item.term}
              definition={card.item.definition}
              isFlipped={isFlipped}
              direction={"x"}
              duration={300}
            />
          </Pressable>
        )}
      />
      <View className="mt-6">
        <Pagination.Basic
          progress={progress}
          data={["defaultDataWith6Colors", "3", "4"]}
          dotStyle={{ backgroundColor: "#9eb0ff" }}
          activeDotStyle={{ backgroundColor: NAV_THEME.dark.primary }}
          containerStyle={{ gap: 5, marginBottom: 10 }}
        />
      </View>
    </View>
  );
}
