import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { getHours } from "date-fns";
import { Day, useDateStore } from "@/hooks/store";
import { useQuery } from "@tanstack/react-query";
import { getRandomQuote } from "@/features/quote/server/getRandomQuote";

interface GreetingCardProps {
  name: string;
}

export function GreetingCard({ name }: GreetingCardProps) {
  const { t } = useTranslation();
  const dateStore = useDateStore();

  useEffect(() => {
    const currentHour = getHours(new Date());
    if (currentHour < 12) {
      dateStore.setDay(Day.morning);
    } else if (currentHour >= 12 && currentHour < 18) {
      dateStore.setDay(Day.afternoon);
    } else {
      dateStore.setDay(Day.evening);
    }
  }, []);

  const quote = useQuery({
    queryKey: ["quote"],
    queryFn: () => {
      return getRandomQuote("en");
    },
  });

  return (
    <Card className="w-full max-w-md mx-auto mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold text-foreground">
          {dateStore.day === Day.morning
            ? t("text.hiMorning", { name })
            : (t("text.hiAfternoon", { name }) ??
              t("text.hiEvening", { name }))}
        </CardTitle>
        <CardDescription>
          {dateStore.day === Day.morning
            ? t("text.morning")
            : (t("text.afternoon") ?? t("text.evening"))}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <View className="border-l-4 border-primary pl-4 italic text-muted-foreground">
          <Text>&#8220;{quote.data?.quote}&#8221;</Text>
          <View className="text-right mt-2 text-sm text-muted-foreground">
            <Text>— {quote.data?.author}</Text>
          </View>
        </View>
      </CardContent>
    </Card>
  );
}
