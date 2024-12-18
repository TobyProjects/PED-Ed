import { create } from "zustand";

export interface UpdateFlashcardFormStore {
  image: Blob | null;
  setImage: (image: Blob | null) => void;
}

export const useUpdateFlashcardFormStore = create<UpdateFlashcardFormStore>(
  (set) => ({
    image: null,
    setImage: (image: Blob | null) => set({ image }),
  }),
);
