import { create } from 'zustand'

interface UIState {
  focusMode: boolean
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  
  // Actions
  toggleFocusMode: () => void
  setFocusMode: (enabled: boolean) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setTheme: (theme: 'light' | 'dark') => void
}

export const useUIStore = create<UIState>((set) => ({
  focusMode: false,
  sidebarOpen: false, // Will be set based on screen size in component
  theme: 'dark',

  toggleFocusMode: () =>
    set((state) => {
      const newFocusMode = !state.focusMode
      const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
      return {
        focusMode: newFocusMode,
        sidebarOpen: newFocusMode ? false : isDesktop,
      }
    }),

  setFocusMode: (enabled) =>
    set(() => {
      const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
      return {
        focusMode: enabled,
        sidebarOpen: enabled ? false : isDesktop,
      }
    }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  setTheme: (theme) => set({ theme }),
}))
