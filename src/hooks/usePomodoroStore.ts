import { minutes2Seconds, seconds2Minutes } from "@/utils/Time";
import { create } from "zustand";

export interface PomodoroStore {
  workDuration: number;
  getWorkDurationInMinutes: () => number;
  setWorkDuration: (workDuration: number) => void;
  breakDuration: number;
  getBreakDurationInMinutes: () => number;
  setBreakDuration: (breakDuration: number) => void;
  cycles: number;
  setCycles: (cycles: number) => void;
  currentCycle: number;
  setCurrentCycle: (currentCycle: number) => void;
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
  timeLeft: number;
  setTimeLeft: (timeLeft: number) => void;
  state: "work" | "break";
  setState: (state: "work" | "break") => void;
}

export const usePomodoroStore = create<PomodoroStore>((set, get) => ({
  cycles: 1,
  currentCycle: 0,
  setCycles: (cycles: number) => {
    set({ cycles });
    set({ currentCycle: 1 });
  },
  setCurrentCycle: (currentCycle: number) => {
    set({ currentCycle });
  },
  breakDuration: 5 * 60,
  getBreakDurationInMinutes: (): number => {
    return seconds2Minutes(get().breakDuration);
  },
  setBreakDuration: (breakDuration: number) => {
    set({ breakDuration: minutes2Seconds(breakDuration) });
  },
  workDuration: 25 * 60,
  getWorkDurationInMinutes: (): number => {
    return seconds2Minutes(get().workDuration);
  },
  setWorkDuration: (workDuration: number) => {
    set({
      workDuration: minutes2Seconds(workDuration),
      timeLeft: minutes2Seconds(workDuration),
    });
  },
  isActive: false,
  setIsActive: (isActive: boolean) => {
    set({ isActive });
  },
  timeLeft: 25 * 60,
  setTimeLeft: (timeLeft: number) => {
    set({ timeLeft: minutes2Seconds(timeLeft) });
  },
  state: "work",
  setState: (state: "work" | "break") => {
    set({ state });
  },
}));
