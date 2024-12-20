import { View, Text, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play } from "@/components/icons/Play";
import { RotateCcw } from "@/components/icons/RotateCcw";
import { Settings2 } from "@/components/icons/Settings2";
import { Pause } from "@/components/icons/Pause";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { usePomodoroStore } from "@/hooks/usePomodoroStore";
import { seconds2Minutes } from "@/utils/Time";
import { Audio } from "expo-av";

export default function CircularClock() {
  const {
    isActive,
    currentCycle,
    setIsActive,
    cycles,
    timeLeft,
    setTimeLeft,
    workDuration,
    breakDuration,
    state,
    setState,
    setCurrentCycle,
  } = usePomodoroStore();

  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const { t } = useTranslation();
  const [sound, setSound] = useState<Audio.SoundObject>();

  async function playSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      require("@/assets/audios/beep.mp3"),
    );
    setSound(sound);
    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const handleReset = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsActive(false);
    setTimeLeft(seconds2Minutes(workDuration));
    setState("work");
    setCurrentCycle(1);
  };

  useEffect(() => {
    if (timeLeft <= 0) {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      setIsActive(false);

      if (state === "work") {
        playSound();
        setState("break");
        setTimeLeft(seconds2Minutes(breakDuration));
        setIsActive(true); // Automatically start the break period
      } else {
        const nextCycle = currentCycle + 1;
        playSound();

        if (nextCycle <= cycles) {
          setState("work");
          setCurrentCycle(nextCycle);
          setTimeLeft(seconds2Minutes(workDuration));
          setIsActive(true);
        } else {
          playSound();
          handleReset();
        }
      }
      return;
    }

    if (!isActive) {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      return;
    }

    const newIntervalId = setInterval(() => {
      setTimeLeft(seconds2Minutes(timeLeft - 1));
    }, 1000);

    setIntervalId(newIntervalId);

    return () => {
      if (newIntervalId) {
        clearInterval(newIntervalId);
      }
    };
  }, [isActive, timeLeft, state]);

  return (
    <View>
      <View>
        <Text className="text-foreground text-center text-2xl">
          {state === "work" ? t("text.clockWork") : t("text.clockBreak")}
        </Text>
      </View>
      <View className="mx-auto">
        <Countdown timeLeft={timeLeft} />
      </View>
      <View>
        <Text className="text-foreground text-center text-2xl">
          {t("text.cycles", {
            current: currentCycle,
            total: cycles,
          })}
        </Text>
      </View>
      <View className="flex mx-auto flex-row gap-3 mt-3">
        <Button
          className="flex flex-row gap-1"
          variant={isActive ? "destructive" : "default"}
          onPress={() => setIsActive(!isActive)}
        >
          {isActive ? (
            <>
              <Pause className="text-foreground" />
              <Text className="text-foreground">{t("button.stop")}</Text>
            </>
          ) : (
            <>
              <Play className="text-foreground" />
              <Text className="text-foreground">{t("button.start")}</Text>
            </>
          )}
        </Button>
        <Button className="flex flex-row gap-1" onPress={handleReset}>
          <RotateCcw className="text-foreground" />
          <Text className="text-foreground">{t("button.reset")}</Text>
        </Button>
        <Button
          className="flex flex-row gap-1"
          onPress={() => router.replace("/(protected)/(pomodoro)/config")}
        >
          <Settings2 className="text-foreground" />
          <Text className="text-foreground">{t("button.settings")}</Text>
        </Button>
      </View>
    </View>
  );
}

function Countdown({ timeLeft }: { timeLeft: number }) {
  const { width } = Dimensions.get("window");
  const scale = width / 375;
  const fontSize = 60 * scale;

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = Math.floor(timeLeft % 60);
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  return (
    <Text className="text-foreground" style={{ fontSize: fontSize }}>
      {hours > 0
        ? `${hours}:${formattedMinutes}:${formattedSeconds}`
        : `${formattedMinutes}:${formattedSeconds}`}
    </Text>
  );
}
