import { create } from 'zustand';
import { User } from 'firebase/auth';

interface AppState {
  user: User | null;
  dbUser: any | null;
  setUser: (user: User | null) => void;
  setDbUser: (dbUser: any | null) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  dbUser: null,
  setUser: (user) => set({ user }),
  setDbUser: (dbUser) => set({ dbUser }),
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  theme: 'dark',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
}));
