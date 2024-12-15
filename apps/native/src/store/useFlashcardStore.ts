import { create } from "zustand";

interface FlashCardStoreType {
  image: Blob | null;
  setImage: (image: Blob) => void;
}

export const useFlashcardStore = create<FlashCardStoreType>((set) => ({
  image: null,
  setImage: (image: Blob | null) => set(() => ({ image })),
}));
