import { create } from "zustand";

export enum Day {
  morning = "morning",
  afternoon = "afternoon",
  evening = "evening",
}

interface DateStore {
  day: Day;
  setDay: (day: Day) => void;
}

export const useDateStore = create<DateStore>((set) => ({
  day: Day.morning,
  setDay: (day: Day) => set({ day }),
}));

export interface FlashcardImageForm {
  image: Blob | null;
  setImage: (image: Blob) => void;
}

export const useFlashcardImageFormStore = create<FlashcardImageForm>((set) => ({
  image: null,
  setImage: (image: Blob | null) => set({ image }),
}));
