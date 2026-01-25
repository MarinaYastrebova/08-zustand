import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CreateNoteData } from '@/lib/api';

interface NoteStore {
  draft: CreateNoteData;
  setDraft: (note: Partial<CreateNoteData>) => void;
  clearDraft: () => void;
}

const initialDraft: CreateNoteData = {
  title: '',
  content: '',
  tag: 'Todo',
};

export const useNoteStore = create<NoteStore>()(
  persist(
    set => ({
      draft: initialDraft,
      setDraft: note =>
        set(state => ({
          draft: { ...state.draft, ...note },
        })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: 'note-draft-storage',
    }
  )
);
