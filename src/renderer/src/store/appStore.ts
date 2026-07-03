import { create } from 'zustand'
import type { AppState, Soundboard, Settings } from '@shared/types'

interface AppStore {
  soundboards: Soundboard[]
  settings: Settings
  selectedBoardId: string | null
  loaded: boolean
  load: () => Promise<void>
  applyState: (state: AppState) => void
  selectBoard: (id: string) => void
}

const emptySettings: Settings = { language: 'en', outputDeviceIds: [], masterVolume: 1 }

export const useAppStore = create<AppStore>((set, get) => ({
  soundboards: [],
  settings: emptySettings,
  selectedBoardId: null,
  loaded: false,
  load: async () => {
    const state = await window.api.getState()
    get().applyState(state)
    set({ loaded: true })
  },
  applyState: (state: AppState) => {
    set((prev) => {
      const stillExists = state.soundboards.some((b) => b.id === prev.selectedBoardId)
      return {
        soundboards: state.soundboards,
        settings: state.settings,
        selectedBoardId: stillExists ? prev.selectedBoardId : (state.soundboards[0]?.id ?? null)
      }
    })
  },
  selectBoard: (id: string) => set({ selectedBoardId: id })
}))
