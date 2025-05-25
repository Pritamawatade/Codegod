// src/store/useThemeStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'dark', // default theme
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'dark' ? 'light' : 'dark';

          // Apply to <html> tag
          document.documentElement.classList.toggle('dark', newTheme === 'dark');

          return { theme: newTheme };
        }),
      setTheme: (newTheme) => {
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        set({ theme: newTheme });
      },
    }),
    {
      name: 'theme-storage', // name in localStorage
    }
  )
);

export default useThemeStore;
