import { create } from 'zustand';

export const useUIStore = create((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  searchOpen: false,
  setSearchOpen: (open) => set({ searchOpen: open }),
}));

export const useEditorStore = create((set) => ({
  isDirty: false,
  setDirty: (dirty) => set({ isDirty: dirty }),
  isSaving: false,
  setIsSaving: (saving) => set({ isSaving: saving }),
  lastSaved: null,
  setLastSaved: (date) => set({ lastSaved: date }),
}));
